from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class EvalConfig:
    """Configuration shared by feature extraction and distance computation."""

    sample_rate: int = 16_000
    hop_length: int = 160
    trim_top_db: float = 45.0

    f0_backend: str = "auto"
    rmvpe_threshold: float = 0.03
    pyin_fmin_hz: float = 50.0
    pyin_fmax_hz: float = 1_600.0

    n_fft: int = 512
    win_length: int = 400
    n_mels: int = 40
    n_mfcc: int = 20
    delta_width: int = 9

    dtw_band_radius: float = 0.35
    pitch_trim_fraction: float = 0.10
    macro_pitch_window_frames: int = 21

    event_smooth_frames: int = 21
    event_max_gap_frames: int = 5
    event_min_note_frames: int = 8
    event_gap_cost: float = 1.0
    event_pitch_weight: float = 0.75
    event_duration_weight: float = 0.25
    global_rhythm_onset_weight: float = 0.50
    global_rhythm_duration_weight: float = 0.50
    # Used only to choose the monotonic event alignment, not in the final score.
    global_rhythm_gap_cost: float = 1.0

    @property
    def hop_seconds(self) -> float:
        return self.hop_length / self.sample_rate

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)
