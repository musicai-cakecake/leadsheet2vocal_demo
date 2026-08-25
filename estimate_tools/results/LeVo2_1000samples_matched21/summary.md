# Elastic vocal evaluation: LeVo2_1000samples

- Cohort: `/Users/yeezou/Documents/Research/乐谱生成歌声项目/VeLo/推理和实验结果/demo_webpage/LeVo2_1000samples`
- Successful pairs: 21/21
- Failed pairs: 0

All reported distances are lower-is-better.

| Metric | Mean | Median | 95% bootstrap CI of mean | N |
| --- | ---: | ---: | ---: | ---: |
| `alignment.content_dtw_cost` | 0.808879 | 0.816471 | [0.794718, 0.82164] | 21 |
| `pitch.content_pitch_cent_distance` | 481.764 | 465.771 | [421.737, 545.656] | 21 |
| `pitch.content_macro_pitch_cent_distance` | 479.314 | 469.467 | [419.241, 541.972] | 21 |
| `pitch.voicing_jaccard_distance` | 0.317085 | 0.319831 | [0.275668, 0.360367] | 21 |
| `pitch.direct_f0_dtw_cost` | 1.69091 | 1.61546 | [1.50002, 1.89169] | 21 |
| `rhythm.tempo_log_distance` | 0.349237 | 0.337483 | [0.261225, 0.438085] | 21 |
| `events.note_edit_distance` | 0.528116 | 0.529142 | [0.487242, 0.571583] | 21 |
| `events.note_gap_ratio` | 0.166657 | 0.107692 | [0.111997, 0.226892] | 21 |
| `events.event_ioi_normalized_distance` | 0.0171132 | 0.0163397 | [0.0145209, 0.0198339] | 21 |
| `events.global_rhythm_distance` | 0.229508 | 0.208672 | [0.189379, 0.268528] | 21 |
| `events.global_rhythm_onset_component` | 0.0486487 | 0.0407014 | [0.0365604, 0.0623251] | 21 |
| `events.global_rhythm_duration_component` | 0.18086 | 0.17764 | [0.148673, 0.212484] | 21 |
| `events.global_rhythm_phrase_duration_component` | 0.124755 | 0.121626 | [0.0939709, 0.155214] | 21 |
| `events.global_rhythm_alignment_gap_ratio` | 0.164756 | 0.107692 | [0.109128, 0.225733] | 21 |
