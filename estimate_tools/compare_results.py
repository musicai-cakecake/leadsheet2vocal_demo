from __future__ import annotations

import argparse
import csv
import json
import math
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np


@dataclass(frozen=True)
class MetricSpec:
    key: str
    source_path: str
    label: str
    unit: str
    scale: float = 1.0
    decimals: int = 4


METRICS = (
    MetricSpec(
        "pitch_cent",
        "pitch.content_pitch_cent_distance",
        "Content-aligned pitch distance",
        "cent",
        decimals=2,
    ),
    MetricSpec(
        "macro_pitch_cent",
        "pitch.content_macro_pitch_cent_distance",
        "Smoothed macro-pitch distance",
        "cent",
        decimals=2,
    ),
    MetricSpec(
        "direct_f0_pitch_cent",
        "pitch.direct_f0_pitch_cent_distance",
        "Direct F0-DTW pitch baseline",
        "cent",
        decimals=2,
    ),
    MetricSpec(
        "voicing_mismatch_percent",
        "pitch.voicing_jaccard_distance",
        "Voicing Jaccard distance",
        "%",
        scale=100.0,
        decimals=3,
    ),
    MetricSpec(
        "tempo_log",
        "rhythm.tempo_log_distance",
        "Global tempo log distance",
        "",
        decimals=4,
    ),
    MetricSpec(
        "global_rhythm",
        "events.global_rhythm_distance",
        "Global tempo-sensitive onset-duration rhythm distance",
        "",
        decimals=4,
    ),
    MetricSpec(
        "global_rhythm_onset",
        "events.global_rhythm_onset_component",
        "Global rhythm onset component",
        "",
        decimals=4,
    ),
    MetricSpec(
        "global_rhythm_duration",
        "events.global_rhythm_duration_component",
        "Global rhythm total duration component",
        "",
        decimals=4,
    ),
    MetricSpec(
        "global_rhythm_phrase_duration",
        "events.global_rhythm_phrase_duration_component",
        "Global rhythm whole-phrase duration component",
        "",
        decimals=4,
    ),
    MetricSpec(
        "global_rhythm_alignment_gap_percent",
        "events.global_rhythm_alignment_gap_ratio",
        "Global rhythm alignment-gap diagnostic",
        "%",
        scale=100.0,
        decimals=3,
    ),
    MetricSpec(
        "note_edit",
        "events.note_edit_distance",
        "Pseudo-note edit distance",
        "",
        decimals=4,
    ),
    MetricSpec(
        "note_gap_percent",
        "events.note_gap_ratio",
        "Pseudo-note insertion/deletion ratio",
        "%",
        scale=100.0,
        decimals=3,
    ),
    MetricSpec(
        "event_ioi_percent",
        "events.event_ioi_normalized_distance",
        "Matched normalized IOI distance",
        "%",
        scale=100.0,
        decimals=3,
    ),
    MetricSpec(
        "content_dtw",
        "alignment.content_dtw_cost",
        "Content DTW alignment cost",
        "",
        decimals=4,
    ),
)

PRIMARY_KEYS = (
    "pitch_cent",
    "global_rhythm",
    "tempo_log",
    "note_edit",
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Create a strict paired comparison between two evaluation runs."
    )
    parser.add_argument("--m6-results", type=Path, required=True)
    parser.add_argument("--levo2-results", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    m6_data = _read_json(args.m6_results.resolve())
    levo2_data = _read_json(args.levo2_results.resolve())
    comparison = compare_runs(m6_data, levo2_data)

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "comparison.json").write_text(
        json.dumps(comparison, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_long_csv(output_dir / "comparison_long.csv", comparison)
    write_wide_csv(output_dir / "comparison_wide.csv", comparison)
    write_markdown(output_dir / "comparison.md", comparison)
    print_summary(comparison)
    return 0


def compare_runs(
    m6_data: dict[str, Any], levo2_data: dict[str, Any]
) -> dict[str, Any]:
    m6_items = _successful_items(m6_data, "M6")
    levo2_items = _successful_items(levo2_data, "LeVo2")
    m6_ids = set(m6_items)
    levo2_ids = set(levo2_items)
    if m6_ids != levo2_ids:
        missing_from_levo2 = sorted(m6_ids - levo2_ids)
        extra_in_levo2 = sorted(levo2_ids - m6_ids)
        raise ValueError(
            "Evaluation sample sets differ. "
            f"Missing from LeVo2: {missing_from_levo2}; "
            f"extra in LeVo2: {extra_in_levo2}"
        )

    rows: list[dict[str, Any]] = []
    for sample_id in sorted(m6_ids, key=_sample_sort_key):
        row: dict[str, Any] = {"sample_id": sample_id, "metrics": {}}
        for spec in METRICS:
            m6_value = _required_number(m6_items[sample_id], spec.source_path)
            levo2_value = _required_number(
                levo2_items[sample_id], spec.source_path
            )
            m6_value *= spec.scale
            levo2_value *= spec.scale
            delta = levo2_value - m6_value
            row["metrics"][spec.key] = {
                "label": spec.label,
                "unit": spec.unit,
                "m6": m6_value,
                "levo2": levo2_value,
                "delta_levo2_minus_m6": delta,
                "lower_distance_model": (
                    "M6"
                    if delta > 0
                    else "LeVo2"
                    if delta < 0
                    else "Tie"
                ),
            }
        rows.append(row)

    summaries: dict[str, Any] = {}
    for spec in METRICS:
        m6_values = np.asarray(
            [row["metrics"][spec.key]["m6"] for row in rows], dtype=np.float64
        )
        levo2_values = np.asarray(
            [row["metrics"][spec.key]["levo2"] for row in rows],
            dtype=np.float64,
        )
        delta = levo2_values - m6_values
        summaries[spec.key] = {
            "label": spec.label,
            "unit": spec.unit,
            "m6_mean": float(np.mean(m6_values)),
            "m6_median": float(np.median(m6_values)),
            "levo2_mean": float(np.mean(levo2_values)),
            "levo2_median": float(np.median(levo2_values)),
            "mean_delta_levo2_minus_m6": float(np.mean(delta)),
            "median_delta_levo2_minus_m6": float(np.median(delta)),
            "mean_delta_bootstrap_ci95": _paired_bootstrap_ci(delta),
            "m6_lower_count": int(np.count_nonzero(delta > 0)),
            "levo2_lower_count": int(np.count_nonzero(delta < 0)),
            "tie_count": int(np.count_nonzero(delta == 0)),
        }

    return {
        "models": {
            "ours": "M6",
            "base": "LeVo2",
            "delta_definition": "LeVo2 - M6",
            "delta_interpretation": (
                "Positive means M6 has the lower distance; "
                "negative means LeVo2 has the lower distance."
            ),
        },
        "sample_count": len(rows),
        "sample_ids": [row["sample_id"] for row in rows],
        "source_results": {
            "m6_cohort_root": m6_data.get("cohort_root"),
            "levo2_cohort_root": levo2_data.get("cohort_root"),
        },
        "metric_order": [spec.key for spec in METRICS],
        "primary_metric_order": list(PRIMARY_KEYS),
        "summary": summaries,
        "items": rows,
    }


def write_long_csv(path: Path, comparison: dict[str, Any]) -> None:
    fields = (
        "sample_id",
        "metric",
        "label",
        "unit",
        "m6",
        "levo2",
        "delta_levo2_minus_m6",
        "lower_distance_model",
    )
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for item in comparison["items"]:
            for metric in comparison["metric_order"]:
                writer.writerow(
                    {
                        "sample_id": item["sample_id"],
                        "metric": metric,
                        **item["metrics"][metric],
                    }
                )


def write_wide_csv(path: Path, comparison: dict[str, Any]) -> None:
    rows: list[dict[str, Any]] = []
    for item in comparison["items"]:
        row: dict[str, Any] = {"sample_id": item["sample_id"]}
        for metric in comparison["metric_order"]:
            values = item["metrics"][metric]
            row[f"{metric}.m6"] = values["m6"]
            row[f"{metric}.levo2"] = values["levo2"]
            row[f"{metric}.delta_levo2_minus_m6"] = values[
                "delta_levo2_minus_m6"
            ]
            row[f"{metric}.lower_distance_model"] = values[
                "lower_distance_model"
            ]
        rows.append(row)
    fieldnames = list(rows[0]) if rows else ["sample_id"]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_markdown(path: Path, comparison: dict[str, Any]) -> None:
    summary = comparison["summary"]
    metric_by_key = {spec.key: spec for spec in METRICS}
    lines = [
        "# M6 vs LeVo2 paired vocal comparison",
        "",
        f"- Matched samples: {comparison['sample_count']}",
        "- All metrics are lower-is-better.",
        "- Delta is `LeVo2 - M6`: positive favors M6; negative favors LeVo2.",
        "",
        "## Cohort means",
        "",
        "| Metric | Unit | M6 mean | LeVo2 mean | Mean delta | M6 lower | LeVo2 lower |",
        "| --- | --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for metric in comparison["metric_order"]:
        spec = metric_by_key[metric]
        values = summary[metric]
        lines.append(
            f"| {spec.label} | {spec.unit or '—'} | "
            f"{values['m6_mean']:.{spec.decimals}f} | "
            f"{values['levo2_mean']:.{spec.decimals}f} | "
            f"{values['mean_delta_levo2_minus_m6']:+.{spec.decimals}f} | "
            f"{values['m6_lower_count']} | {values['levo2_lower_count']} |"
        )

    pitch = metric_by_key["pitch_cent"]
    lines.extend(
        [
            "",
            "## Per-sample primary pitch distance",
            "",
            "| Sample | M6 pitch (cent) | LeVo2 pitch (cent) | Δ pitch |",
            "| --- | ---: | ---: | ---: |",
        ]
    )
    for item in comparison["items"]:
        pitch_values = item["metrics"][pitch.key]
        lines.append(
            f"| `{item['sample_id']}` | "
            f"{pitch_values['m6']:.{pitch.decimals}f} | "
            f"{pitch_values['levo2']:.{pitch.decimals}f} | "
            f"{pitch_values['delta_levo2_minus_m6']:+.{pitch.decimals}f} |"
        )

    global_rhythm = metric_by_key["global_rhythm"]
    lines.extend(
        [
            "",
            "## Per-sample global onset-duration rhythm distance",
            "",
            "| Sample | M6 | LeVo2 | Δ = LeVo2 - M6 | Lower-distance model |",
            "| --- | ---: | ---: | ---: | --- |",
        ]
    )
    for item in comparison["items"]:
        values = item["metrics"][global_rhythm.key]
        lines.append(
            f"| `{item['sample_id']}` | "
            f"{values['m6']:.{global_rhythm.decimals}f} | "
            f"{values['levo2']:.{global_rhythm.decimals}f} | "
            f"{values['delta_levo2_minus_m6']:+.{global_rhythm.decimals}f} | "
            f"{values['lower_distance_model']} |"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def print_summary(comparison: dict[str, Any]) -> None:
    print(
        f"Compared M6 and LeVo2 on {comparison['sample_count']} matched samples"
    )
    for metric in PRIMARY_KEYS:
        values = comparison["summary"][metric]
        print(
            f"  {metric}: M6={values['m6_mean']:.6g}, "
            f"LeVo2={values['levo2_mean']:.6g}, "
            f"delta={values['mean_delta_levo2_minus_m6']:+.6g}, "
            f"wins={values['m6_lower_count']}-{values['levo2_lower_count']}"
        )


def _successful_items(
    data: dict[str, Any], model_name: str
) -> dict[str, dict[str, Any]]:
    items = data.get("items")
    if not isinstance(items, list):
        raise ValueError(f"{model_name} result has no items list")
    errors = [
        item.get("sample_id")
        for item in items
        if not isinstance(item, dict) or item.get("status") != "ok"
    ]
    if errors:
        raise ValueError(f"{model_name} contains failed items: {errors}")
    output = {str(item["sample_id"]): item for item in items}
    if len(output) != len(items):
        raise ValueError(f"{model_name} contains duplicate sample IDs")
    return output


def _required_number(item: dict[str, Any], path: str) -> float:
    value: Any = item
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            raise ValueError(
                f"Sample {item.get('sample_id')} is missing metric {path}"
            )
        value = value[part]
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError(
            f"Sample {item.get('sample_id')} has non-numeric metric {path}"
        )
    number = float(value)
    if not math.isfinite(number):
        raise ValueError(
            f"Sample {item.get('sample_id')} has non-finite metric {path}"
        )
    return number


def _paired_bootstrap_ci(delta: np.ndarray) -> list[float]:
    if len(delta) == 1:
        return [float(delta[0]), float(delta[0])]
    rng = np.random.default_rng(20260825)
    indices = rng.integers(0, len(delta), size=(5_000, len(delta)))
    means = np.mean(delta[indices], axis=1)
    low, high = np.percentile(means, [2.5, 97.5])
    return [float(low), float(high)]


def _read_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise SystemExit(f"Result file does not exist: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"Expected JSON object: {path}")
    return data


def _sample_sort_key(sample_id: str) -> tuple[int, str]:
    prefix = sample_id.split("_", 1)[0]
    try:
        return int(prefix), sample_id
    except ValueError:
        return sys.maxsize, sample_id


if __name__ == "__main__":
    raise SystemExit(main())
