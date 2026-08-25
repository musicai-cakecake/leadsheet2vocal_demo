from __future__ import annotations

import argparse
import csv
import json
import math
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np

from .config import EvalConfig
from .evaluator import VocalPairEvaluator


SUMMARY_METRICS = {
    "alignment.content_dtw_cost": "MFCC-content DTW mean cosine cost",
    "pitch.content_pitch_cent_distance": (
        "Primary pitch distance: 10%-trimmed absolute cent error on the "
        "content alignment path"
    ),
    "pitch.content_macro_pitch_cent_distance": (
        "Macro-pitch distance after voiced-run median smoothing, in cents"
    ),
    "pitch.voicing_jaccard_distance": (
        "Voicing mismatch divided by the voiced union on the alignment path"
    ),
    "pitch.direct_f0_dtw_cost": (
        "Pitch-driven DTW baseline cost in semitone-equivalent units"
    ),
    "rhythm.tempo_log_distance": "Absolute log active-duration ratio",
    "events.note_edit_distance": (
        "Normalized weighted edit distance between pseudo-note sequences"
    ),
    "events.note_gap_ratio": "Inserted/deleted pseudo-note ratio",
    "events.event_ioi_normalized_distance": (
        "Mean absolute distance between matched normalized inter-onset intervals"
    ),
    "events.global_rhythm_distance": (
        "Full-phrase tempo-sensitive onset-duration distance; onset is 50%, "
        "matched-event duration is 25%, and phrase duration ratio is 25%"
    ),
    "events.global_rhythm_onset_component": (
        "Additive GT-duration-normalized onset component"
    ),
    "events.global_rhythm_duration_component": (
        "Additive duration component (event duration plus phrase duration)"
    ),
    "events.global_rhythm_phrase_duration_component": (
        "Additive whole-phrase duration-ratio component"
    ),
    "events.global_rhythm_alignment_gap_ratio": (
        "Diagnostic inserted/deleted-event ratio; excluded from global score"
    ),
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Evaluate elastic pitch and rhythm distances between gen_vocal.mp3 "
            "and gt_vocal.mp3 pairs."
        )
    )
    parser.add_argument(
        "--root",
        type=Path,
        required=True,
        help="Cohort directory whose immediate subdirectories contain vocal pairs.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        help="Result directory (default: estimate_tools/results/<root-name>).",
    )
    parser.add_argument(
        "--sample-ids-from",
        type=Path,
        help=(
            "Restrict evaluation to pair-directory names present in this "
            "reference cohort; fail if any reference pair is missing."
        ),
    )
    parser.add_argument("--limit", type=int, help="Evaluate only the first N pairs.")
    parser.add_argument(
        "--f0-backend",
        choices=("auto", "rmvpe", "pyin"),
        default="auto",
        help="F0 extractor. auto tries MLX-RMVPE, then pYIN.",
    )
    parser.add_argument(
        "--dtw-band-radius",
        type=float,
        default=0.35,
        help="Sakoe-Chiba band radius as a fraction of the shorter sequence.",
    )
    parser.add_argument(
        "--no-cache",
        action="store_true",
        help="Do not cache extracted F0 and content features.",
    )
    parser.add_argument(
        "--save-alignments",
        action="store_true",
        help="Save per-sample DTW paths and F0 tracks as compressed NPZ files.",
    )
    parser.add_argument(
        "--skip-direct-f0-baseline",
        action="store_true",
        help="Skip the pitch-driven DTW baseline.",
    )
    parser.add_argument(
        "--skip-event-metrics",
        action="store_true",
        help="Skip supplementary pseudo-note edit/IOI metrics.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"Audio cohort does not exist: {root}")

    output_dir = (
        args.output_dir.resolve()
        if args.output_dir
        else Path(__file__).resolve().parent / "results" / root.name
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    item_dir = output_dir / "items"
    item_dir.mkdir(parents=True, exist_ok=True)
    cache_dir = None if args.no_cache else output_dir / "cache"
    alignment_dir = output_dir / "alignments" if args.save_alignments else None

    config = EvalConfig(
        f0_backend=args.f0_backend,
        dtw_band_radius=args.dtw_band_radius,
    )
    evaluator = VocalPairEvaluator(
        config,
        cache_dir=cache_dir,
        alignment_dir=alignment_dir,
        include_direct_f0_baseline=not args.skip_direct_f0_baseline,
        include_event_metrics=not args.skip_event_metrics,
    )

    reference_root: Path | None = None
    reference_ids: set[str] | None = None
    if args.sample_ids_from is not None:
        reference_root = args.sample_ids_from.resolve()
        if not reference_root.is_dir():
            raise SystemExit(f"Reference cohort does not exist: {reference_root}")
        reference_ids = {path.name for path in discover_pairs(reference_root)}
        if not reference_ids:
            raise SystemExit(f"No reference vocal pairs found under {reference_root}")

    sample_dirs = discover_pairs(root, include_ids=reference_ids)
    if reference_ids is not None:
        discovered_ids = {path.name for path in sample_dirs}
        missing_ids = sorted(reference_ids - discovered_ids)
        if missing_ids:
            raise SystemExit(
                "Target cohort is missing reference pairs: " + ", ".join(missing_ids)
            )
    if args.limit is not None:
        if args.limit < 1:
            raise SystemExit("--limit must be at least 1")
        sample_dirs = sample_dirs[: args.limit]
    if not sample_dirs:
        raise SystemExit(f"No gen_vocal.mp3 / gt_vocal.mp3 pairs found under {root}")

    print(f"Evaluating {len(sample_dirs)} vocal pairs from {root}")
    if reference_root is not None:
        print(f"Restricted to pair IDs from {reference_root}")
    items: list[dict[str, Any]] = []
    for index, sample_dir in enumerate(sample_dirs, start=1):
        print(f"[{index:>3}/{len(sample_dirs)}] {sample_dir.name}", flush=True)
        try:
            item = evaluator.evaluate_directory(sample_dir)
            pitch_distance = item["pitch"].get("content_pitch_cent_distance")
            global_rhythm = item["events"].get("global_rhythm_distance")
            print(
                "      "
                f"pitch={_format_number(pitch_distance, 1)} cent, "
                f"global_rhythm={_format_number(global_rhythm, 4)}, "
                f"runtime={item['runtime_sec']:.2f}s",
                flush=True,
            )
        except Exception as exc:
            item = {
                "sample_id": sample_dir.name,
                "status": "error",
                "error": f"{type(exc).__name__}: {exc}",
                "traceback": traceback.format_exc(),
            }
            print(f"      ERROR: {item['error']}", file=sys.stderr, flush=True)
        item = sanitize_json(item)
        items.append(item)
        (item_dir / f"{sample_dir.name}.json").write_text(
            json.dumps(item, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    summary = summarize(items)
    result = {
        "created_at": datetime.now().astimezone().isoformat(),
        "cohort_root": str(root),
        "output_dir": str(output_dir),
        "sample_filter": (
            {
                "type": "reference_cohort_pair_ids",
                "reference_root": str(reference_root),
                "pair_count": len(reference_ids),
            }
            if reference_root is not None and reference_ids is not None
            else None
        ),
        "config": config.as_dict(),
        "metric_definitions": SUMMARY_METRICS,
        "summary": summary,
        "items": items,
    }
    result = sanitize_json(result)
    (output_dir / "results.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_csv(output_dir / "results.csv", items)
    write_summary_markdown(output_dir / "summary.md", root, summary)

    print_summary(summary)
    return 0 if summary["successful_pairs"] > 0 else 1


def discover_pairs(root: Path, include_ids: set[str] | None = None) -> list[Path]:
    sample_dirs = [
        path
        for path in root.iterdir()
        if path.is_dir()
        and (include_ids is None or path.name in include_ids)
        and (path / "gen_vocal.mp3").is_file()
        and (path / "gt_vocal.mp3").is_file()
    ]
    return sorted(sample_dirs, key=_sample_sort_key)


def summarize(items: list[dict[str, Any]]) -> dict[str, Any]:
    successful = [item for item in items if item.get("status") == "ok"]
    failed = [item for item in items if item.get("status") != "ok"]
    metrics: dict[str, Any] = {}
    for path, description in SUMMARY_METRICS.items():
        values = [
            value
            for item in successful
            if (value := _nested_number(item, path)) is not None
        ]
        metrics[path] = {
            "description": description,
            **_distribution(values),
        }
    return {
        "total_pairs": len(items),
        "successful_pairs": len(successful),
        "failed_pairs": len(failed),
        "failed_sample_ids": [item.get("sample_id") for item in failed],
        "metrics": metrics,
    }


def _distribution(values: list[float]) -> dict[str, Any]:
    if not values:
        return {"count": 0}
    array = np.asarray(values, dtype=np.float64)
    rng = np.random.default_rng(20260825)
    if len(array) == 1:
        ci_low = ci_high = float(array[0])
    else:
        indices = rng.integers(0, len(array), size=(2_000, len(array)))
        bootstrap_means = np.mean(array[indices], axis=1)
        ci_low, ci_high = np.percentile(bootstrap_means, [2.5, 97.5])
    return {
        "count": int(len(array)),
        "mean": float(np.mean(array)),
        "std": float(np.std(array, ddof=1)) if len(array) > 1 else 0.0,
        "median": float(np.median(array)),
        "q25": float(np.percentile(array, 25)),
        "q75": float(np.percentile(array, 75)),
        "min": float(np.min(array)),
        "max": float(np.max(array)),
        "bootstrap_mean_ci95": [float(ci_low), float(ci_high)],
    }


def write_csv(path: Path, items: list[dict[str, Any]]) -> None:
    rows = [_flatten(item) for item in items]
    fieldnames = sorted({key for row in rows for key in row})
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_summary_markdown(
    path: Path, cohort_root: Path, summary: dict[str, Any]
) -> None:
    lines = [
        f"# Elastic vocal evaluation: {cohort_root.name}",
        "",
        f"- Cohort: `{cohort_root}`",
        f"- Successful pairs: {summary['successful_pairs']}/{summary['total_pairs']}",
        f"- Failed pairs: {summary['failed_pairs']}",
        "",
        "All reported distances are lower-is-better.",
        "",
        "| Metric | Mean | Median | 95% bootstrap CI of mean | N |",
        "| --- | ---: | ---: | ---: | ---: |",
    ]
    for metric, stats in summary["metrics"].items():
        if not stats.get("count"):
            continue
        ci = stats["bootstrap_mean_ci95"]
        lines.append(
            f"| `{metric}` | {stats['mean']:.6g} | {stats['median']:.6g} | "
            f"[{ci[0]:.6g}, {ci[1]:.6g}] | {stats['count']} |"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def print_summary(summary: dict[str, Any]) -> None:
    print(
        "\nCompleted: "
        f"{summary['successful_pairs']}/{summary['total_pairs']} successful, "
        f"{summary['failed_pairs']} failed"
    )
    for key in (
        "pitch.content_pitch_cent_distance",
        "rhythm.tempo_log_distance",
        "events.global_rhythm_distance",
        "events.note_edit_distance",
    ):
        stats = summary["metrics"].get(key, {})
        if stats.get("count"):
            print(
                f"  {key}: mean={stats['mean']:.6g}, "
                f"median={stats['median']:.6g}"
            )


def sanitize_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(key): sanitize_json(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [sanitize_json(item) for item in value]
    if isinstance(value, np.generic):
        return sanitize_json(value.item())
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    return value


def _nested_number(item: dict[str, Any], path: str) -> float | None:
    value: Any = item
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            return None
        value = value[part]
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        number = float(value)
        return number if math.isfinite(number) else None
    return None


def _flatten(value: dict[str, Any], prefix: str = "") -> dict[str, Any]:
    output: dict[str, Any] = {}
    for key, item in value.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(item, dict):
            output.update(_flatten(item, path))
        elif isinstance(item, (list, tuple)):
            output[path] = json.dumps(item, ensure_ascii=False)
        else:
            output[path] = item
    return output


def _sample_sort_key(path: Path) -> tuple[int, str]:
    prefix = path.name.split("_", 1)[0]
    try:
        return int(prefix), path.name
    except ValueError:
        return sys.maxsize, path.name


def _format_number(value: Any, precision: int) -> str:
    if not isinstance(value, (int, float)) or not math.isfinite(float(value)):
        return "n/a"
    return f"{float(value):.{precision}f}"


if __name__ == "__main__":
    raise SystemExit(main())
