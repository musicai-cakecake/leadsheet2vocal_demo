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
    },

    /* ───────────────────────── Group 4 ───────────────────────── */
    {
      id: 'group-4',
      title: { zh: '样例 4', en: 'Group 4' },
      sampleId: '27_970e62901597_verse_3',
      lyrics: '[verse] This could be the final moment you have left.Say what\'s on your mind with your last breath.And even when you crack, you don\'t need to react',
      prompt: '[Musicality-very-high], male, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, technique-none, warm, smooth, dark, tense.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_110_120>  <meter_2/4>  <key_C#min> \\n| ·z4\\n| ·A,, dh ih s ·B,, k uh d b ·C, iy ·F, dh ah f ay\\n| ·E,2 n ·C, ah l m ow ·G,, m ah n\\n| ·B,,/ t y uw ·B,, * ·B,, hh ae v l ·C,3/2 eh f t\\n| ·z4\\n| ·C, s ey w ·C, ah t s ·C, aa n ·F, y ao r m\\n| ·E,2 ay ·C, n d w ih dh y ·G,, ao\\n| ·B,,2 r l ae s ·B,, t b r eh ·C, th ·-\\n| ·C,2 ·z2\\n| ·A, ae ·F, n iy v ih n w eh n y uw k r ae k ·G, y ·F, uw d\\n| ·G,2 ow n ·G, t ·F,/ n iy ·G,/ d ·-\\n| ·G, * ·F, t uw ·G,2 r\\n| ·G,2 iy ae ·z2 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/27_970e62901597_verse_3/gen_vocal.mp3', duration: 13.4 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/27_970e62901597_verse_3/gen_vocal.mp3', duration: 13.4 },
            song: { src: 'M6_1000samples_with_mixed/27_970e62901597_verse_3/gen_mixed.mp3', duration: 13.4 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/27_970e62901597_verse_3/gen_vocal.mp3', duration: 31.1 },
            song: { src: 'LeVo2_1000samples/27_970e62901597_verse_3/gen_song.mp3', duration: 31.1 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/27_970e62901597_verse_3/gt_vocal.mp3', duration: 13.3 },
            song: { src: 'M6_1000samples/27_970e62901597_verse_3/gt_mixed.mp3', duration: 13.3 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 5 ───────────────────────── */
    {
      id: 'group-5',
      title: { zh: '样例 5', en: 'Group 5' },
      sampleId: '64_eefb7a15ea1c_verse_2',
      lyrics: '[verse] Severed heart, my mistake.I will wait forever.I don\'t know if I\'m awake or if I\'m undercover',
      prompt: '[Musicality-very-high], male, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, hall, delay-none, chest, technique-none, smooth, clear, mellow, melancholic, calm.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_190_200>  <meter_4/4>  <key_Dmin> \\n| ·z6 ·F,2 s eh ·-\\n| ·F,/ * ·G,3 * ·G,4 v er d hh aa ·- ·G,/ * ·-\\n| ·G, * ·F,2 r t ·G,2 m ay ·- ·G,/ * ·F,2 m ih s ·- ·F,/ *\\n| ·F,3/2 t ey ·G,4 k ay w ih ·- ·G,/ * ·z2\\n| ·z ·F,3 l w ·G,3 ey ·F, t ·-\\n| ·F,2 * ·(3:2:2 ·E,2 f er eh ·E, v ·- ·E, * ·D,3 er ·-\\n| ·D,6 ·z2\\n| ·A,2 ay ·G,2 d ow n ·G,4 t n ow ·-\\n| ·G,3/2 * ·F, ih f ay m ·G,3/2 ah ·F,3 w ·G, ey ·-\\n| ·G,4 * ·F, k ·=B,2 ao r ih f ay m ·F, ah ·-\\n| ·F,3/2 * ·G,2 n ·- ·G,/ * ·F,3 d er ·E, k ah ·-\\n| ·E, * ·D,7 v er\\n| ·z8 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/64_eefb7a15ea1c_verse_2/gen_vocal.mp3', duration: 16.2 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/64_eefb7a15ea1c_verse_2/gen_vocal.mp3', duration: 16.2 },
            song: { src: 'M6_1000samples_with_mixed/64_eefb7a15ea1c_verse_2/gen_mixed.mp3', duration: 16.2 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/64_eefb7a15ea1c_verse_2/gen_vocal.mp3', duration: 20.9 },
            song: { src: 'LeVo2_1000samples/64_eefb7a15ea1c_verse_2/gen_song.mp3', duration: 20.9 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/64_eefb7a15ea1c_verse_2/gt_vocal.mp3', duration: 16.4 },
            song: { src: 'M6_1000samples/64_eefb7a15ea1c_verse_2/gt_mixed.mp3', duration: 16.4 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 6 ───────────────────────── */
    {
      id: 'group-6',
      title: { zh: '样例 6', en: 'Group 6' },
      sampleId: '82_499b072a4486_verse_9',
      lyrics: '[verse] These fading soul roads of the streets, you\'ll find the world, but it\'s searching for me',
      prompt: '[Musicality-very-high], male, adult, harsh, vibrato-none, general american, powerful, solo, metal, english, rhythmic speech, room, delay-none, chest, head, growl, distortion, vocal-fry, gritty, dark, angry.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_100_110>  <meter_3/4>  <key_Bmin> \\n| ·z6\\n| ·^D,,7/2 dh iy ·E,,2 z f ey ·- ·E,,/ *\\n| ·=F,,3 dx ih ·F,,3 ng s ow\\n| ·E,,3/2 l r ·^D,,3/2 ow d ·D,,3/2 z ah ·=D,,3/2 v dh ah s\\n| ·E,,3 tr iy ·E,, t s y ·z2\\n| ·^D,,3 uw l ·D,, f ay ·C,,2 n d dh ah\\n| ·=C,,3 w er l ·^C,,3/2 d b ah t ih t s ·D,,3/2 *\\n| ·D,,3/2 s er ·E,,2 ch ih ng ·- ·E,,/ * ·C,, f ao ·> ·E,, r m iy ·-\\n| ·E,,3 ·D,,3 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/82_499b072a4486_verse_9/gen_vocal.mp3', duration: 10.6 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/82_499b072a4486_verse_9/gen_vocal.mp3', duration: 10.6 },
            song: { src: 'M6_1000samples_with_mixed/82_499b072a4486_verse_9/gen_mixed.mp3', duration: 10.6 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/82_499b072a4486_verse_9/gen_vocal.mp3', duration: 36.7 },
            song: { src: 'LeVo2_1000samples/82_499b072a4486_verse_9/gen_song.mp3', duration: 36.7 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/82_499b072a4486_verse_9/gt_vocal.mp3', duration: 10.6 },
            song: { src: 'M6_1000samples/82_499b072a4486_verse_9/gt_mixed.mp3', duration: 10.6 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 7 ───────────────────────── */
    {
      id: 'group-7',
      title: { zh: '样例 7', en: 'Group 7' },
      sampleId: '82_52a558a32aaa_verse_2',
      lyrics: '[verse] Thousand shall fall at thy side, and ten thousand at thy right hand.But it shall not come nigh thee.Only when thy night shall thou behold and see the reward of the wicked',
      prompt: '[Musicality-very-high], male, adult, growl, vibrato-none, general american, powerful, solo, metal, english, rhythmic speech, room, delay-none, chest, distortion, vocal-fry, gritty, dark, angry.',
      leadSheet: '<bos>  <sec_bos>  [verse]  <tempo_ge200>  <meter_6/8>  <key_Bbmin> \\n| ·z6\\n| ·z3/4 ·E, th aw ·- ·E,/4 * ·B,,3/4 z ah n d ·C, sh ae l ·- ·C,/4 * ·A,, f ao l ·z/4 ·F,3/4 ae\\n| ·G,, t dh ay s ay ·z ·C,3/4 * ·E, d ae n t ·E,3/4 eh n th aw ·D,/ z ah n d ·z\\n| ·E,3/4 ae t ·=G,, dh ay ·E, r ay ·A,, t hh ae n d ·- ·A,,/4 * ·z3/4 ·D,/4 b ah t ih ·E,/ t sh ·D,/ ae l n ·-\\n| ·D,/4 * ·E,7/4 aa t ·E, k ·E, ah m n ay dh iy ·z2\\n| ·=G,3/4 ow n l ·=G,, iy w eh n ·- ·G,,/4 * ·z3/4 ·_G,,3/4 dh ay ·F,,3/4 * ·B,, n ay ·A,,3/4 t sh ae ·-\\n| ·A,,/ * ·< ·G,,/ l dh ·G,3/4 aw b ih ·A, hh ow l d ·- ·A,/4 * ·z ·z/4 ·E, ae n s ·C,3/4 iy dh ah ·-\\n| ·C, * ·B, r ·=E, ih w ao r d ah v ·z3/2 ·F,,3/2 dh ah w ih k ah d\\n| ·z6 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/82_52a558a32aaa_verse_2/gen_vocal.mp3', duration: 15.8 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/82_52a558a32aaa_verse_2/gen_vocal.mp3', duration: 15.7 },
            song: { src: 'M6_1000samples_with_mixed/82_52a558a32aaa_verse_2/gen_mixed.mp3', duration: 15.7 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/82_52a558a32aaa_verse_2/gen_vocal.mp3', duration: 20.5 },
            song: { src: 'LeVo2_1000samples/82_52a558a32aaa_verse_2/gen_song.mp3', duration: 20.5 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/82_52a558a32aaa_verse_2/gt_vocal.mp3', duration: 15.0 },
            song: { src: 'M6_1000samples/82_52a558a32aaa_verse_2/gt_mixed.mp3', duration: 15.0 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 8 ───────────────────────── */
    {
      id: 'group-8',
      title: { zh: '样例 8', en: 'Group 8' },
      sampleId: '92_ea76abe2f1d5_chorus_3',
      lyrics: '[chorus] Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light?',
      prompt: '[Musicality-very-high], female, adult, modal, vibrato-moderate, general american, dynamics-moderate, solo, r&b, english, fully sung, room, delay-none, chest, mixed, vibrato, melisma, smooth, warm, clear, tender, calm.',
      leadSheet: '<bos>  <sec_bos>  [chorus]  <tempo_110_120>  <meter_4/4>  <key_Fmin> \\n| ·z8\\n| ·z ·A, * ·C k ih ·B, m d uw ·z ·A, ay ·z2\\n| ·z ·A, * ·B,/ d aa t k ih ·C/ m ·B, d uw ay ·z ·F, b l uw ·z ·A, l ay\\n| ·z ·A, t k ih m ·B,/ d uw ·C/ ay ·B, * ·z ·A, d aa t ·z2\\n| ·z ·A, k ih m d ·C uw ay ·B, * ·z ·F,/ b l uw ·F,/ * ·z ·A,/ l ay ·A,/ t\\n| ·z ·A,/ k ih ·A,/ m d ·C/ uw ay ·C/ * ·B, * ·z ·A, d aa t ·z2\\n| ·z ·A, k ih ·C m d uw ay ·B, * ·z ·F, b l uw ·z ·A, l ay t\\n| ·z ·A, k ih ·B,/ m d uw ay ·C/ * ·B, * ·z ·A, d aa t ·z2\\n| ·z ·A, k ih m ·B,/ d uw ay ·C/ * ·B,2 * ·F, b l uw ·z ·A, l ay t\\n| ·z8 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/92_ea76abe2f1d5_chorus_3/gen_vocal.mp3', duration: 20.9 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/92_ea76abe2f1d5_chorus_3/gen_vocal.mp3', duration: 20.9 },
            song: { src: 'M6_1000samples_with_mixed/92_ea76abe2f1d5_chorus_3/gen_mixed.mp3', duration: 20.9 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/92_ea76abe2f1d5_chorus_3/gen_vocal.mp3', duration: 33.2 },
            song: { src: 'LeVo2_1000samples/92_ea76abe2f1d5_chorus_3/gen_song.mp3', duration: 33.2 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/92_ea76abe2f1d5_chorus_3/gt_vocal.mp3', duration: 20.8 },
            song: { src: 'M6_1000samples/92_ea76abe2f1d5_chorus_3/gt_mixed.mp3', duration: 20.8 }
          }
        }
      ]
    },

    /* ───────────────────────── Group 9 ───────────────────────── */
    {
      id: 'group-9',
      title: { zh: '样例 9', en: 'Group 9' },
      sampleId: '97_4b80f4b0bf1d_chorus_2',
      lyrics: '[chorus] Kaback, blood and distortion.Kaback, blood and distortion',
      prompt: '[Musicality-very-high], male, adult, harsh, vibrato-none, accent-none, powerful, solo, metal, english, rhythmic speech, room, delay-none, chest, growl, distortion, gritty, angry, dark.',
      leadSheet: '<bos>  <sec_bos>  [chorus]  <tempo_150_160>  <meter_2/4>  <key_Bbmin> \\n| ·z4 <keychange>  <key_Bbmin> \\n| ·E,, b l ah ·A,, d ae ·D,,2 n\\n| ·A,,3/2 d ih ·A,,3/2 s t ·B,, ao r sh\\n| ·B,, ah ·A,,3 n\\n| ·z4\\n| ·z ·B,, b ·B,,2 l ah\\n| ·z2 ·A,, d ae ·G,, * ·-\\n| ·G,, * ·=G,, n d ih s ·A,, t ao ·F,, r sh ah n ·-\\n| ·F,,2 ·z2\\n| ·z4 <eos>',
      systems: [
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 只输出 vocal', en: 'with lead-sheet · vocal only' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples/97_4b80f4b0bf1d_chorus_2/gen_vocal.mp3', duration: 7.5 },
            song: null
          }
        },
        {
          model: 'M6',
          note: { zh: '有 lead-sheet 条件 · 输出 vocal 与 song', en: 'with lead-sheet · vocal + song' },
          variant: 'ours',
          tracks: {
            vocal: { src: 'M6_1000samples_with_mixed/97_4b80f4b0bf1d_chorus_2/gen_vocal.mp3', duration: 7.7 },
            song: { src: 'M6_1000samples_with_mixed/97_4b80f4b0bf1d_chorus_2/gen_mixed.mp3', duration: 7.7 }
          }
        },
        {
          model: 'LeVo2',
          note: { zh: '无 lead-sheet 条件 · 开源 SongGeneration2', en: 'without lead-sheet · open-source SongGeneration2' },
          variant: 'baseline',
          tracks: {
            vocal: { src: 'LeVo2_1000samples/97_4b80f4b0bf1d_chorus_2/gen_vocal.mp3', duration: 28.8 },
            song: { src: 'LeVo2_1000samples/97_4b80f4b0bf1d_chorus_2/gen_song.mp3', duration: 28.8 }
          }
        },
        {
          model: 'GT',
          note: { zh: '真实样本 · 数据集原始录音', en: 'ground truth · original recording' },
          variant: 'gt',
          tracks: {
            vocal: { src: 'M6_1000samples/97_4b80f4b0bf1d_chorus_2/gt_vocal.mp3', duration: 7.5 },
            song: { src: 'M6_1000samples/97_4b80f4b0bf1d_chorus_2/gt_mixed.mp3', duration: 7.5 }
          }
        }
      ]
    }
  ]
};

/* ───────────────── Same lead sheet, different prompts ─────────────────
 * 两组结果共享上方对应样例的歌词与领谱。Prompts 1 是样例原始提示词，
 * Prompts 2 来自其它歌曲，并且该组推理不使用参考音频。
 */
(function () {
  var promptVariants = [
    {
      sampleId: '27_970e62901597_verse_3',
      prompts2: '[Musicality-very-high], female, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, plate, present, chest, mixed, technique-none, clear, bright, smooth, energetic, romantic.',
      prompts1Duration: 13.4,
      prompts2Duration: 13.6
    },
    {
      sampleId: '64_eefb7a15ea1c_verse_2',
      prompts2: '[Musicality-very-high], male, adult, breathy, vibrato-moderate, african american vernacular (aave), dynamics-moderate, solo, r&b, english, fully sung, plate, present, chest, mixed, falsetto, melisma, riffs-runs, breath-adlib, husky, airy, smooth, melancholic, tender.',
      prompts1Duration: 16.2,
      prompts2Duration: 20.4
    },
    {
      sampleId: '82_499b072a4486_verse_9',
      prompts2: '[Musicality-very-high], female, adult, breathy, light, general american, highly-varied, solo, pop, english, fully sung, hall, delay-none, chest, head, vibrato, breath-adlib, airy, delicate, clear, dreamy, nostalgic.',
      prompts1Duration: 10.6,
      prompts2Duration: 11.4
    },
    {
      sampleId: '82_52a558a32aaa_verse_2',
      prompts2: '[Musicality-very-high], male, adult, modal, light, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, falsetto, melisma, glissando-scoop, vibrato, smooth, warm, clear, tender, romantic.',
      prompts1Duration: 15.7,
      prompts2Duration: 14.4
    },
    {
      sampleId: '92_ea76abe2f1d5_chorus_3',
      prompts2: '[Musicality-very-high], female, adult, breathy, vibrato-none, general american, soft, solo, pop, english, fully sung, room, delay-none, chest, mixed, vocal-fry, breath-adlib, airy, cool, dark, mysterious.',
      prompts1Duration: 20.9,
      prompts2Duration: 18.5
    },
    {
      sampleId: '97_4b80f4b0bf1d_chorus_2',
      prompts2: '[Musicality-very-high], male, adult, raspy, heavy, african american vernacular (aave), highly-varied, solo, gospel, english, fully sung, hall, present, chest, falsetto, belt, vibrato, melisma, husky, gritty, powerful, melancholic, tender.',
      prompts1Duration: 7.7,
      prompts2Duration: 7.1
    }
  ];

  var sourceGroups = {};
  window.DEMO_DATA.groups.forEach(function (group) {
    sourceGroups[group.sampleId] = group;
  });

  window.PROMPT_DEMO_DATA = {
    columns: window.DEMO_DATA.columns,
    groups: promptVariants.map(function (item, index) {
      var source = sourceGroups[item.sampleId];
      var prompts1Root = 'M6_1000samples_with_mixed/' + item.sampleId + '/';
      var prompts2Root = 'M6_1000samples_with_other_prompts/' + item.sampleId + '/';

      return {
        id: 'prompt-group-' + (index + 1),
        title: { zh: '样例 ' + (index + 1), en: 'Group ' + (index + 1) },
        sampleId: item.sampleId,
        lyrics: source.lyrics,
        prompts: [
          {
            label: { zh: '提示词 1', en: 'Prompts 1' },
            value: source.prompt
          },
          {
            label: { zh: '提示词 2', en: 'Prompts 2' },
            value: item.prompts2
          }
        ],
        leadSheet: source.leadSheet,
        systems: [
          {
            model: 'M6 · Prompts 1',
            note: {
              zh: '原始提示词 · 使用参考音频',
              en: 'original prompts · with reference audio'
            },
            variant: 'ours',
            tracks: {
              vocal: {
                src: prompts1Root + 'gen_vocal.mp3',
                duration: item.prompts1Duration
              },
              song: {
                src: prompts1Root + 'gen_mixed.mp3',
                duration: item.prompts1Duration
              }
            }
          },
          {
            model: 'M6 · Prompts 2',
            note: {
              zh: '替换提示词 · 不使用参考音频',
              en: 'replaced prompts · no reference audio'
            },
            variant: 'baseline',
            tracks: {
              vocal: {
                src: prompts2Root + 'gen_vocal.mp3',
                duration: item.prompts2Duration
              },
              song: {
                src: prompts2Root + 'gen_mixed.mp3',
                duration: item.prompts2Duration
              }
            }
          }
        ]
      };
    })
  };
})();
