/*
 * 演示数据 / Demo data
 * ---------------------------------------------------------------------------
 * 新增样例时，复制一个 group 对象并修改即可，无需改动 app.js 或 index.html。
 * To add a sample, copy one `group` object and edit it. No other file needs changes.
 *
 * group 字段 / group fields:
 *   id         唯一锚点 id / unique anchor id
 *   title      {zh, en}
 *   sampleId   数据集样本编号，显示在标题旁 / dataset sample id shown next to the title
 *   lyrics     歌词，可留空 / lyrics, may be omitted
 *   prompt     提示词，可留空 / prompt, may be omitted
 *   leadSheet  领谱原文，可留空；显示时会在字面量 "\n" 处换行
 *              raw lead sheet, may be omitted; rendered with a line break at each literal "\n"
 *   systems[]  每个模型一行 / one row per system
 *
 * system 字段 / system fields:
 *   model      模型名，中英通用所以用普通字符串 / model name, a plain language-neutral string
 *   note       {zh, en} 条件与输出说明 / conditioning and output description
 *   variant    "ours" | "baseline" | "gt"  —— 只影响配色 / affects styling only
 *   tracks     { vocal: <track|null>, song: <track|null> }
 *
 * track 字段 / track fields:
 *   src        相对于 index.html 的 mp3 路径 / mp3 path relative to index.html
 *   duration   秒，可选；仅用于在加载前显示时长 / seconds, optional; shown before load
 */

window.DEMO_DATA = {
  // 两个音频列的表头 / headers of the two audio columns
  columns: [
    { key: 'vocal', label: { zh: '纯人声', en: 'Vocal' } },
    { key: 'song', label: { zh: '带伴奏', en: 'Song' } }
  ],

  groups: [
    /* ───────────────────────── Group 1 ───────────────────────── */
    {
      id: 'group-1',
      title: { zh: '样例 1', en: 'Group 1' },
      sampleId: '10_9ccf0f5965c7_verse_6',
      lyrics: '[verse] And maybe my God has a trot in her walk, and her coach bags are knockoff, her hair is all dressed up',
      prompt: '[Musicality-very-high], female, adult, breathy, vibrato-none, general american, soft, solo, folk, english, fully sung, reverb-none, delay-none, chest, mixed, glissando-scoop, vocal-fry, airy, delicate, sweet, calm, melancholic.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_110_120>  <meter_3/4>  <key_Fmin> \\n| ·z3 ·A2 ae ·A n m ey ·-\\n| ·A2 * ·B * ·A * ·A b iy m ay ·G g aa d hh ae ·-\\n| ·G2 * ·F2 * ·(3:2:2 ·F2 z ah tr ·F aa ·-\\n| ·F2 * ·A t ih n hh er ·F2 w ·E *\\n| ·D2 * ·C ao k ·B, ae ·B, n hh er k ·A, ow ch\\n| ·z2 ·B,2 b ae ·(3:2:2 ·C2 g z aa r ·E n aa ·-\\n| ·E3/2 * ·F2 k ao f hh er ·- ·F/ * ·z ·A, hh\\n| ·A,2 eh ·A, r ih ·> ·B, z ao l dr ·C * ·< ·_G *\\n| ·E2 eh s ·D2 t ah p ·z2 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/10_9ccf0f5965c7_verse_6/gen_vocal.mp3', duration: 14.4 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/10_9ccf0f5965c7_verse_6/gen_vocal.mp3', duration: 13.9 },
            song: { src: 'M6_1000samples_with_mixed/10_9ccf0f5965c7_verse_6/gen_mixed.mp3', duration: 13.9 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/10_9ccf0f5965c7_verse_6/gen_vocal.mp3', duration: 15.6 },
            song: { src: 'LeVo2_1000samples/10_9ccf0f5965c7_verse_6/gen_song.mp3', duration: 15.6 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/10_9ccf0f5965c7_verse_6/gt_vocal.mp3', duration: 14.7 },
            song: { src: 'M6_1000samples_with_mixed/10_9ccf0f5965c7_verse_6/gt_mixed.mp3', duration: 14.7 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 2 ─────────────────────────
       条件取自 M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/condition.txt
       Conditions taken from that sample's condition.txt */
    {
      id: 'group-2',
      title: { zh: '样例 2', en: 'Group 2' },
      sampleId: '123_b7d086c26a54_verse_4',
      lyrics: '[verse] Trusting in the Lord has turned my life around.When you call on Him',
      prompt: '[Musicality-very-high], male, senior, modal, vibrato-moderate, southern us, dynamics-moderate, solo, gospel, english, fully sung, hall, delay-none, falsetto, chest, vibrato, glissando-scoop, warm, full, clear, calm, tender.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_130_140>  <meter_4/4>  <key_E> \\n| ·C,4 ·z4\\n| ·z2 ·F, tr ah s ·F, t ih ·F,2 ng ih n ·G,2 dh ah\\n| ·B, l ao ·F, * ·(3:2:2 ·G,2 * ·F, * ·- ·F, * ·> ·F, r d ·z ·B,, hh ae z\\n| ·F,2 t er ·F, n d m ay ·D, l ·F, ay ·G,2 f er ·B, aw ·-\\n| ·B,2 * ·B,2 n d ·A,2 w eh ·B,2 n y\\n| ·B,8 uw k ao l aa n ·-\\n| ·B,2 * ·z4 ·(3:2:2 ·G,2 hh ·G, ih\\n| ·B,8 ·-\\n| ·B,2 ·z6 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/123_b7d086c26a54_verse_4/gen_vocal_b7d086c26a54.mp3', duration: 14.8 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gen_vocal.mp3', duration: 12.9 },
            song: { src: 'M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gen_mixed.mp3', duration: 12.9 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/123_b7d086c26a54_verse_4/gen_vocal.mp3', duration: 22.7 },
            song: { src: 'LeVo2_1000samples/123_b7d086c26a54_verse_4/gen_song.mp3', duration: 22.7 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gt_vocal.mp3', duration: 16.6 },
            song: { src: 'M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gt_mixed.mp3', duration: 16.6 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 3 ─────────────────────────
       条件取自 M6_1000samples_with_mixed/125_43d1560b1026_chorus_5/condition.txt
       Conditions taken from that sample's condition.txt */
    {
      id: 'group-3',
      title: { zh: '样例 3', en: 'Group 3' },
      sampleId: '125_43d1560b1026_chorus_5',
      lyrics: '[chorus] And I want your body on my body every way.I want your body on my body, heaven, baby',
      prompt: '[Musicality-very-high], male, adult, modal, light, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, falsetto, melisma, glissando-scoop, vibrato, smooth, warm, clear, tender, romantic.',
      leadSheet: '<bos>  <sec_bos>  [chorus]  <tempo_120_130>  <meter_4/4>  <key_C>  <keychange>  <key_Dmin> \\n| ·z7/2 ·F,/ * ·G, ae ·> ·A, * ·C * ·D * ·-\\n| ·D2 * ·z ·C n ay w ·D * ·D aa n t ·z ·D y ao r b aa d iy aa ·-\\n| ·D2 * ·z ·E4 n m ay b aa d iy eh v ·- ·E * ·-\\n| ·E * ·E er ·D7/2 iy w ey ay w aa n ·A,/ t y ao r b ·(3 ·=B, aa d iy ·C * ·B, * ·-\\n| ·=B,2 * ·C * ·A, * ·A,2 aa ·B, * ·D * ·-\\n| ·D2 * ·z ·C n m ·D * ·D ay ·z ·D b aa ·-\\n| ·D * ·C2 d iy ·E4 hh eh v ·- ·E * ·-\\n| ·E * ·D ah n b ·D6 ey b iy ·-\\n| ·D4 * ·z ·C ih t ·C s ah s ·F uw <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/125_43d1560b1026_chorus_5/gen_vocal.mp3', duration: 20.0 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/125_43d1560b1026_chorus_5/gen_vocal.mp3', duration: 22.0 },
            song: { src: 'M6_1000samples_with_mixed/125_43d1560b1026_chorus_5/gen_mixed.mp3', duration: 22.0 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/125_43d1560b1026_chorus_5/gen_vocal.mp3', duration: 30.5 },
            song: { src: 'LeVo2_1000samples/125_43d1560b1026_chorus_5/gen_song.mp3', duration: 30.5 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/125_43d1560b1026_chorus_5/gt_vocal.mp3', duration: 18.0 },
            song: { src: 'M6_1000samples_with_mixed/125_43d1560b1026_chorus_5/gt_mixed.mp3', duration: 18.0 }
          }
        }
      ]
    }
  ]
};
