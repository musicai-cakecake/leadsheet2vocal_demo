# Elastic vocal pitch/rhythm evaluation

This package compares each `gen_vocal.mp3` with the `gt_vocal.mp3` in the same
sample directory. It is designed for text-to-music generation: the two files do
not need to share a frame timeline, and the leadsheet is not aligned to either
audio file.

All distances are **lower-is-better**.

## Method

1. Decode both files to mono 16 kHz and trim unrelated leading/trailing silence.
2. Extract:
   - F0/voicing with MLX-RMVPE (pYIN fallback).
   - content-oriented alignment features: MFCC 1–19 plus delta and
     delta-delta, with utterance CMVN and frame L2 normalization. No F0 is
     supplied to this alignment, although MFCCs are not mathematically
     invariant to pitch.
3. Build a slope-regularized, Sakoe-Chiba-constrained DTW path from the
   content features. This path automatically maps corresponding sung content
   at different times; it is not a fixed frame alignment.
4. Compute pitch distance along that independent content path.
5. Compute global tempo distance. The affine path residual after fitting
   `t_gt = a + b * t_gen` is retained only in per-item JSON as an audit
   diagnostic, not as a headline metric.
6. Compute a full-phrase global rhythm distance from ordered pseudo-note
   events. Absolute onset error is normalized by the fixed GT active duration,
   so a long generated output cannot dilute its timing drift. Onset receives
   50% of the score; matched-event symmetric duration error and whole-phrase
   duration-ratio error receive 25% each. Events are aligned monotonically
   without pitch. Missing/extra-event counts are reported as a separate
   diagnostic and do not offset onset/duration similarity. Unlike the local
   affine-path metric, this score intentionally retains global tempo/stretch
   differences. The matched-event duration term remains inside this predefined
   composite but is not reported as a separate headline metric.
7. Supplement the rhythm metrics with a pitch-aware pseudo-note edit distance
   so missing/extra or wrong notes cannot be hidden by standard DTW.

The direct F0-DTW score is included only as a baseline. Because F0 both chooses
the path and supplies its cost, it can optimistically match repeated or wrong
notes.

## Main metrics

| JSON path | Meaning | Unit |
| --- | --- | --- |
| `pitch.content_pitch_cent_distance` | 10%-trimmed absolute F0 error along the content path | cent |
| `pitch.content_macro_pitch_cent_distance` | Same after within-voiced-run median smoothing | cent |
| `pitch.voicing_jaccard_distance` | Voicing mismatch / voiced union along the path | ratio |
| `rhythm.tempo_log_distance` | `abs(log(active_duration_gen / active_duration_gt))` | dimensionless |
| `events.global_rhythm_distance` | Full-phrase onset-duration distance: 50% onset + 25% event duration + 25% phrase duration | normalized cost `[0, 1]` |
| `events.global_rhythm_onset_component` | Additive GT-duration-normalized onset contribution | normalized cost |
| `events.global_rhythm_duration_component` | Total event-duration + phrase-duration contribution | normalized cost |
| `events.global_rhythm_phrase_duration_component` | Additive normalized whole-phrase duration-ratio contribution | normalized cost |
| `events.global_rhythm_alignment_gap_ratio` | Inserted/deleted-event diagnostic, excluded from score | ratio |
| `events.note_edit_distance` | Weighted pseudo-note edit cost / longer note count | normalized cost |
| `events.event_ioi_normalized_distance` | Matched IOI distance after duration normalization | ratio |

Do not add these heterogeneous quantities into a single score unless weights
have been calibrated against a separate human similarity study.

Per-item JSON retains local affine-path and matched-event-duration diagnostics
for reproducibility, but cohort summaries and primary comparison tables omit
them.

## Run

From the `demo_webpage` workspace root:

```bash
conda run -n music-process python -m estimate_tools.run_evaluation \
  --root M6_1000samples \
  --output-dir estimate_tools/results/M6_1000samples \
  --f0-backend rmvpe \
  --save-alignments
```

For a quick smoke test:

```bash
conda run -n music-process python -m estimate_tools.run_evaluation \
  --root M6_1000samples \
  --output-dir estimate_tools/results/pilot \
  --f0-backend rmvpe \
  --limit 1
```

To evaluate only the pair IDs present in another cohort (strict matching):

```bash
conda run -n music-process python -m estimate_tools.run_evaluation \
  --root LeVo2_1000samples \
  --sample-ids-from M6_1000samples \
  --output-dir estimate_tools/results/LeVo2_1000samples_matched21 \
  --f0-backend rmvpe \
  --save-alignments
```

To create paired M6/LeVo2 comparison tables, where
`delta = LeVo2 - M6`:

```bash
conda run -n music-process python -m estimate_tools.compare_results \
  --m6-results estimate_tools/results/M6_1000samples/results.json \
  --levo2-results estimate_tools/results/LeVo2_1000samples_matched21/results.json \
  --output-dir estimate_tools/results/M6_vs_LeVo2_matched21
```

Outputs:

- `results.json`: configuration, metric definitions, cohort summary and items.
- `results.csv`: flattened per-sample metrics.
- `summary.md`: compact lower-is-better cohort summary.
- `items/*.json`: one result per sample, written incrementally.
- `cache/*.npz`: reusable extracted F0/content features.
- `alignments/*.npz`: optional paths and F0 tracks when `--save-alignments`.

## Test

```bash
conda run -n music-process python -m unittest estimate_tools.test_metrics -v
```

## Limitations

- MFCC-DTW is a reproducible content-alignment baseline, not a perfect phoneme
  recognizer. Always inspect samples with high content-DTW cost.
- Pseudo-note events are deliberately supplementary. The global rhythm score
  uses no pitch in its alignment cost, but its event boundaries still come
  from the F0-based pseudo-note front-end. For publication-quality onset and
  duration metrics, replace this front-end with a validated automatic singing
  transcription model while retaining the same distance interface.
- Standard DTW is a normalized alignment dissimilarity, not a strict metric
  satisfying the triangle inequality. Use TWED if that mathematical property is
  required.
