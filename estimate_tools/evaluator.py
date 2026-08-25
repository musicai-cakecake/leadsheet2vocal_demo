from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

import numpy as np

from .alignment import (
    align_content,
    direct_f0_dtw_metrics,
    pitch_metrics,
    rhythm_metrics,
)
from .config import EvalConfig
from .events import (
    event_sequence_metrics,
    extract_note_events,
    global_rhythm_metrics,
)
from .features import FeatureExtractor


class VocalPairEvaluator:
    """Evaluate one generated/ground-truth vocal pair."""

    def __init__(
        self,
        config: EvalConfig,
        cache_dir: Path | None = None,
        alignment_dir: Path | None = None,
        include_direct_f0_baseline: bool = True,
        include_event_metrics: bool = True,
    ):
        self.config = config
        self.extractor = FeatureExtractor(config, cache_dir=cache_dir)
        self.alignment_dir = alignment_dir
        self.include_direct_f0_baseline = include_direct_f0_baseline
        self.include_event_metrics = include_event_metrics
        if alignment_dir is not None:
            alignment_dir.mkdir(parents=True, exist_ok=True)

    def evaluate_directory(self, sample_dir: Path) -> dict[str, Any]:
        return self.evaluate_pair(
            gen_path=sample_dir / "gen_vocal.mp3",
            gt_path=sample_dir / "gt_vocal.mp3",
            sample_id=sample_dir.name,
            metadata_path=sample_dir / "condition.json",
        )

    def evaluate_pair(
        self,
        gen_path: Path,
        gt_path: Path,
        sample_id: str,
        metadata_path: Path | None = None,
    ) -> dict[str, Any]:
        started = time.perf_counter()
        if not gen_path.is_file():
            raise FileNotFoundError(gen_path)
        if not gt_path.is_file():
            raise FileNotFoundError(gt_path)

        gen = self.extractor.extract(gen_path)
        gt = self.extractor.extract(gt_path)
        alignment = align_content(gen.content, gt.content, self.config)
        pitch = pitch_metrics(gen.f0_hz, gt.f0_hz, alignment.path, self.config)
        if self.include_direct_f0_baseline:
            pitch.update(direct_f0_dtw_metrics(gen.f0_hz, gt.f0_hz, self.config))
        rhythm = rhythm_metrics(
            alignment.path,
            gen.content.shape[1],
            gt.content.shape[1],
            self.config,
        )

        events: dict[str, Any] = {}
        if self.include_event_metrics:
            gen_events = extract_note_events(gen.f0_hz, self.config)
            gt_events = extract_note_events(gt.f0_hz, self.config)
            events = event_sequence_metrics(
                gen_events,
                gt_events,
                gen.active_duration_sec,
                gt.active_duration_sec,
                self.config,
            )
            events.update(
                global_rhythm_metrics(
                    gen_events,
                    gt_events,
                    gen.active_duration_sec,
                    gt.active_duration_sec,
                    self.config,
                )
            )

        if self.alignment_dir is not None:
            np.savez_compressed(
                self.alignment_dir / f"{sample_id}.npz",
                content_path=alignment.path,
                content_local_costs=alignment.local_costs,
                gen_f0_hz=gen.f0_hz,
                gt_f0_hz=gt.f0_hz,
            )

        metadata = _read_metadata(metadata_path)
        return {
            "sample_id": sample_id,
            "status": "ok",
            "paths": {
                "gen_vocal": str(gen_path.resolve()),
                "gt_vocal": str(gt_path.resolve()),
            },
            "metadata": metadata,
            "audio": {
                "gen_original_duration_sec": gen.original_duration_sec,
                "gt_original_duration_sec": gt.original_duration_sec,
                "gen_active_duration_sec": gen.active_duration_sec,
                "gt_active_duration_sec": gt.active_duration_sec,
                "gen_trim_start_sec": gen.trim_start_sec,
                "gt_trim_start_sec": gt.trim_start_sec,
                "gen_f0_backend": gen.f0_backend,
                "gt_f0_backend": gt.f0_backend,
            },
            "alignment": {
                "content_dtw_cost": alignment.mean_cost,
                "content_dtw_cumulative_cost": alignment.cumulative_cost,
                "path_frames": int(len(alignment.path)),
                "constraint_fallback": alignment.constraint_fallback,
                "gen_content_frames": int(gen.content.shape[1]),
                "gt_content_frames": int(gt.content.shape[1]),
            },
            "pitch": pitch,
            "rhythm": rhythm,
            "events": events,
            "runtime_sec": float(time.perf_counter() - started),
        }


def _read_metadata(path: Path | None) -> dict[str, Any]:
    if path is None or not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    keys = (
        "uid",
        "sample_id",
        "section_key",
        "struct_tag",
        "gt_duration_sec",
        "description",
    )
    return {key: data[key] for key in keys if key in data}
