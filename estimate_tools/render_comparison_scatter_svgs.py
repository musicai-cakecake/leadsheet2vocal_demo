from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from html import escape
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ChartSpec:
    filename: str
    title: str
    x_key: str
    y_key: str
    x_label: str
    y_label: str
    x_range: tuple[float, float]
    y_range: tuple[float, float]
    x_ticks: tuple[float, ...]
    y_ticks: tuple[float, ...]
    x_digits: int
    y_digits: int
    label_ids: frozenset[str]


CHARTS = (
    ChartSpec(
        filename="01_pitch_global_rhythm.svg",
        title="平均音高距离 × 平均全局节奏距离",
        x_key="pitch_cent",
        y_key="global_rhythm",
        x_label="平均音高距离（cent）",
        y_label="平均全局节奏距离",
        x_range=(0.0, 850.0),
        y_range=(0.0, 0.45),
        x_ticks=(0.0, 200.0, 400.0, 600.0, 800.0),
        y_ticks=(0.0, 0.1, 0.2, 0.3, 0.4),
        x_digits=0,
        y_digits=3,
        label_ids=frozenset({"05", "29", "40", "56", "80", "82", "90", "123"}),
    ),
    ChartSpec(
        filename="02_note_edit_tempo.svg",
        title="平均伪音符编辑距离 × 平均速度 log 距离",
        x_key="note_edit",
        y_key="tempo_log",
        x_label="平均伪音符编辑距离",
        y_label="平均速度 log 距离",
        x_range=(0.2, 0.8),
        y_range=(0.0, 0.8),
        x_ticks=(0.2, 0.4, 0.6, 0.8),
        y_ticks=(0.0, 0.2, 0.4, 0.6, 0.8),
        x_digits=3,
        y_digits=3,
        label_ids=frozenset({"05", "06", "29", "40", "56", "80", "82", "90"}),
    ),
    ChartSpec(
        filename="03_pitch_note_edit.svg",
        title="音高分布：平均音高距离（cent）× 平均伪音符编辑距离",
        x_key="pitch_cent",
        y_key="note_edit",
        x_label="平均音高距离（cent）",
        y_label="平均伪音符编辑距离",
        x_range=(0.0, 850.0),
        y_range=(0.2, 0.8),
        x_ticks=(0.0, 200.0, 400.0, 600.0, 800.0),
        y_ticks=(0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8),
        x_digits=0,
        y_digits=3,
        label_ids=frozenset({"05", "29", "56", "60", "82", "90", "123"}),
    ),
    ChartSpec(
        filename="04_global_rhythm_tempo.svg",
        title="节奏分布：平均全局节奏距离 × 平均速度 log 距离",
        x_key="global_rhythm",
        y_key="tempo_log",
        x_label="平均全局节奏距离",
        y_label="平均速度 log 距离",
        x_range=(0.0, 0.45),
        y_range=(0.0, 0.8),
        x_ticks=(0.0, 0.1, 0.2, 0.3, 0.4),
        y_ticks=(0.0, 0.2, 0.4, 0.6, 0.8),
        x_digits=3,
        y_digits=3,
        label_ids=frozenset({"05", "25", "40", "80", "82", "90", "100"}),
    ),
)


WIDTH = 1000
HEIGHT = 760
LEFT = 120
RIGHT = 55
TOP = 130
BOTTOM = 125
PLOT_WIDTH = WIDTH - LEFT - RIGHT
PLOT_HEIGHT = HEIGHT - TOP - BOTTOM

M6_COLOR = "#2563EB"
LEVO2_COLOR = "#DC2626"
TEXT_COLOR = "#0F172A"
SECONDARY_TEXT = "#475569"
GRID_COLOR = "#E2E8F0"
PAIR_COLOR = "#94A3B8"
BACKGROUND = "#FFFFFF"


def build_parser() -> argparse.ArgumentParser:
    workspace = Path(__file__).resolve().parents[1]
    result_root = workspace / "estimate_tools" / "results" / "M6_vs_LeVo2_matched21"
    parser = argparse.ArgumentParser(
        description="Render four paired M6/LeVo2 scatter plots as standalone SVGs."
    )
    parser.add_argument(
        "--comparison",
        type=Path,
        default=result_root / "comparison.json",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=result_root / "svg_figures",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    data = json.loads(args.comparison.read_text(encoding="utf-8"))
    _validate_comparison(data)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for spec in CHARTS:
        output_path = args.output_dir / spec.filename
        output_path.write_text(_render_svg(data, spec), encoding="utf-8")
        print(output_path)
    return 0


def _validate_comparison(data: dict[str, Any]) -> None:
    items = data.get("items")
    summary = data.get("summary")
    if not isinstance(items, list) or len(items) != 21:
        raise ValueError("Expected exactly 21 paired comparison items")
    if not isinstance(summary, dict):
        raise ValueError("Comparison summary is missing")
    required = {spec.x_key for spec in CHARTS} | {spec.y_key for spec in CHARTS}
    for key in required:
        if key not in summary:
            raise ValueError(f"Comparison summary is missing metric: {key}")
    for item in items:
        metrics = item.get("metrics", {})
        for key in required:
            values = metrics.get(key)
            if not isinstance(values, dict) or "m6" not in values or "levo2" not in values:
                raise ValueError(
                    f"Sample {item.get('sample_id')} is missing metric: {key}"
                )


def _render_svg(data: dict[str, Any], spec: ChartSpec) -> str:
    items = data["items"]
    summary = data["summary"]
    x_mean_m6 = float(summary[spec.x_key]["m6_mean"])
    y_mean_m6 = float(summary[spec.y_key]["m6_mean"])
    x_mean_levo2 = float(summary[spec.x_key]["levo2_mean"])
    y_mean_levo2 = float(summary[spec.y_key]["levo2_mean"])

    def sx(value: float) -> float:
        low, high = spec.x_range
        return LEFT + (value - low) / (high - low) * PLOT_WIDTH

    def sy(value: float) -> float:
        low, high = spec.y_range
        return TOP + PLOT_HEIGHT - (value - low) / (high - low) * PLOT_HEIGHT

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" '
            f'height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" '
            'role="img" aria-labelledby="chart-title chart-desc" xml:lang="zh-CN">'
        ),
        f'  <title id="chart-title">{escape(spec.title)}</title>',
        (
            '  <desc id="chart-desc">M6 与 LeVo2 在 21 个相同样例上的配对散点图。'
            '蓝色圆点表示 M6，红色方点表示 LeVo2，细线连接相同样例。</desc>'
        ),
        "  <style>",
        (
            '    text { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", '
            '"Noto Sans CJK SC", "Microsoft YaHei", Arial, sans-serif; }'
        ),
        f"    .title {{ fill: {TEXT_COLOR}; font-size: 25px; font-weight: 700; }}",
        f"    .subtitle {{ fill: {SECONDARY_TEXT}; font-size: 14px; }}",
        f"    .axis-label {{ fill: {TEXT_COLOR}; font-size: 16px; font-weight: 600; }}",
        f"    .tick {{ fill: {SECONDARY_TEXT}; font-size: 13px; }}",
        f"    .grid {{ stroke: {GRID_COLOR}; stroke-width: 1; }}",
        f"    .axis {{ stroke: {SECONDARY_TEXT}; stroke-width: 1.5; }}",
        f"    .pair {{ stroke: {PAIR_COLOR}; stroke-width: 1.3; opacity: 0.65; }}",
        (
            f"    .sample-label {{ fill: {TEXT_COLOR}; font-size: 12px; font-weight: 650; "
            f"paint-order: stroke; stroke: {BACKGROUND}; stroke-width: 4px; "
            "stroke-linejoin: round; }"
        ),
        f"    .legend {{ fill: {SECONDARY_TEXT}; font-size: 14px; }}",
        f"    .mean-label {{ fill: {TEXT_COLOR}; font-size: 12px; font-weight: 700; }}",
        f"    .caption {{ fill: {SECONDARY_TEXT}; font-size: 12px; }}",
        "  </style>",
        f'  <rect width="{WIDTH}" height="{HEIGHT}" fill="{BACKGROUND}"/>',
        (
            f'  <defs><clipPath id="plot-clip"><rect x="{LEFT}" y="{TOP}" '
            f'width="{PLOT_WIDTH}" height="{PLOT_HEIGHT}"/></clipPath></defs>'
        ),
        f'  <text class="title" x="{WIDTH / 2:.1f}" y="38" text-anchor="middle">{escape(spec.title)}</text>',
        (
            f'  <text class="subtitle" x="{WIDTH / 2:.1f}" y="66" text-anchor="middle">'
            "21 个严格匹配样例 · 所有距离越低越好 · 左下角更优</text>"
        ),
        _legend_svg(),
    ]

    for tick in spec.x_ticks:
        x = sx(tick)
        lines.extend(
            [
                f'  <line class="grid" x1="{x:.2f}" y1="{TOP}" x2="{x:.2f}" y2="{TOP + PLOT_HEIGHT}"/>',
                (
                    f'  <text class="tick" x="{x:.2f}" y="{TOP + PLOT_HEIGHT + 28}" '
                    f'text-anchor="middle">{_format(tick, spec.x_digits)}</text>'
                ),
            ]
        )
    for tick in spec.y_ticks:
        y = sy(tick)
        lines.extend(
            [
                f'  <line class="grid" x1="{LEFT}" y1="{y:.2f}" x2="{LEFT + PLOT_WIDTH}" y2="{y:.2f}"/>',
                (
                    f'  <text class="tick" x="{LEFT - 14}" y="{y + 4:.2f}" '
                    f'text-anchor="end">{_format(tick, spec.y_digits)}</text>'
                ),
            ]
        )

    lines.extend(
        [
            f'  <line class="axis" x1="{LEFT}" y1="{TOP + PLOT_HEIGHT}" x2="{LEFT + PLOT_WIDTH}" y2="{TOP + PLOT_HEIGHT}"/>',
            f'  <line class="axis" x1="{LEFT}" y1="{TOP}" x2="{LEFT}" y2="{TOP + PLOT_HEIGHT}"/>',
            (
                f'  <text class="axis-label" x="{LEFT + PLOT_WIDTH / 2:.1f}" '
                f'y="{HEIGHT - 55}" text-anchor="middle">{escape(spec.x_label)}</text>'
            ),
            (
                f'  <text class="axis-label" x="30" y="{TOP + PLOT_HEIGHT / 2:.1f}" '
                f'text-anchor="middle" transform="rotate(-90 30 '
                f'{TOP + PLOT_HEIGHT / 2:.1f})">{escape(spec.y_label)}</text>'
            ),
            f'  <g clip-path="url(#plot-clip)">',
        ]
    )

    for item in items:
        sample_id = str(item["sample_id"])
        metrics = item["metrics"]
        m6_x = float(metrics[spec.x_key]["m6"])
        m6_y = float(metrics[spec.y_key]["m6"])
        levo2_x = float(metrics[spec.x_key]["levo2"])
        levo2_y = float(metrics[spec.y_key]["levo2"])
        lines.append(
            f'    <line class="pair" x1="{sx(m6_x):.2f}" y1="{sy(m6_y):.2f}" '
            f'x2="{sx(levo2_x):.2f}" y2="{sy(levo2_y):.2f}"/>'
        )
        lines.extend(
            _point_svg(
                sample_id,
                "M6",
                sx(m6_x),
                sy(m6_y),
                m6_x,
                m6_y,
                spec,
            )
        )
        lines.extend(
            _point_svg(
                sample_id,
                "LeVo2",
                sx(levo2_x),
                sy(levo2_y),
                levo2_x,
                levo2_y,
                spec,
            )
        )
    lines.append("  </g>")

    for item_index, item in enumerate(items):
        sample_id = str(item["sample_id"])
        short_id = _short_id(sample_id)
        if short_id not in spec.label_ids:
            continue
        metrics = item["metrics"]
        m6_x = sx(float(metrics[spec.x_key]["m6"]))
        m6_y = sy(float(metrics[spec.y_key]["m6"]))
        levo2_x = sx(float(metrics[spec.x_key]["levo2"]))
        levo2_y = sy(float(metrics[spec.y_key]["levo2"]))
        dx = 7 if item_index % 2 == 0 else -7
        anchor = "start" if dx > 0 else "end"
        lines.append(
            f'  <text class="sample-label" x="{(m6_x + levo2_x) / 2 + dx:.2f}" '
            f'y="{(m6_y + levo2_y) / 2 - 7:.2f}" text-anchor="{anchor}">'
            f"{escape(short_id)}</text>"
        )

    lines.extend(
        _mean_marker_svg(
            "M6",
            sx(x_mean_m6),
            sy(y_mean_m6),
            x_mean_m6,
            y_mean_m6,
            spec,
        )
    )
    lines.extend(
        _mean_marker_svg(
            "LeVo2",
            sx(x_mean_levo2),
            sy(y_mean_levo2),
            x_mean_levo2,
            y_mean_levo2,
            spec,
        )
    )
    lines.extend(
        [
            (
                f'  <text class="caption" x="{LEFT}" y="{HEIGHT - 20}">'
                "细线连接同一样例，数字为样例编号；大描边标记为模型组均值。"
                "</text>"
            ),
            "</svg>",
            "",
        ]
    )
    return "\n".join(lines)


def _legend_svg() -> str:
    return "\n".join(
        [
            f'  <circle cx="332" cy="96" r="6" fill="{M6_COLOR}"/>',
            '  <text class="legend" x="346" y="101">M6 · 圆点</text>',
            f'  <rect x="462" y="90" width="12" height="12" rx="1" fill="{LEVO2_COLOR}"/>',
            '  <text class="legend" x="482" y="101">LeVo2 · 方点</text>',
            f'  <line x1="630" y1="96" x2="660" y2="96" stroke="{PAIR_COLOR}" stroke-width="1.5"/>',
            '  <text class="legend" x="670" y="101">相同样例配对线</text>',
        ]
    )


def _point_svg(
    sample_id: str,
    model: str,
    x: float,
    y: float,
    raw_x: float,
    raw_y: float,
    spec: ChartSpec,
) -> list[str]:
    tooltip = escape(
        f"{sample_id} · {model} · {spec.x_label}: "
        f"{_format(raw_x, spec.x_digits)} · {spec.y_label}: "
        f"{_format(raw_y, spec.y_digits)}"
    )
    if model == "M6":
        return [
            f'    <circle cx="{x:.2f}" cy="{y:.2f}" r="6" fill="{M6_COLOR}" '
            f'stroke="{BACKGROUND}" stroke-width="2"><title>{tooltip}</title></circle>'
        ]
    return [
        f'    <rect x="{x - 5.5:.2f}" y="{y - 5.5:.2f}" width="11" height="11" '
        f'rx="1" fill="{LEVO2_COLOR}" stroke="{BACKGROUND}" stroke-width="2">'
        f"<title>{tooltip}</title></rect>"
    ]


def _mean_marker_svg(
    model: str,
    x: float,
    y: float,
    raw_x: float,
    raw_y: float,
    spec: ChartSpec,
) -> list[str]:
    tooltip = escape(
        f"{model} 组均值 · {spec.x_label}: {_format(raw_x, spec.x_digits)} · "
        f"{spec.y_label}: {_format(raw_y, spec.y_digits)}"
    )
    if model == "M6":
        marker = (
            f'  <circle cx="{x:.2f}" cy="{y:.2f}" r="10" fill="{M6_COLOR}" '
            f'stroke="{TEXT_COLOR}" stroke-width="2.5"><title>{tooltip}</title></circle>'
        )
    else:
        marker = (
            f'  <rect x="{x - 9:.2f}" y="{y - 9:.2f}" width="18" height="18" '
            f'rx="1" fill="{LEVO2_COLOR}" stroke="{TEXT_COLOR}" stroke-width="2.5">'
            f"<title>{tooltip}</title></rect>"
        )
    return [
        marker,
        (
            f'  <text class="mean-label" x="{x + 14:.2f}" y="{y - 12:.2f}">'
            f"{model} 均值</text>"
        ),
    ]


def _format(value: float, digits: int) -> str:
    if digits == 0:
        return str(int(round(value)))
    return f"{value:.{digits}f}"


def _short_id(sample_id: str) -> str:
    prefix = sample_id.split("_", 1)[0]
    if sample_id.startswith("96_6f3a"):
        return "96a"
    if sample_id.startswith("96_c36c"):
        return "96b"
    return prefix


if __name__ == "__main__":
    raise SystemExit(main())
