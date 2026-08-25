from __future__ import annotations

import hashlib
import json
import warnings
from dataclasses import dataclass
from pathlib import Path

import librosa
import numpy as np

from .config import EvalConfig


@dataclass
class AudioFeatures:
    content: np.ndarray
    f0_hz: np.ndarray
    f0_confidence: np.ndarray
    original_duration_sec: float
    active_duration_sec: float
    trim_start_sec: float
    trim_end_sec: float
    f0_backend: str


class PitchExtractor:
    """Lazy pitch extractor with RMVPE primary and pYIN fallback."""

    def __init__(self, config: EvalConfig):
        self.config = config
        self._backend_used: str | None = None
        self._rmvpe_model = None

    @property
    def backend_used(self) -> str:
        return self._backend_used or self.config.f0_backend

    def extract(self, audio: np.ndarray) -> tuple[np.ndarray, np.ndarray, str]:
        requested = self.config.f0_backend.lower()
        if requested not in {"auto", "rmvpe", "pyin"}:
            raise ValueError(f"Unsupported F0 backend: {requested}")

        if requested in {"auto", "rmvpe"}:
            try:
                f0 = self._extract_rmvpe(audio)
                confidence = (f0 > 0).astype(np.float32)
                self._backend_used = "rmvpe"
                return f0, confidence, "rmvpe"
            except Exception as exc:
                if requested == "rmvpe":
                    raise RuntimeError("RMVPE initialization or inference failed") from exc
                warnings.warn(
                    f"RMVPE unavailable ({exc!r}); falling back to librosa.pyin",
                    RuntimeWarning,
                    stacklevel=2,
                )

        f0, confidence = self._extract_pyin(audio)
        self._backend_used = "pyin"
        return f0, confidence, "pyin"

    def _extract_rmvpe(self, audio: np.ndarray) -> np.ndarray:
        if self._rmvpe_model is None:
            from mlx_rmvpe import RMVPE

            self._rmvpe_model = RMVPE.from_pretrained()
        f0 = self._rmvpe_model.infer_from_audio(
            audio,
            sample_rate=self.config.sample_rate,
            threshold=self.config.rmvpe_threshold,
        )
        f0 = np.asarray(f0, dtype=np.float32)
        f0[~np.isfinite(f0)] = 0.0
        f0[f0 < 0] = 0.0
        return f0

    def _extract_pyin(self, audio: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        f0, voiced, probability = librosa.pyin(
            audio,
            fmin=self.config.pyin_fmin_hz,
            fmax=self.config.pyin_fmax_hz,
            sr=self.config.sample_rate,
            frame_length=2_048,
            hop_length=self.config.hop_length,
            center=True,
        )
        f0 = np.nan_to_num(f0, nan=0.0, posinf=0.0, neginf=0.0).astype(np.float32)
        f0[~voiced] = 0.0
        probability = np.nan_to_num(
            probability, nan=0.0, posinf=0.0, neginf=0.0
        ).astype(np.float32)
        return f0, probability


class FeatureExtractor:
    def __init__(self, config: EvalConfig, cache_dir: Path | None = None):
        self.config = config
        self.cache_dir = cache_dir
        self.pitch_extractor = PitchExtractor(config)
        if cache_dir is not None:
            cache_dir.mkdir(parents=True, exist_ok=True)

    def extract(self, audio_path: Path) -> AudioFeatures:
        audio_path = audio_path.resolve()
        cache_path = self._cache_path(audio_path)
        if cache_path is not None and cache_path.exists():
            return self._load_cache(cache_path)

        audio, _ = librosa.load(
            audio_path,
            sr=self.config.sample_rate,
            mono=True,
            res_type="soxr_hq",
        )
        audio = np.asarray(audio, dtype=np.float32)
        if audio.size == 0:
            raise ValueError(f"Decoded audio is empty: {audio_path}")

        original_duration = audio.size / self.config.sample_rate
        active, trim_index = librosa.effects.trim(
            audio,
            top_db=self.config.trim_top_db,
            frame_length=1_024,
            hop_length=self.config.hop_length,
        )
        if active.size < self.config.n_fft:
            raise ValueError(
                f"Active audio is too short after trimming ({active.size} samples): "
                f"{audio_path}"
            )

        peak = float(np.max(np.abs(active)))
        if peak > 0:
            active = active / peak

        content = self._content_features(active)
        f0, confidence, backend = self.pitch_extractor.extract(active)
        f0 = _resize_nearest(f0, content.shape[1])
        confidence = _resize_nearest(confidence, content.shape[1])

        features = AudioFeatures(
            content=content.astype(np.float32),
            f0_hz=f0.astype(np.float32),
            f0_confidence=confidence.astype(np.float32),
            original_duration_sec=float(original_duration),
            active_duration_sec=float(active.size / self.config.sample_rate),
            trim_start_sec=float(trim_index[0] / self.config.sample_rate),
            trim_end_sec=float(
                (audio.size - trim_index[1]) / self.config.sample_rate
            ),
            f0_backend=backend,
        )
        if cache_path is not None:
            self._save_cache(cache_path, features)
        return features

    def _content_features(self, audio: np.ndarray) -> np.ndarray:
        mfcc = librosa.feature.mfcc(
            y=audio,
            sr=self.config.sample_rate,
            n_mfcc=self.config.n_mfcc,
            n_fft=self.config.n_fft,
            hop_length=self.config.hop_length,
            win_length=self.config.win_length,
            n_mels=self.config.n_mels,
            fmin=50.0,
            fmax=min(7_600.0, self.config.sample_rate / 2),
            center=True,
        )
        base = mfcc[1:] if mfcc.shape[0] > 1 else mfcc
        width = _valid_delta_width(self.config.delta_width, base.shape[1])
        if width is None:
            delta = np.zeros_like(base)
            delta2 = np.zeros_like(base)
        else:
            delta = librosa.feature.delta(base, width=width, order=1, mode="nearest")
            delta2 = librosa.feature.delta(
                base, width=width, order=2, mode="nearest"
            )
        content = np.concatenate([base, delta, delta2], axis=0).astype(np.float32)

        mean = np.mean(content, axis=1, keepdims=True)
        std = np.std(content, axis=1, keepdims=True)
        content = (content - mean) / np.maximum(std, 1e-5)
        frame_norm = np.linalg.norm(content, axis=0, keepdims=True)
        content = content / np.maximum(frame_norm, 1e-8)
        return np.nan_to_num(content, nan=0.0, posinf=0.0, neginf=0.0)

    def _cache_path(self, audio_path: Path) -> Path | None:
        if self.cache_dir is None:
            return None
        stat = audio_path.stat()
        payload = {
            "path": str(audio_path),
            "size": stat.st_size,
            "mtime_ns": stat.st_mtime_ns,
            "config": self.config.as_dict(),
            "cache_version": 1,
        }
        digest = hashlib.sha1(
            json.dumps(payload, sort_keys=True).encode("utf-8")
        ).hexdigest()
        return self.cache_dir / f"{digest}.npz"

    @staticmethod
    def _save_cache(path: Path, features: AudioFeatures) -> None:
        np.savez_compressed(
            path,
            content=features.content,
            f0_hz=features.f0_hz,
            f0_confidence=features.f0_confidence,
            original_duration_sec=features.original_duration_sec,
            active_duration_sec=features.active_duration_sec,
            trim_start_sec=features.trim_start_sec,
            trim_end_sec=features.trim_end_sec,
            f0_backend=features.f0_backend,
        )

    @staticmethod
    def _load_cache(path: Path) -> AudioFeatures:
        with np.load(path, allow_pickle=False) as data:
            return AudioFeatures(
                content=data["content"],
                f0_hz=data["f0_hz"],
                f0_confidence=data["f0_confidence"],
                original_duration_sec=float(data["original_duration_sec"]),
                active_duration_sec=float(data["active_duration_sec"]),
                trim_start_sec=float(data["trim_start_sec"]),
                trim_end_sec=float(data["trim_end_sec"]),
                f0_backend=str(data["f0_backend"]),
            )


def _resize_nearest(values: np.ndarray, length: int) -> np.ndarray:
    values = np.asarray(values)
    if values.size == length:
        return values
    if values.size == 0:
        return np.zeros(length, dtype=np.float32)
    indices = np.rint(np.linspace(0, values.size - 1, num=length)).astype(int)
    return values[indices]


def _valid_delta_width(requested: int, frame_count: int) -> int | None:
    if frame_count < 3:
        return None
    width = min(requested, frame_count if frame_count % 2 else frame_count - 1)
    width = max(width, 3)
    return width if width % 2 else width - 1
