# Elastic vocal evaluation: M6_1000samples

- Cohort: `/Users/yeezou/Documents/Research/乐谱生成歌声项目/VeLo/推理和实验结果/demo_webpage/M6_1000samples`
- Successful pairs: 21/21
- Failed pairs: 0

All reported distances are lower-is-better.

| Metric | Mean | Median | 95% bootstrap CI of mean | N |
| --- | ---: | ---: | ---: | ---: |
| `alignment.content_dtw_cost` | 0.696729 | 0.707188 | [0.667705, 0.725598] | 21 |
| `pitch.content_pitch_cent_distance` | 268.728 | 248.345 | [208.923, 336.715] | 21 |
| `pitch.content_macro_pitch_cent_distance` | 259.383 | 238.273 | [203.434, 323.358] | 21 |
| `pitch.voicing_jaccard_distance` | 0.192323 | 0.153614 | [0.159752, 0.226976] | 21 |
| `pitch.direct_f0_dtw_cost` | 1.087 | 1.02419 | [0.938514, 1.24958] | 21 |
| `rhythm.tempo_log_distance` | 0.0952544 | 0.0811569 | [0.0671013, 0.124366] | 21 |
| `events.note_edit_distance` | 0.369708 | 0.377001 | [0.337615, 0.400509] | 21 |
| `events.note_gap_ratio` | 0.0686265 | 0.0465116 | [0.0472041, 0.0950299] | 21 |
| `events.event_ioi_normalized_distance` | 0.0164997 | 0.0159973 | [0.013438, 0.0196533] | 21 |
| `events.global_rhythm_distance` | 0.114956 | 0.112236 | [0.101239, 0.129726] | 21 |
| `events.global_rhythm_onset_component` | 0.0217608 | 0.0215392 | [0.0179194, 0.0260787] | 21 |
| `events.global_rhythm_duration_component` | 0.0931947 | 0.090807 | [0.0803313, 0.106449] | 21 |
| `events.global_rhythm_phrase_duration_component` | 0.0343827 | 0.0292712 | [0.0242081, 0.044886] | 21 |
| `events.global_rhythm_alignment_gap_ratio` | 0.0664833 | 0.0465116 | [0.0441001, 0.0937378] | 21 |
