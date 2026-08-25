from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import numpy as np

from .alignment import align_content, pitch_metrics, rhythm_metrics
from .compare_results import compare_runs
from .config import EvalConfig
from .events import NoteEvent, event_sequence_metrics, global_rhythm_metrics
from .run_evaluation import discover_pairs


class ElasticMetricTests(unittest.TestCase):
    def setUp(self) -> None:
        self.config = EvalConfig(f0_backend="pyin")

    def test_content_alignment_is_near_diagonal_for_identical_features(self) -> None:
        time = np.linspace(0.0, 4.0 * np.pi, 120)
        features = np.vstack(
            [np.sin(time), np.cos(time), np.sin(0.37 * time + 0.2)]
        )
        features /= np.maximum(np.linalg.norm(features, axis=0), 1e-8)
        result = align_content(features, features.copy(), self.config)
        self.assertLess(result.mean_cost, 1e-8)
        self.assertTrue(np.array_equal(result.path[:, 0], result.path[:, 1]))

    def test_content_aligned_pitch_distance_recovers_two_semitones(self) -> None:
        frames = 100
        path = np.column_stack([np.arange(frames), np.arange(frames)])
        gt_f0 = np.full(frames, 220.0)
        gen_f0 = gt_f0 * 2.0 ** (2.0 / 12.0)
        metrics = pitch_metrics(gen_f0, gt_f0, path, self.config)
        self.assertAlmostEqual(
            metrics["content_pitch_cent_distance"], 200.0, places=5
        )
        self.assertAlmostEqual(metrics["voicing_jaccard_distance"], 0.0)

    def test_rhythm_residual_ignores_global_tempo(self) -> None:
        gen_frames = 100
        gt_frames = 130
        gen_index = np.arange(gen_frames)
        gt_index = np.rint(
            gen_index * (gt_frames - 1) / (gen_frames - 1)
        ).astype(int)
        path = np.column_stack([gen_index, gt_index])
        metrics = rhythm_metrics(path, gen_frames, gt_frames, self.config)
        # The remaining error is bounded by 10 ms frame quantization.
        self.assertLess(metrics["path_deviation_normalized"], 0.003)
        self.assertGreater(metrics["tempo_log_distance"], 0.20)

    def test_rhythm_residual_detects_local_warp(self) -> None:
        frames = 150
        normalized = np.linspace(0.0, 1.0, frames)
        warped = normalized + 0.08 * np.sin(np.pi * normalized)
        gt_index = np.rint(warped * (frames - 1)).astype(int)
        path = np.column_stack([np.arange(frames), gt_index])
        metrics = rhythm_metrics(path, frames, frames, self.config)
        self.assertGreater(metrics["path_deviation_normalized"], 0.01)
        self.assertAlmostEqual(metrics["tempo_log_distance"], 0.0, places=8)

    def test_event_edit_distance_penalizes_extra_note(self) -> None:
        gt_events = [
            NoteEvent(0.0, 0.4, 60.0),
            NoteEvent(0.5, 0.9, 62.0),
            NoteEvent(1.0, 1.4, 64.0),
        ]
        gen_events = [
            NoteEvent(0.0, 0.4, 60.0),
            NoteEvent(0.5, 0.9, 62.0),
            NoteEvent(0.92, 1.0, 63.0),
            NoteEvent(1.0, 1.4, 64.0),
        ]
        metrics = event_sequence_metrics(
            gen_events,
            gt_events,
            gen_duration_sec=1.5,
            gt_duration_sec=1.5,
            config=self.config,
        )
        self.assertGreater(metrics["note_edit_distance"], 0.0)
        self.assertGreater(metrics["note_gap_ratio"], 0.0)
        self.assertEqual(metrics["matched_note_events"], 3)

    def test_global_rhythm_retains_uniform_time_stretch(self) -> None:
        gt_events = [
            NoteEvent(0.0, 0.4, 60.0),
            NoteEvent(0.7, 1.2, 62.0),
            NoteEvent(1.5, 1.9, 64.0),
        ]
        stretched_events = [
            NoteEvent(0.0, 0.8, 72.0),
            NoteEvent(1.4, 2.4, 48.0),
            NoteEvent(3.0, 3.8, 67.0),
        ]
        metrics = global_rhythm_metrics(
            stretched_events,
            gt_events,
            gen_duration_sec=4.0,
            gt_duration_sec=2.0,
            config=self.config,
        )
        self.assertGreater(metrics["global_rhythm_distance"], 0.0)

    def test_global_rhythm_is_zero_for_identical_events(self) -> None:
        events = [
            NoteEvent(0.0, 0.4, 60.0),
            NoteEvent(0.7, 1.2, 62.0),
            NoteEvent(1.5, 1.9, 64.0),
        ]
        metrics = global_rhythm_metrics(
            events,
            events,
            gen_duration_sec=2.0,
            gt_duration_sec=2.0,
            config=self.config,
        )
        self.assertAlmostEqual(metrics["global_rhythm_distance"], 0.0)

    def test_global_rhythm_separates_score_from_alignment_gaps(self) -> None:
        gt_events = [
            NoteEvent(0.0, 0.4, 60.0),
            NoteEvent(0.8, 1.2, 62.0),
            NoteEvent(1.5, 1.9, 64.0),
        ]
        gen_events = [
            NoteEvent(0.0, 0.2, 72.0),
            NoteEvent(0.5, 0.9, 48.0),
            NoteEvent(1.1, 1.3, 67.0),
            NoteEvent(1.6, 1.9, 69.0),
        ]
        metrics = global_rhythm_metrics(
            gen_events,
            gt_events,
            gen_duration_sec=2.0,
            gt_duration_sec=2.0,
            config=self.config,
        )
        component_sum = (
            metrics["global_rhythm_onset_component"]
            + metrics["global_rhythm_duration_component"]
        )
        self.assertGreater(metrics["global_rhythm_distance"], 0.0)
        self.assertGreater(metrics["global_rhythm_onset_component"], 0.0)
        self.assertGreater(metrics["global_rhythm_duration_component"], 0.0)
        self.assertGreater(metrics["global_rhythm_alignment_gap_ratio"], 0.0)
        self.assertAlmostEqual(
            metrics["global_rhythm_duration_component"],
            metrics["global_rhythm_event_duration_component"]
            + metrics["global_rhythm_phrase_duration_component"],
        )
        self.assertAlmostEqual(metrics["global_rhythm_distance"], component_sum)

    def test_global_rhythm_exposes_slow_long_output_despite_event_gaps(self) -> None:
        gt_events = [
            NoteEvent(0.0, 0.5, 60.0),
            NoteEvent(4.0, 4.5, 62.0),
            NoteEvent(8.0, 8.5, 64.0),
            NoteEvent(12.0, 12.5, 65.0),
        ]
        close_events_with_extra_split = [
            NoteEvent(0.0, 0.5, 72.0),
            NoteEvent(4.0, 4.5, 48.0),
            NoteEvent(4.6, 4.7, 67.0),
            NoteEvent(8.0, 8.5, 40.0),
            NoteEvent(12.0, 12.5, 81.0),
        ]
        slow_events = [
            NoteEvent(0.0, 0.675, 48.0),
            NoteEvent(5.4, 6.075, 72.0),
            NoteEvent(10.8, 11.475, 40.0),
            NoteEvent(16.2, 16.875, 81.0),
        ]
        close_metrics = global_rhythm_metrics(
            close_events_with_extra_split,
            gt_events,
            gen_duration_sec=16.0,
            gt_duration_sec=16.0,
            config=self.config,
        )
        slow_metrics = global_rhythm_metrics(
            slow_events,
            gt_events,
            gen_duration_sec=21.6,
            gt_duration_sec=16.0,
            config=self.config,
        )

        self.assertGreater(
            close_metrics["global_rhythm_alignment_gap_ratio"],
            slow_metrics["global_rhythm_alignment_gap_ratio"],
        )
        self.assertGreater(
            slow_metrics["global_rhythm_distance"],
            close_metrics["global_rhythm_distance"] * 3.0,
        )
        self.assertGreater(
            slow_metrics["global_rhythm_phrase_duration_component"],
            0.0,
        )

    def test_pair_discovery_can_match_reference_ids(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for sample_id in ("sample_a", "sample_b"):
                sample_dir = root / sample_id
                sample_dir.mkdir()
                (sample_dir / "gen_vocal.mp3").touch()
                (sample_dir / "gt_vocal.mp3").touch()
            pairs = discover_pairs(root, include_ids={"sample_b"})
            self.assertEqual([path.name for path in pairs], ["sample_b"])

    def test_paired_comparison_uses_levo2_minus_m6_delta(self) -> None:
        m6 = {"items": [_comparison_item("sample_a", 1.0)]}
        levo2 = {"items": [_comparison_item("sample_a", 2.0)]}
        comparison = compare_runs(m6, levo2)
        pitch = comparison["items"][0]["metrics"]["pitch_cent"]
        self.assertEqual(pitch["delta_levo2_minus_m6"], 1.0)
        self.assertEqual(pitch["lower_distance_model"], "M6")
        self.assertEqual(comparison["summary"]["pitch_cent"]["m6_lower_count"], 1)
        self.assertNotIn("local_rhythm_percent", comparison["metric_order"])
        self.assertNotIn(
            "global_rhythm_event_duration", comparison["metric_order"]
        )
        self.assertNotIn("event_duration_log", comparison["metric_order"])


def _comparison_item(sample_id: str, value: float) -> dict:
    return {
        "sample_id": sample_id,
        "status": "ok",
        "alignment": {"content_dtw_cost": value},
        "pitch": {
            "content_pitch_cent_distance": value,
            "content_macro_pitch_cent_distance": value,
            "direct_f0_pitch_cent_distance": value,
            "voicing_jaccard_distance": value,
        },
        "rhythm": {
            "path_deviation_normalized": value,
            "path_deviation_ms": value,
            "tempo_log_distance": value,
        },
        "events": {
            "note_edit_distance": value,
            "note_gap_ratio": value,
            "event_duration_log_distance": value,
            "event_ioi_normalized_distance": value,
            "global_rhythm_distance": value,
            "global_rhythm_onset_component": value,
            "global_rhythm_duration_component": value,
            "global_rhythm_event_duration_component": value,
            "global_rhythm_phrase_duration_component": value,
            "global_rhythm_alignment_gap_ratio": value,
        },
    }


if __name__ == "__main__":
    unittest.main()
