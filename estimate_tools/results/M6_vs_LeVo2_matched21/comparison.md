# M6 vs LeVo2 paired vocal comparison

- Matched samples: 21
- All metrics are lower-is-better.
- Delta is `LeVo2 - M6`: positive favors M6; negative favors LeVo2.

## Cohort means

| Metric | Unit | M6 mean | LeVo2 mean | Mean delta | M6 lower | LeVo2 lower |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Content-aligned pitch distance | cent | 268.73 | 481.76 | +213.04 | 19 | 2 |
| Smoothed macro-pitch distance | cent | 259.38 | 479.31 | +219.93 | 18 | 3 |
| Direct F0-DTW pitch baseline | cent | 73.37 | 124.72 | +51.35 | 17 | 4 |
| Voicing Jaccard distance | % | 19.232 | 31.708 | +12.476 | 19 | 2 |
| Global tempo log distance | — | 0.0953 | 0.3492 | +0.2540 | 19 | 2 |
| Global tempo-sensitive onset-duration rhythm distance | — | 0.1150 | 0.2295 | +0.1146 | 17 | 4 |
| Global rhythm onset component | — | 0.0218 | 0.0486 | +0.0269 | 17 | 4 |
| Global rhythm total duration component | — | 0.0932 | 0.1809 | +0.0877 | 18 | 3 |
| Global rhythm whole-phrase duration component | — | 0.0344 | 0.1248 | +0.0904 | 19 | 2 |
| Global rhythm alignment-gap diagnostic | % | 6.648 | 16.476 | +9.827 | 14 | 6 |
| Pseudo-note edit distance | — | 0.3697 | 0.5281 | +0.1584 | 18 | 3 |
| Pseudo-note insertion/deletion ratio | % | 6.863 | 16.666 | +9.803 | 13 | 7 |
| Matched normalized IOI distance | % | 1.650 | 1.711 | +0.061 | 10 | 11 |
| Content DTW alignment cost | — | 0.6967 | 0.8089 | +0.1122 | 21 | 0 |

## Per-sample primary pitch distance

| Sample | M6 pitch (cent) | LeVo2 pitch (cent) | Δ pitch |
| --- | ---: | ---: | ---: |
| `05_996b8a9e3232_verse_3` | 759.90 | 617.55 | -142.35 |
| `06_dc8f4c4095e4_chorus_1` | 115.45 | 390.64 | +275.19 |
| `09_2011788cb650_chorus_4` | 239.47 | 465.77 | +226.30 |
| `11_b51fba878c91_verse_1` | 375.37 | 422.51 | +47.14 |
| `25_9450b6fde3cb_verse_6` | 219.29 | 253.15 | +33.86 |
| `29_378274983647_chorus_2` | 51.33 | 272.04 | +220.72 |
| `40_0f06d5001bff_verse_1` | 248.35 | 311.92 | +63.57 |
| `41_614b6524d9c1_chorus_2` | 398.44 | 399.05 | +0.62 |
| `53_9b09daed5c20_chorus_2` | 225.55 | 501.39 | +275.84 |
| `54_896d60c13cae_chorus_1` | 269.42 | 392.07 | +122.66 |
| `56_631a55cf8bd7_verse_1` | 83.24 | 378.61 | +295.37 |
| `57_5575cf74e224_chorus_1` | 333.19 | 545.16 | +211.97 |
| `60_1f3cb0da46e2_chorus_1` | 175.90 | 784.16 | +608.26 |
| `80_b5192639b9d5_verse_5` | 321.73 | 679.12 | +357.38 |
| `82_9fc7f7c45b11_chorus_5` | 262.55 | 385.55 | +122.99 |
| `90_0fb9afd8227c_verse_5` | 101.88 | 759.93 | +658.05 |
| `96_6f3a48e796cc_chorus_2` | 196.36 | 479.14 | +282.77 |
| `96_c36c0b6d0172_chorus_3` | 208.34 | 655.62 | +447.28 |
| `100_3b8c3834c86b_chorus_2` | 296.83 | 506.14 | +209.31 |
| `105_15361b90cec5_bridge_1` | 381.06 | 599.11 | +218.04 |
| `123_b7d086c26a54_verse_4` | 379.65 | 318.43 | -61.22 |

## Per-sample global onset-duration rhythm distance

| Sample | M6 | LeVo2 | Δ = LeVo2 - M6 | Lower-distance model |
| --- | ---: | ---: | ---: | --- |
| `05_996b8a9e3232_verse_3` | 0.0703 | 0.2710 | +0.2007 | M6 |
| `06_dc8f4c4095e4_chorus_1` | 0.1072 | 0.2261 | +0.1189 | M6 |
| `09_2011788cb650_chorus_4` | 0.1297 | 0.1891 | +0.0594 | M6 |
| `11_b51fba878c91_verse_1` | 0.1709 | 0.0878 | -0.0831 | LeVo2 |
| `25_9450b6fde3cb_verse_6` | 0.1208 | 0.4157 | +0.2949 | M6 |
| `29_378274983647_chorus_2` | 0.1122 | 0.2850 | +0.1727 | M6 |
| `40_0f06d5001bff_verse_1` | 0.0902 | 0.3844 | +0.2941 | M6 |
| `41_614b6524d9c1_chorus_2` | 0.0831 | 0.2064 | +0.1233 | M6 |
| `53_9b09daed5c20_chorus_2` | 0.1226 | 0.2648 | +0.1422 | M6 |
| `54_896d60c13cae_chorus_1` | 0.0733 | 0.1047 | +0.0314 | M6 |
| `56_631a55cf8bd7_verse_1` | 0.0789 | 0.2071 | +0.1283 | M6 |
| `57_5575cf74e224_chorus_1` | 0.0849 | 0.1852 | +0.1003 | M6 |
| `60_1f3cb0da46e2_chorus_1` | 0.1134 | 0.2043 | +0.0909 | M6 |
| `80_b5192639b9d5_verse_5` | 0.1509 | 0.0688 | -0.0821 | LeVo2 |
| `82_9fc7f7c45b11_chorus_5` | 0.1811 | 0.3269 | +0.1459 | M6 |
| `90_0fb9afd8227c_verse_5` | 0.1114 | 0.3389 | +0.2275 | M6 |
| `96_6f3a48e796cc_chorus_2` | 0.0999 | 0.2747 | +0.1748 | M6 |
| `96_c36c0b6d0172_chorus_3` | 0.1374 | 0.2790 | +0.1416 | M6 |
| `100_3b8c3834c86b_chorus_2` | 0.0703 | 0.2087 | +0.1384 | M6 |
| `105_15361b90cec5_bridge_1` | 0.1287 | 0.1158 | -0.0128 | LeVo2 |
| `123_b7d086c26a54_verse_4` | 0.1768 | 0.1754 | -0.0014 | LeVo2 |
