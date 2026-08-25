from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from scipy.ndimage import median_filter
from scipy.stats import trim_mean

from .config import EvalConfig


@dataclass(frozen=True)
class NoteEvent:
    onset_sec: float
    offset_sec: float
    pitch_midi: float

    @property
    def duration_sec(self) -> float:
        return self.offset_sec - self.onset_sec


def extract_note_events(f0_hz: np.ndarray, config: EvalConfig) -> list[NoteEvent]:
    """Build a conservative pseudo-note sequence from a monophonic F0 track.

    This is a supplementary diagnostic, not a replacement for a trained
    singing-transcription model.
    """

    f0_hz = np.asarray(f0_hz, dtype=np.float64)
    midi = np.full(f0_hz.shape, np.nan, dtype=np.float64)
    voiced = f0_hz > 0
    midi[voiced] = 69.0 + 12.0 * np.log2(f0_hz[voiced] / 440.0)
    midi = _fill_short_dropouts(midi, config.event_max_gap_frames)
    midi = _smooth_voiced_runs(midi, config.event_smooth_frames)

    labels = np.full(len(midi), -10_000, dtype=np.int32)
    labels[np.isfinite(midi)] = np.rint(midi[np.isfinite(midi)]).astype(np.int32)
    labels = _remove_short_voiced_runs(labels, config.event_min_note_frames)

    events: list[NoteEvent] = []
    for start, end, label in _runs(labels):
        if label == -10_000 or end - start < config.event_min_note_frames:
            continue
        raw = midi[start:end]
        pitch = float(np.nanmedian(raw))
        events.append(
            NoteEvent(
                onset_sec=start * config.hop_seconds,
                offset_sec=end * config.hop_seconds,
                pitch_midi=pitch,
            )
        )
    return events


def event_sequence_metrics(
    gen_events: list[NoteEvent],
    gt_events: list[NoteEvent],
    gen_duration_sec: float,
    gt_duration_sec: float,
    config: EvalConfig,
) -> dict[str, float | int]:
    n_gen = len(gen_events)
    n_gt = len(gt_events)
    if n_gen == 0 and n_gt == 0:
        return {
            "gen_note_events": 0,
            "gt_note_events": 0,
            "note_edit_distance": 0.0,
            "note_gap_ratio": 0.0,
            "note_pitch_semitone_distance": float("nan"),
            "event_duration_log_distance": float("nan"),
            "event_ioi_normalized_distance": float("nan"),
            "event_onset_normalized_distance": float("nan"),
            "matched_note_events": 0,
        }
    if n_gen == 0 or n_gt == 0:
        return {
            "gen_note_events": n_gen,
            "gt_note_events": n_gt,
            "note_edit_distance": 1.0,
            "note_gap_ratio": 1.0,
            "note_pitch_semitone_distance": float("nan"),
            "event_duration_log_distance": float("nan"),
            "event_ioi_normalized_distance": float("nan"),
            "event_onset_normalized_distance": float("nan"),
            "matched_note_events": 0,
        }

    gen_duration_sec = max(gen_duration_sec, 1e-8)
    gt_duration_sec = max(gt_duration_sec, 1e-8)
    dp = np.full((n_gen + 1, n_gt + 1), np.inf, dtype=np.float64)
    operation = np.zeros((n_gen + 1, n_gt + 1), dtype=np.int8)
    dp[0, 0] = 0.0
    for i in range(1, n_gen + 1):
        dp[i, 0] = i * config.event_gap_cost
        operation[i, 0] = 1
    for j in range(1, n_gt + 1):
        dp[0, j] = j * config.event_gap_cost
        operation[0, j] = 2

    for i in range(1, n_gen + 1):
        for j in range(1, n_gt + 1):
            substitution = dp[i - 1, j - 1] + _event_substitution_cost(
                gen_events[i - 1],
                gt_events[j - 1],
                gen_duration_sec,
                gt_duration_sec,
                config,
            )
            deletion = dp[i - 1, j] + config.event_gap_cost
            insertion = dp[i, j - 1] + config.event_gap_cost
            candidates = (substitution, deletion, insertion)
            choice = int(np.argmin(candidates))
            dp[i, j] = candidates[choice]
            operation[i, j] = choice

    matches: list[tuple[int, int]] = []
    insertions = 0
    deletions = 0
    i, j = n_gen, n_gt
    while i > 0 or j > 0:
        choice = int(operation[i, j])
        if i > 0 and j > 0 and choice == 0:
            matches.append((i - 1, j - 1))
            i -= 1
            j -= 1
        elif i > 0 and (j == 0 or choice == 1):
            deletions += 1
            i -= 1
        else:
            insertions += 1
            j -= 1
    matches.reverse()

    pitch_errors = np.asarray(
        [
            abs(gen_events[i].pitch_midi - gt_events[j].pitch_midi)
            for i, j in matches
        ],
        dtype=np.float64,
    )
    duration_errors = np.asarray(
        [
            abs(
                np.log(
                    (gen_events[i].duration_sec / gen_duration_sec + 1e-8)
                    / (gt_events[j].duration_sec / gt_duration_sec + 1e-8)
                )
            )
            for i, j in matches
        ],
        dtype=np.float64,
    )
    onset_errors = np.asarray(
        [
            abs(
                gen_events[i].onset_sec / gen_duration_sec
                - gt_events[j].onset_sec / gt_duration_sec
            )
            for i, j in matches
        ],
        dtype=np.float64,
    )
    ioi_errors: list[float] = []
    for (gen_previous, gt_previous), (gen_current, gt_current) in zip(
        matches, matches[1:]
    ):
        gen_ioi = (
            gen_events[gen_current].onset_sec
            - gen_events[gen_previous].onset_sec
        ) / gen_duration_sec
        gt_ioi = (
            gt_events[gt_current].onset_sec - gt_events[gt_previous].onset_sec
        ) / gt_duration_sec
        ioi_errors.append(abs(gen_ioi - gt_ioi))

    return {
        "gen_note_events": n_gen,
        "gt_note_events": n_gt,
        "note_edit_distance": float(dp[n_gen, n_gt] / max(n_gen, n_gt)),
        "note_gap_ratio": float((insertions + deletions) / (n_gen + n_gt)),
        "note_pitch_semitone_distance": _trimmed_or_nan(pitch_errors),
        "event_duration_log_distance": _mean_or_nan(duration_errors),
        "event_ioi_normalized_distance": _mean_or_nan(np.asarray(ioi_errors)),
        "event_onset_normalized_distance": _mean_or_nan(onset_errors),
        "matched_note_events": len(matches),
    }


def global_rhythm_metrics(
    gen_events: list[NoteEvent],
    gt_events: list[NoteEvent],
    gen_duration_sec: float,
    gt_duration_sec: float,
    config: EvalConfig,
) -> dict[str, float | int]:
    """Compare the full ordered onset-duration pattern without using pitch.

    Onset errors use the fixed GT active duration as their denominator, so a
    long generated output cannot dilute its own timing drift. The duration
    half of the score combines matched-event duration error and whole-phrase
    duration-ratio error. A monotonic edit alignment establishes event
    correspondence, but its gap count is diagnostic only and cannot cancel
    onset/duration errors. The score is in [0, 1] and intentionally retains
    tempo/stretch differences, unlike the local affine-path metric.
    """

    n_gen = len(gen_events)
    n_gt = len(gt_events)
    gen_duration_sec = max(gen_duration_sec, 1e-8)
    gt_duration_sec = max(gt_duration_sec, 1e-8)
    onset_weight, duration_weight = _normalized_global_rhythm_weights(config)
    event_duration_share = 0.5
    phrase_duration_share = 0.5
    phrase_duration_cost = min(
        abs(np.log(gen_duration_sec / gt_duration_sec)) / np.log(2.0),
        1.0,
    )

    if n_gen == 0 and n_gt == 0:
        phrase_component = (
            duration_weight * phrase_duration_share * phrase_duration_cost
        )
        return {
            "global_rhythm_distance": float(phrase_component),
            "global_rhythm_onset_component": 0.0,
            "global_rhythm_duration_component": float(phrase_component),
            "global_rhythm_event_duration_component": 0.0,
            "global_rhythm_phrase_duration_component": float(phrase_component),
            "global_rhythm_onset_mae": float("nan"),
            "global_rhythm_duration_relative_mae": float("nan"),
            "global_rhythm_phrase_duration_log_normalized": float(
                phrase_duration_cost
            ),
            "global_rhythm_alignment_gap_ratio": 0.0,
            "global_rhythm_matched_events": 0,
            "global_rhythm_insertions": 0,
            "global_rhythm_deletions": 0,
        }
    if n_gen == 0 or n_gt == 0:
        event_component = duration_weight * event_duration_share
        phrase_component = duration_weight * phrase_duration_share
        return {
            "global_rhythm_distance": 1.0,
            "global_rhythm_onset_component": float(onset_weight),
            "global_rhythm_duration_component": float(duration_weight),
            "global_rhythm_event_duration_component": float(event_component),
            "global_rhythm_phrase_duration_component": float(phrase_component),
            "global_rhythm_onset_mae": float("nan"),
            "global_rhythm_duration_relative_mae": float("nan"),
            "global_rhythm_phrase_duration_log_normalized": float(
                phrase_duration_cost
            ),
            "global_rhythm_alignment_gap_ratio": 1.0,
            "global_rhythm_matched_events": 0,
            "global_rhythm_insertions": n_gt if n_gen == 0 else 0,
            "global_rhythm_deletions": n_gen if n_gt == 0 else 0,
        }

    dp = np.full((n_gen + 1, n_gt + 1), np.inf, dtype=np.float64)
    operation = np.zeros((n_gen + 1, n_gt + 1), dtype=np.int8)
    dp[0, 0] = 0.0
    for i in range(1, n_gen + 1):
        dp[i, 0] = i * config.global_rhythm_gap_cost
        operation[i, 0] = 1
    for j in range(1, n_gt + 1):
        dp[0, j] = j * config.global_rhythm_gap_cost
        operation[0, j] = 2

    for i in range(1, n_gen + 1):
        for j in range(1, n_gt + 1):
            onset_cost, duration_cost = _global_rhythm_pair_costs(
                gen_events[i - 1],
                gt_events[j - 1],
                gen_duration_sec,
                gt_duration_sec,
            )
            substitution = (
                dp[i - 1, j - 1]
                + onset_weight * onset_cost
                + duration_weight * duration_cost
            )
            deletion = dp[i - 1, j] + config.global_rhythm_gap_cost
            insertion = dp[i, j - 1] + config.global_rhythm_gap_cost
            candidates = (substitution, deletion, insertion)
            choice = int(np.argmin(candidates))
            dp[i, j] = candidates[choice]
            operation[i, j] = choice

    matches: list[tuple[int, int]] = []
    insertions = 0
    deletions = 0
    i, j = n_gen, n_gt
    while i > 0 or j > 0:
        choice = int(operation[i, j])
        if i > 0 and j > 0 and choice == 0:
            matches.append((i - 1, j - 1))
            i -= 1
            j -= 1
        elif i > 0 and (j == 0 or choice == 1):
            deletions += 1
            i -= 1
        else:
            insertions += 1
            j -= 1
    matches.reverse()

    pair_costs = [
        _global_rhythm_pair_costs(
            gen_events[gen_index],
            gt_events[gt_index],
            gen_duration_sec,
            gt_duration_sec,
        )
        for gen_index, gt_index in matches
    ]
    onset_costs = np.asarray([cost[0] for cost in pair_costs], dtype=np.float64)
    duration_costs = np.asarray(
        [cost[1] for cost in pair_costs], dtype=np.float64
    )
    gap_count = insertions + deletions
    onset_mae = _mean_or_nan(onset_costs)
    event_duration_mae = _mean_or_nan(duration_costs)
    onset_component = onset_weight * onset_mae
    event_duration_component = (
        duration_weight * event_duration_share * event_duration_mae
    )
    phrase_duration_component = (
        duration_weight * phrase_duration_share * phrase_duration_cost
    )
    duration_component = event_duration_component + phrase_duration_component
    distance = onset_component + duration_component
    alignment_gap_ratio = gap_count / (n_gen + n_gt)

    return {
        "global_rhythm_distance": float(distance),
        "global_rhythm_onset_component": float(onset_component),
        "global_rhythm_duration_component": float(duration_component),
        "global_rhythm_event_duration_component": float(
            event_duration_component
        ),
        "global_rhythm_phrase_duration_component": float(
            phrase_duration_component
        ),
        "global_rhythm_onset_mae": float(onset_mae),
        "global_rhythm_duration_relative_mae": float(event_duration_mae),
        "global_rhythm_phrase_duration_log_normalized": float(
            phrase_duration_cost
        ),
        "global_rhythm_alignment_gap_ratio": float(alignment_gap_ratio),
        "global_rhythm_matched_events": len(matches),
        "global_rhythm_insertions": insertions,
        "global_rhythm_deletions": deletions,
    }


def _event_substitution_cost(
    gen_event: NoteEvent,
    gt_event: NoteEvent,
    gen_duration_sec: float,
    gt_duration_sec: float,
    config: EvalConfig,
) -> float:
    pitch_cost = min(abs(gen_event.pitch_midi - gt_event.pitch_midi) / 12.0, 1.0)
    gen_duration = gen_event.duration_sec / gen_duration_sec
    gt_duration = gt_event.duration_sec / gt_duration_sec
    duration_cost = min(
        abs(np.log((gen_duration + 1e-8) / (gt_duration + 1e-8)))
        / np.log(4.0),
        1.0,
    )
    return (
        config.event_pitch_weight * pitch_cost
        + config.event_duration_weight * duration_cost
    )


def _global_rhythm_pair_costs(
    gen_event: NoteEvent,
    gt_event: NoteEvent,
    gen_duration_sec: float,
    gt_duration_sec: float,
) -> tuple[float, float]:
    onset_cost = min(
        abs(gen_event.onset_sec - gt_event.onset_sec) / gt_duration_sec,
        1.0,
    )

    gen_duration = gen_event.duration_sec
    gt_duration = gt_event.duration_sec
    duration_cost = abs(gen_duration - gt_duration) / (
        gen_duration + gt_duration + 1e-8
    )
    return float(onset_cost), float(min(duration_cost, 1.0))


def _normalized_global_rhythm_weights(config: EvalConfig) -> tuple[float, float]:
    total = (
        config.global_rhythm_onset_weight
        + config.global_rhythm_duration_weight
    )
    if total <= 0:
        raise ValueError("Global rhythm onset/duration weights must sum above zero")
    return (
        config.global_rhythm_onset_weight / total,
        config.global_rhythm_duration_weight / total,
    )


def _fill_short_dropouts(midi: np.ndarray, max_gap_frames: int) -> np.ndarray:
    output = midi.copy()
    finite = np.isfinite(output)
    for start, end, is_voiced in _boolean_runs(finite):
        if is_voiced or end - start > max_gap_frames:
            continue
        if start == 0 or end == len(output):
            continue
        left = output[start - 1]
        right = output[end]
        if np.isfinite(left) and np.isfinite(right) and abs(left - right) <= 0.5:
            output[start:end] = np.linspace(left, right, end - start + 2)[1:-1]
    return output


def _smooth_voiced_runs(midi: np.ndarray, requested_width: int) -> np.ndarray:
    output = midi.copy()
    finite = np.isfinite(output)
    for start, end, is_voiced in _boolean_runs(finite):
        if not is_voiced:
            continue
        length = end - start
        width = min(requested_width, length if length % 2 else length - 1)
        if width >= 3:
            output[start:end] = median_filter(
                output[start:end], size=width, mode="nearest"
            )
    return output


def _remove_short_voiced_runs(labels: np.ndarray, min_frames: int) -> np.ndarray:
    output = labels.copy()
    unvoiced = -10_000
    for _ in range(2):
        runs = _runs(output)
        changed = False
        for index, (start, end, label) in enumerate(runs):
            if label == unvoiced or end - start >= min_frames:
                continue
            previous = runs[index - 1] if index > 0 else None
            following = runs[index + 1] if index + 1 < len(runs) else None
            replacement = unvoiced
            if previous and following and previous[2] == following[2] != unvoiced:
                replacement = previous[2]
            elif previous and previous[2] != unvoiced and (
                following is None or following[2] == unvoiced
            ):
                replacement = previous[2]
            elif following and following[2] != unvoiced and (
                previous is None or previous[2] == unvoiced
            ):
                replacement = following[2]
            output[start:end] = replacement
            changed = True
        if not changed:
            break
    return output


def _runs(values: np.ndarray) -> list[tuple[int, int, int]]:
    values = np.asarray(values)
    if values.size == 0:
        return []
    boundaries = np.flatnonzero(np.diff(values) != 0) + 1
    starts = np.r_[0, boundaries]
    ends = np.r_[boundaries, len(values)]
    return [
        (int(start), int(end), int(values[start]))
        for start, end in zip(starts, ends)
    ]


def _boolean_runs(mask: np.ndarray) -> list[tuple[int, int, bool]]:
    mask = np.asarray(mask, dtype=bool)
    if mask.size == 0:
        return []
    boundaries = np.flatnonzero(np.diff(mask.astype(np.int8)) != 0) + 1
    starts = np.r_[0, boundaries]
    ends = np.r_[boundaries, len(mask)]
    return [
        (int(start), int(end), bool(mask[start]))
        for start, end in zip(starts, ends)
    ]


def _trimmed_or_nan(values: np.ndarray) -> float:
    values = np.asarray(values, dtype=np.float64)
    if values.size == 0:
        return float("nan")
    if values.size < 10:
        return float(np.mean(values))
    return float(trim_mean(values, 0.10))


def _mean_or_nan(values: np.ndarray) -> float:
    values = np.asarray(values, dtype=np.float64)
    return float(np.mean(values)) if values.size else float("nan")
