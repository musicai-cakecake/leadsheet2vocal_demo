from __future__ import annotations

from dataclasses import dataclass

import librosa
import numpy as np
from scipy.ndimage import median_filter
from scipy.spatial.distance import cdist
from scipy.stats import trim_mean

from .config import EvalConfig


@dataclass
class AlignmentResult:
    path: np.ndarray
    local_costs: np.ndarray
    mean_cost: float
    cumulative_cost: float
    constraint_fallback: bool


_DTW_STEPS = np.asarray([[1, 1], [0, 1], [1, 0]], dtype=np.uint32)
_DTW_STEP_PENALTIES = np.asarray([0.0, 0.05, 0.05], dtype=np.float64)


def align_content(
    gen_content: np.ndarray,
    gt_content: np.ndarray,
    config: EvalConfig,
) -> AlignmentResult:
    """Align vocals using content-oriented MFCC dynamics without F0 input."""

    cost = cdist(gen_content.T, gt_content.T, metric="cosine")
    cost = np.nan_to_num(cost, nan=2.0, posinf=2.0, neginf=0.0)
    return align_cost_matrix(cost, config)


def align_cost_matrix(cost: np.ndarray, config: EvalConfig) -> AlignmentResult:
    if cost.ndim != 2 or min(cost.shape) < 2:
        raise ValueError(f"DTW cost matrix is too small: {cost.shape}")
    length_ratio = max(cost.shape) / min(cost.shape)
    if length_ratio > 3.0:
        raise ValueError(
            f"Active-duration frame ratio {length_ratio:.3f} exceeds the "
            "configured evaluation range (3.0)"
        )

    fallback = False
    try:
        accumulated, path = librosa.sequence.dtw(
            C=np.asarray(cost, dtype=np.float64),
            step_sizes_sigma=_DTW_STEPS,
            weights_add=_DTW_STEP_PENALTIES,
            global_constraints=True,
            band_rad=config.dtw_band_radius,
            backtrack=True,
        )
    except Exception:
        fallback = True
        accumulated, path = librosa.sequence.dtw(
            C=np.asarray(cost, dtype=np.float64),
            step_sizes_sigma=_DTW_STEPS,
            weights_add=_DTW_STEP_PENALTIES,
            global_constraints=False,
            backtrack=True,
        )

    path = np.asarray(path[::-1], dtype=np.int32)
    local = np.asarray(cost[path[:, 0], path[:, 1]], dtype=np.float64)
    return AlignmentResult(
        path=path,
        local_costs=local,
        mean_cost=float(np.mean(local)),
        cumulative_cost=float(accumulated[-1, -1]),
        constraint_fallback=fallback,
    )


def pitch_metrics(
    gen_f0: np.ndarray,
    gt_f0: np.ndarray,
    content_path: np.ndarray,
    config: EvalConfig,
) -> dict[str, float | int]:
    path = _scale_path(
        content_path,
        source_lengths=(
            int(content_path[:, 0].max()) + 1,
            int(content_path[:, 1].max()) + 1,
        ),
        target_lengths=(len(gen_f0), len(gt_f0)),
    )
    gen_values = np.asarray(gen_f0)[path[:, 0]]
    gt_values = np.asarray(gt_f0)[path[:, 1]]
    gen_voiced = gen_values > 0
    gt_voiced = gt_values > 0
    both_voiced = gen_voiced & gt_voiced
    voiced_union = gen_voiced | gt_voiced

    errors = _cent_errors(gen_values[both_voiced], gt_values[both_voiced])
    stats = _pitch_error_stats(errors, config.pitch_trim_fraction)

    macro_gen = smooth_f0_contour(gen_f0, config.macro_pitch_window_frames)
    macro_gt = smooth_f0_contour(gt_f0, config.macro_pitch_window_frames)
    macro_errors = _cent_errors(
        macro_gen[path[:, 0]][both_voiced],
        macro_gt[path[:, 1]][both_voiced],
    )
    macro_distance = _robust_mean(macro_errors, config.pitch_trim_fraction)

    mismatch_count = int(np.count_nonzero(gen_voiced != gt_voiced))
    union_count = int(np.count_nonzero(voiced_union))
    metrics: dict[str, float | int] = {
        "content_pitch_cent_distance": stats["trimmed_mean"],
        "content_pitch_cent_mean": stats["mean"],
        "content_pitch_cent_median": stats["median"],
        "content_pitch_cent_rmse": stats["rmse"],
        "content_pitch_cent_p90": stats["p90"],
        "content_macro_pitch_cent_distance": macro_distance,
        "matched_voiced_path_ratio": float(
            np.count_nonzero(both_voiced) / max(len(path), 1)
        ),
        "voicing_jaccard_distance": float(
            mismatch_count / union_count if union_count else 0.0
        ),
        "matched_voiced_frames": int(np.count_nonzero(both_voiced)),
        "path_frames": int(len(path)),
    }
    return metrics


def direct_f0_dtw_metrics(
    gen_f0: np.ndarray,
    gt_f0: np.ndarray,
    config: EvalConfig,
) -> dict[str, float | int | bool]:
    """Pitch-driven DTW baseline; not used as the primary distance."""

    gen_f0 = np.asarray(gen_f0, dtype=np.float64)
    gt_f0 = np.asarray(gt_f0, dtype=np.float64)
    gen_voiced = gen_f0 > 0
    gt_voiced = gt_f0 > 0
    gen_cent = _hz_to_cent(gen_f0)
    gt_cent = _hz_to_cent(gt_f0)

    both_voiced = gen_voiced[:, None] & gt_voiced[None, :]
    both_unvoiced = (~gen_voiced)[:, None] & (~gt_voiced)[None, :]
    cost = np.full((len(gen_f0), len(gt_f0)), 6.0, dtype=np.float32)
    pitch_difference = np.abs(gen_cent[:, None] - gt_cent[None, :]) / 100.0
    cost[both_voiced] = np.minimum(pitch_difference[both_voiced], 12.0)
    cost[both_unvoiced] = 0.0

    alignment = align_cost_matrix(cost, config)
    path = alignment.path
    path_gen = gen_f0[path[:, 0]]
    path_gt = gt_f0[path[:, 1]]
    voiced = (path_gen > 0) & (path_gt > 0)
    errors = _cent_errors(path_gen[voiced], path_gt[voiced])
    return {
        "direct_f0_dtw_cost": alignment.mean_cost,
        "direct_f0_pitch_cent_distance": _robust_mean(
            errors, config.pitch_trim_fraction
        ),
        "direct_f0_matched_voiced_ratio": float(
            np.count_nonzero(voiced) / max(len(path), 1)
        ),
        "direct_f0_path_frames": int(len(path)),
        "direct_f0_constraint_fallback": alignment.constraint_fallback,
    }


def rhythm_metrics(
    content_path: np.ndarray,
    gen_frame_count: int,
    gt_frame_count: int,
    config: EvalConfig,
) -> dict[str, float]:
    """Measure local path warping separately from global tempo."""

    if len(content_path) < 2:
        raise ValueError("At least two DTW path points are required")
    gen_time = content_path[:, 0].astype(np.float64) * config.hop_seconds
    gt_time = content_path[:, 1].astype(np.float64) * config.hop_seconds

    design = np.column_stack([np.ones_like(gen_time), gen_time])
    intercept, slope = np.linalg.lstsq(design, gt_time, rcond=None)[0]
    residual = gt_time - (intercept + slope * gen_time)
    residual_rmse_sec = float(np.sqrt(np.mean(np.square(residual))))

    gen_duration = max((gen_frame_count - 1) * config.hop_seconds, 1e-8)
    gt_duration = max((gt_frame_count - 1) * config.hop_seconds, 1e-8)
    mean_duration = 0.5 * (gen_duration + gt_duration)

    gen_normalized = content_path[:, 0] / max(gen_frame_count - 1, 1)
    gt_normalized = content_path[:, 1] / max(gt_frame_count - 1, 1)
    diagonal_rmse = float(
        np.sqrt(np.mean(np.square(gen_normalized - gt_normalized)))
    )
    tempo_ratio = gen_duration / gt_duration

    return {
        "path_deviation_normalized": residual_rmse_sec / mean_duration,
        "path_deviation_ms": residual_rmse_sec * 1_000.0,
        "path_diagonal_rmse": diagonal_rmse,
        "tempo_ratio": float(tempo_ratio),
        "tempo_log_distance": float(abs(np.log(tempo_ratio))),
        "affine_intercept_sec": float(intercept),
        "affine_slope_gt_per_gen": float(slope),
    }


def smooth_f0_contour(f0: np.ndarray, window_frames: int) -> np.ndarray:
    f0 = np.asarray(f0, dtype=np.float64)
    output = f0.copy()
    voiced = f0 > 0
    for start, end in _true_runs(voiced):
        length = end - start
        width = min(window_frames, length if length % 2 else length - 1)
        if width >= 3:
            output[start:end] = median_filter(
                f0[start:end], size=width, mode="nearest"
            )
    return output


def _pitch_error_stats(
    errors: np.ndarray, trim_fraction: float
) -> dict[str, float]:
    errors = np.asarray(errors, dtype=np.float64)
    if errors.size == 0:
        return {
            "trimmed_mean": float("nan"),
            "mean": float("nan"),
            "median": float("nan"),
            "rmse": float("nan"),
            "p90": float("nan"),
        }
    return {
        "trimmed_mean": _robust_mean(errors, trim_fraction),
        "mean": float(np.mean(errors)),
        "median": float(np.median(errors)),
        "rmse": float(np.sqrt(np.mean(np.square(errors)))),
        "p90": float(np.percentile(errors, 90)),
    }


def _robust_mean(values: np.ndarray, trim_fraction: float) -> float:
    values = np.asarray(values, dtype=np.float64)
    if values.size == 0:
        return float("nan")
    if values.size < 10 or trim_fraction <= 0:
        return float(np.mean(values))
    return float(trim_mean(values, proportiontocut=trim_fraction))


def _cent_errors(first_hz: np.ndarray, second_hz: np.ndarray) -> np.ndarray:
    first_hz = np.asarray(first_hz, dtype=np.float64)
    second_hz = np.asarray(second_hz, dtype=np.float64)
    valid = (first_hz > 0) & (second_hz > 0)
    return np.abs(1_200.0 * np.log2(first_hz[valid] / second_hz[valid]))


def _hz_to_cent(f0: np.ndarray) -> np.ndarray:
    f0 = np.asarray(f0, dtype=np.float64)
    output = np.zeros_like(f0)
    voiced = f0 > 0
    output[voiced] = 1_200.0 * np.log2(f0[voiced] / 55.0)
    return output


def _scale_path(
    path: np.ndarray,
    source_lengths: tuple[int, int],
    target_lengths: tuple[int, int],
) -> np.ndarray:
    scaled = np.asarray(path, dtype=np.float64).copy()
    for axis in (0, 1):
        source_max = max(source_lengths[axis] - 1, 1)
        target_max = max(target_lengths[axis] - 1, 0)
        scaled[:, axis] = np.rint(scaled[:, axis] * target_max / source_max)
        scaled[:, axis] = np.clip(scaled[:, axis], 0, target_max)
    return scaled.astype(np.int32)


def _true_runs(mask: np.ndarray) -> list[tuple[int, int]]:
    padded = np.pad(np.asarray(mask, dtype=np.int8), (1, 1))
    changes = np.diff(padded)
    starts = np.flatnonzero(changes == 1)
    ends = np.flatnonzero(changes == -1)
    return list(zip(starts.tolist(), ends.tolist()))
