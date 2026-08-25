/*
 * 演示数据 / Demo data
 * ---------------------------------------------------------------------------
 * Metadata is extracted from each sample's condition.json.
 * The first collection contains only samples shared by M6_1000samples,
 * M6_1000samples_with_mixed, and LeVo2_1000samples.
 */

window.DEMO_DATA = {
  "columns": [
    {
      "key": "vocal",
      "label": {
        "zh": "纯人声",
        "en": "Vocal"
      }
    },
    {
      "key": "song",
      "label": {
        "zh": "带伴奏",
        "en": "Song"
      }
    }
  ],
  "groups": [
    {
      "id": "group-1",
      "title": {
        "zh": "样例 1",
        "en": "Group 1"
      },
      "sampleId": "123_b7d086c26a54_verse_4",
      "lyrics": "[verse] Trusting in the Lord has turned my life around.When you call on Him",
      "prompt": "[Musicality-very-high], male, senior, modal, vibrato-moderate, southern us, dynamics-moderate, solo, gospel, english, fully sung, hall, delay-none, falsetto, chest, vibrato, glissando-scoop, warm, full, clear, calm, tender.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_130_140>  <meter_4/4>  <key_E> \n| ·C,4 ·z4\n| ·z2 ·F, tr ah s ·F, t ih ·F,2 ng ih n ·G,2 dh ah\n| ·B, l ao ·F, * ·(3:2:2 ·G,2 * ·F, * ·- ·F, * ·> ·F, r d ·z ·B,, hh ae z\n| ·F,2 t er ·F, n d m ay ·D, l ·F, ay ·G,2 f er ·B, aw ·-\n| ·B,2 * ·B,2 n d ·A,2 w eh ·B,2 n y\n| ·B,8 uw k ao l aa n ·-\n| ·B,2 * ·z4 ·(3:2:2 ·G,2 hh ·G, ih\n| ·B,8 ·-\n| ·B,2 ·z6 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/123_b7d086c26a54_verse_4/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/123_b7d086c26a54_verse_4/gt_melody_cut.wav",
        "duration": 16.6
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/123_b7d086c26a54_verse_4/gen_vocal.mp3",
              "duration": 14.8
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gen_vocal.mp3",
              "duration": 12.9
            },
            "song": {
              "src": "M6_1000samples_with_mixed/123_b7d086c26a54_verse_4/gen_mixed.mp3",
              "duration": 12.9
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/123_b7d086c26a54_verse_4/gen_vocal.mp3",
              "duration": 22.7
            },
            "song": {
              "src": "LeVo2_1000samples/123_b7d086c26a54_verse_4/gen_song.mp3",
              "duration": 22.7
            }
          }
        }
      ]
    },
    {
      "id": "group-2",
      "title": {
        "zh": "样例 2",
        "en": "Group 2"
      },
      "sampleId": "05_996b8a9e3232_verse_3",
      "lyrics": "[verse] There's no heaven that wants me, no other good ever holds me in.No matter how far I run, I can never escape.I still bear all of my sins",
      "prompt": "[Musicality-very-high], male, adult, harsh, light, general american, highly-varied, solo, metal, english, fully sung, hall, present, chest, mixed, growl, distortion, belt, gritty, powerful, dark, angry, sad.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_130_140>  <meter_4/4>  <key_A> \n| ·F2 * ·z4 ·G,, dh eh ·G,, r z n ow <keychange>  <key_Amin> \n| ·^G,,2 hh eh ·e'2 v ah n ·z2 ·=G/ dh ae ·F, * ·^F/ t w\n| ·F aa ·> ·^F n t s m ·^D,2 iy ·G/ n ·=F ow ah ·E dh er ·F3/2 g\n| ·F uh ·E3/2 d eh v er ·E2 hh ow ·E l d z m iy ·E2 ih n ·- ·E/ *\n| ·z2 ·z/ ·^C, n ow ·E, m ae ·E, * ·E,2 dx er ·- ·E,/ *\n| ·E,3/2 hh aw ·E,2 * ·- ·E,/ * ·z2 ·^F f aa r ay r ah n ay ·=F/ k ·^C,/ ae\n| ·^F * ·F n ·^D n eh v er ·> ·D ih s ·^G2 k ey p ·z ·E ay s\n| ·(3:2:2 ·E,2 t ih l ·^F b eh ·- ·F3/2 * ·=F3/2 r ao ·E l ah ·^G,,2 v m ay s ih n z\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/05_996b8a9e3232_verse_3/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/05_996b8a9e3232_verse_3/gt_melody_cut.wav",
        "duration": 16.1
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/05_996b8a9e3232_verse_3/gen_vocal.mp3",
              "duration": 16.0
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/05_996b8a9e3232_verse_3/gen_vocal.mp3",
              "duration": 16.0
            },
            "song": {
              "src": "M6_1000samples_with_mixed/05_996b8a9e3232_verse_3/gen_mixed.mp3",
              "duration": 16.0
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/05_996b8a9e3232_verse_3/gen_vocal.mp3",
              "duration": 21.6
            },
            "song": {
              "src": "LeVo2_1000samples/05_996b8a9e3232_verse_3/gen_song.mp3",
              "duration": 21.6
            }
          }
        }
      ]
    },
    {
      "id": "group-3",
      "title": {
        "zh": "样例 3",
        "en": "Group 3"
      },
      "sampleId": "06_dc8f4c4095e4_chorus_1",
      "lyrics": "[chorus] I bite my tongue, my mouth's full of blood.I bite my tongue, my mouth's full of blood.Feeling swamped out",
      "prompt": "[Musicality-very-high], female, adult, breathy, vibrato-none, general american, soft, solo, pop, english, fully sung, room, delay-none, chest, mixed, glissando-scoop, vocal-fry, airy, delicate, cool, melancholic, tense.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_150_160>  <meter_4/4>  <key_B> \n| ·B,2 * ·z4 ·z ·B, ay b ay t\n| ·B6 m ay ·B2 t ah\n| ·A6 ng ·z ·D m ay\n| ·E * ·D3 * ·E3 f uh ·B, l\n| ·E3/2 ah v b l ah ·D4 * ·- ·D/ * ·z ·B, d ay\n| ·B6 b ay t m ay t ah ·B ng m ay ·< ·A *\n| ·C6 f uh l ·z ·D ah\n| ·E3/2 v ·D2 b l ·- ·D/ * ·(3:2:2 ·E2 * ·D * ·- ·D * ·B, *\n| ·E3/2 ah ·D4 * ·- ·D/ * ·z2\n| ·B, d f iy ·> ·D l ih ·C4 * ·- ·C * ·B, *\n| ·C4 * ·C3/2 ng s w ao ·D3/2 * ·B, *\n| ·B,/ m p t aw ·B,/ * ·B, * ·B, * ·G,3 t ·z2\n| ·z7 ·=G, ay <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/06_dc8f4c4095e4_chorus_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/06_dc8f4c4095e4_chorus_1/gt_melody_cut.wav",
        "duration": 19.5
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/06_dc8f4c4095e4_chorus_1/gen_vocal.mp3",
              "duration": 18.0
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/06_dc8f4c4095e4_chorus_1/gen_vocal.mp3",
              "duration": 18.0
            },
            "song": {
              "src": "M6_1000samples_with_mixed/06_dc8f4c4095e4_chorus_1/gen_mixed.mp3",
              "duration": 18.0
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/06_dc8f4c4095e4_chorus_1/gen_vocal.mp3",
              "duration": 29.4
            },
            "song": {
              "src": "LeVo2_1000samples/06_dc8f4c4095e4_chorus_1/gen_song.mp3",
              "duration": 29.4
            }
          }
        }
      ]
    },
    {
      "id": "group-4",
      "title": {
        "zh": "样例 4",
        "en": "Group 4"
      },
      "sampleId": "09_2011788cb650_chorus_4",
      "lyrics": "[chorus] I still got a lot of miles to go.It's a winding uphill road, but I'll get there the only way I know.I use what I got, take what I get, give till I ain't got nothing left, then I give it some more.Keep on climbing up that mountain, keep truckin' along, work up a sweat, past every no after no after no till I get a yes.I don't worry about what I'm not",
      "prompt": "[Musicality-very-high], male, adult, raspy, vibrato-moderate, southern us, powerful, solo, country, english, fully sung, plate, delay-none, chest, mixed, belt, twang, vibrato, gritty, full, energetic, triumphant.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_80_90>  <meter_4/4>  <key_Eb> \n| ·B,/ l ·B, p t m iy ·B,/ g eh ·B, t dh ih ·> ·F, s f aa ·E,2 r ·z2\n| ·C, ay ·C s t ih ·C l g aa ·> ·A, t ah l ·C aa ·C/ t ah ·C2 * ·C/ v\n| ·_D, m ay l z t ·C, uw g ow ih t s ah w ·< ·=D ay ·D/ n d ih ng ·E/ * ·E3/2 ah p hh ih ·D3/2 l r ow d b ah ·A,/ t ·=D,/ *\n| ·C, * ·_D ay l g eh ·D/ t ·D dh eh ·D/ r dh ah ·D/ ow ·C n ·A, l iy w ey ·B, ay ·B,/ n ·-\n| ·B,2 * ·- ·B,/ * ·A,/ * ·F, ow ·z2 ·B,/ ay y uw s w ·_D ah t ay ·E/ g aa\n| ·B,2 t ·B,/ t ey k ·C/ w ah ·E/ t ay g ·E2 eh ·B,/ t g ih ·B, v t ·< ·E ih l ay\n| ·E/ ey ·D n t g aa ·D3/2 t n ah th ih ng l eh ·C/ f t dh eh ·C/ * ·B,/ * ·B, n ay g ih v ih ·B,/ * ·B,/ * ·C/ t ·E/ s ah m ·E/ m ao\n| ·C2 * ·B,/ r k iy p ·E/ aa n k ·E/ l ay m ih ng ·E/ ah ·E * ·E/ * ·E/ * ·F p dh ae ·> ·F * ·-\n| ·F * ·B,3 t m aw n t ah n ·z/ ·B, k iy ·B,/ p ah ·B,/ l ·C/ * ·E/ * ·E/ ao\n| ·C2 ng ·B,/ w er ·C/ k ah p ·D/ ah s ·E/ w eh ·C t ·> ·B, p ae ·B,/ s ·_D/ t eh ·E/ v er iy n ·E/ ow\n| ·D/ * ·D/ ae ·D/ f t er n ·D/ ow ·D * ·D/ ae f t er n ·D/ ow ·E/ * ·E/ t ih ·E/ * ·E/ * ·D/ * ·D/ * ·C/ * ·B,/ *\n| ·A,2 l ay g eh t ah y eh s ·C, ay ·C d ow ·C/ n t w ·B,/ er iy ah b ·B,/ aw ·A,/ t w ·B,/ ah ·B, t ay ·G,/ m n aa\n| ·F,2 t ·z2 ·G3/2 ay ·G y uw ·F/ s w ah ·E/ n ah v ·E/ g aa d z ·- <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/09_2011788cb650_chorus_4/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/09_2011788cb650_chorus_4/gt_melody_cut.wav",
        "duration": 37.2
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/09_2011788cb650_chorus_4/gen_vocal.mp3",
              "duration": 34.3
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/09_2011788cb650_chorus_4/gen_vocal.mp3",
              "duration": 35.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/09_2011788cb650_chorus_4/gen_mixed.mp3",
              "duration": 35.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/09_2011788cb650_chorus_4/gen_vocal.mp3",
              "duration": 31.2
            },
            "song": {
              "src": "LeVo2_1000samples/09_2011788cb650_chorus_4/gen_song.mp3",
              "duration": 31.2
            }
          }
        }
      ]
    },
    {
      "id": "group-5",
      "title": {
        "zh": "样例 5",
        "en": "Group 5"
      },
      "sampleId": "11_b51fba878c91_verse_1",
      "lyrics": "[verse] There was a better day, unlike today, where the vision inside decided to stay.Took the words that were true and a picture of you to the room where they rotted away.And then I came back to find out how it all began.Now I know this pen will never leave my hand.Won't you sing me to sleep? I can't stand the leak from the faucet that runs dry and drips like the tear from my eye",
      "prompt": "[Musicality-very-high], male, adult, pressed, vibrato-none, general american, powerful, solo, rock, english, fully sung, plate, delay-none, chest, mixed, belt, twang, bright, nasal, energetic, angry.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_ge200>  <meter_4/4>  <key_Eb> \n| ·z8\n| ·z2 ·E2 dh eh ·E2 r w aa ·E2 z ah b eh\n| ·E3 dx ·D3 er ·B,2 * ·-\n| ·B,4 * ·- ·B, * ·B, d ·z2\n| ·E2 ey ah ·E n l ay ·E3 * ·B,2 k t ah\n| ·B,4 d ey w eh ·E,2 r ·E,2 dh ah\n| ·C3 v ih ·B,2 zh ah ·- ·B,/ * ·C2 n ih n s ·- ·C/ *\n| ·B,7/2 ay ·F,2 d ·- ·F,/ * ·A,2 d ih s\n| ·C3 ay ·B,3 * ·C2 dx ih\n| ·B,4 d ·G,2 t uw s t ey t uh k ·G,2 dh ah w\n| ·E3 er d z dh ae ·D3 * ·C2 t w er\n| ·B,4 * ·F,2 tr uw ae ·F,2 n ah\n| ·E7/2 p ih k ch ·D2 er ·- ·D/ * ·C2 ah\n| ·B,4 v y uw ·E,2 t uw ·F,2 dh ah\n| ·C3 r uw m w ·B,3 eh ·G,2 r dh ey\n| ·C7/2 r aa ·B,2 dx ih ·- ·B,/ * ·C2 d ah w\n| ·B,4 ey ae ·z2 ·F,2 n dh\n| ·C4 eh ·B,4 n ay k ey m b ae ·-\n| ·B,2 * ·E2 k ·E2 t ·E2 uw f\n| ·E2 ay ·D2 * ·C2 * ·G,2 n\n| ·C3 d aw t hh aw ih t ao ·B,3 l ·B,2 b ih g ae ·-\n| ·B,6 ·z2\n| ·z2 ·E2 n n aw ay ·E2 n ow ·D2 dh ih s\n| ·E2 p eh ·D2 n ·B,2 w ih l ·A,2 n eh\n| ·C3 v er l iy ·B,4 v m ay hh ae ·- ·B, * ·-\n| ·B,2 * ·z2 ·B,2 n d w ow n ·A,2 *\n| ·E3 t y uw ·D2 * ·- ·D/ * ·C2 s ·B,/ ih ng m iy t uw ·-\n| ·B,2 * ·z2 ·G,2 s l iy p ay ·G,2 k ae n\n| ·E3 * ·D2 t s t ae ·- ·D/ * ·C2 n d dh ah l iy k f r ·- ·C/ *\n| ·B,2 ah m dh ah f ·z2 ·G,2 ao ·_G,2 s\n| ·C7/2 ah t dh ae t r ·B,2 ah n z dr ay ·G,2 * ·C/ * ·-\n| ·C3 * ·B,3 * ·G,2 ae n dr\n| ·C2 ih ·- ·C/ * ·B,3 p s l ay ·B,2 k dh ah ·- ·B,/ *\n| ·G3 t eh ·E r f r ah ·- ·(3 ·E * ·E m m ay ·F * ·- ·F2 *\n| ·E8 ay ·-\n| ·E6 ·z2\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/11_b51fba878c91_verse_1/prompt_vocal.mp3",
        "duration": 9.6
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/11_b51fba878c91_verse_1/gt_melody_cut.wav",
        "duration": 32.4
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/11_b51fba878c91_verse_1/gen_vocal.mp3",
              "duration": 38.8
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/11_b51fba878c91_verse_1/gen_vocal.mp3",
              "duration": 31.1
            },
            "song": {
              "src": "M6_1000samples_with_mixed/11_b51fba878c91_verse_1/gen_mixed.mp3",
              "duration": 31.1
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/11_b51fba878c91_verse_1/gen_vocal.mp3",
              "duration": 31.5
            },
            "song": {
              "src": "LeVo2_1000samples/11_b51fba878c91_verse_1/gen_song.mp3",
              "duration": 31.5
            }
          }
        }
      ]
    },
    {
      "id": "group-6",
      "title": {
        "zh": "样例 6",
        "en": "Group 6"
      },
      "sampleId": "25_9450b6fde3cb_verse_6",
      "lyrics": "[verse] He'll take me to another world, of which I've only read and heard, and we will share what's left forevermore",
      "prompt": "[Musicality-very-high], female, adult, modal, light, accent-none, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, head, glissando-scoop, vibrato, clear, sweet, bright, happy, playful.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_130_140>  <meter_4/4>  <key_F> \n| ·z8\n| ·z ·C hh iy l ·F t ·D ey k m iy ·G3 t uw ·A ah n\n| ·F2 * ·D ah dh er ·D w er ·G2 l d ·z2\n| ·z ·C ah v ·< ·D w ih ch ·D * ·E2 ay ·- ·E/ * ·F3/2 v ow n l iy\n| ·D2 r eh ·F d ·D3 ae n hh er d ·z2\n| ·z2 ·A,2 ae n ·_D2 w iy ·E w ih ·> ·E l sh eh ·-\n| ·E * ·G2 * ·G r w ah t s ·E2 l eh ·E2 *\n| ·E2 * ·F f t ·F3 * ·z2\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/25_9450b6fde3cb_verse_6/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/25_9450b6fde3cb_verse_6/gt_melody_cut.wav",
        "duration": 16.3
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/25_9450b6fde3cb_verse_6/gen_vocal.mp3",
              "duration": 14.4
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/25_9450b6fde3cb_verse_6/gen_vocal.mp3",
              "duration": 14.4
            },
            "song": {
              "src": "M6_1000samples_with_mixed/25_9450b6fde3cb_verse_6/gen_mixed.mp3",
              "duration": 14.4
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/25_9450b6fde3cb_verse_6/gen_vocal.mp3",
              "duration": 27.0
            },
            "song": {
              "src": "LeVo2_1000samples/25_9450b6fde3cb_verse_6/gen_song.mp3",
              "duration": 27.0
            }
          }
        }
      ]
    },
    {
      "id": "group-7",
      "title": {
        "zh": "样例 7",
        "en": "Group 7"
      },
      "sampleId": "29_378274983647_chorus_2",
      "lyrics": "[chorus] The letters on the bus are all lined up, all lined up, all lined up.The letters on the bus are all lined up from A to Z",
      "prompt": "[Musicality-very-high], female, adult, modal, vibrato-none, general american, dynamics-moderate, solo, other, english, fully sung, room, delay-none, chest, mixed, technique-none, bright, clear, sweet, happy, playful.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_110_120>  <meter_4/4>  <key_Db> \n| ·z6 ·A,2 dh ah\n| ·(3:2:2 ·D2 l eh ·D dx er ·D z aa ·> ·D n dh ah b ·D ah ·> ·D s ·F aa ·> ·F *\n| ·A3/2 * ·F r ao l l ay n ·F3/2 * ·D2 d ·z2\n| ·E2 ah ·C/ p ao l l ay ·C/ * ·C n ·A,2 d ah p ·z2\n| ·A2 ao ·F l l ay n ·< ·F * ·D2 d ah p ·A, dh ah ·< ·A, l\n| ·D eh ·D dx er ·D z aa ·> ·D n dh ah b ·D2 ah s ·F aa ·> ·F r ao\n| ·A2 * ·F2 l l ay ·D n d ah ·< ·D p ·D2 f r ah m\n| ·E4 ah ·A,4 t uw\n| ·D6 z iy ·z2 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/29_378274983647_chorus_2/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/29_378274983647_chorus_2/gt_melody_cut.wav",
        "duration": 19.3
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/29_378274983647_chorus_2/gen_vocal.mp3",
              "duration": 19.3
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/29_378274983647_chorus_2/gen_vocal.mp3",
              "duration": 19.3
            },
            "song": {
              "src": "M6_1000samples_with_mixed/29_378274983647_chorus_2/gen_mixed.mp3",
              "duration": 19.3
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/29_378274983647_chorus_2/gen_vocal.mp3",
              "duration": 28.2
            },
            "song": {
              "src": "LeVo2_1000samples/29_378274983647_chorus_2/gen_song.mp3",
              "duration": 28.2
            }
          }
        }
      ]
    },
    {
      "id": "group-8",
      "title": {
        "zh": "样例 8",
        "en": "Group 8"
      },
      "sampleId": "40_0f06d5001bff_verse_1",
      "lyrics": "[verse] On the night I first met you, you made all my dreams come true, and I said to myself that I would never stop dancing",
      "prompt": "[Musicality-very-high], female, adult, modal, vibrato-moderate, african american vernacular (aave), powerful, solo, r&b, english, fully sung, room, delay-none, chest, mixed, belt, vibrato, melisma, bright, gritty, happy, energetic.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_130_140>  <meter_2/4>  <key_Eb> \n| ·z4\n| ·E aa ·> ·E n ·_D * ·E dh ah n ay\n| ·z ·C2 t ay f ·E er s ·-\n| ·E * ·F t m eh t ·z ·G y uw ·-\n| ·G2 ·z2\n| ·B2 y uw ·B m ey ·B d ao l\n| ·A * ·A m ay ·_G * ·A dr iy\n| ·_G3/2 m z ·G2 k ah ·F/ m tr uw ·-\n| ·F2 * ·C ae ·D *\n| ·E * ·F n ·F/ ay ·G s ·E/ eh d t ·-\n| ·E * ·D uw m ay s eh l f dh ae t ·z ·E ay\n| ·A,/ w ·A,/ * ·C uh d ·z ·E n eh\n| ·_D v er s ·E2 t aa p d ae ·=D/ * ·F/ n s\n| ·z ·E/ ih ·E/ * ·E ng ·E *\n| ·z4 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/40_0f06d5001bff_verse_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/40_0f06d5001bff_verse_1/gt_melody_cut.wav",
        "duration": 13.8
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/40_0f06d5001bff_verse_1/gen_vocal.mp3",
              "duration": 13.9
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/40_0f06d5001bff_verse_1/gen_vocal.mp3",
              "duration": 12.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/40_0f06d5001bff_verse_1/gen_mixed.mp3",
              "duration": 12.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/40_0f06d5001bff_verse_1/gen_vocal.mp3",
              "duration": 23.6
            },
            "song": {
              "src": "LeVo2_1000samples/40_0f06d5001bff_verse_1/gen_song.mp3",
              "duration": 23.6
            }
          }
        }
      ]
    },
    {
      "id": "group-9",
      "title": {
        "zh": "样例 9",
        "en": "Group 9"
      },
      "sampleId": "41_614b6524d9c1_chorus_2",
      "lyrics": "[chorus] Break another little piece of my heart, darling, yeah, yeah, yeah, yeah.Wow, another little piece of my heart, baby, baby, baby.You know you gotta, if it makes you feel good, I want you to feel good now, yeah",
      "prompt": "[Musicality-very-high], female, adult, raspy, vibrato-moderate, southern us, powerful, solo, rock, english, fully sung, plate, delay-none, chest, mixed, belt, growl, distortion, vibrato, gritty, husky, energetic, tense.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_100_110>  <meter_4/4>  <key_G> \n| ·F/ * ·E/ r ·E/ t n aw ·E/ b ·E/ ey ·E/ * ·F b ·F2 iy ·z2\n| ·z3 ·A/ b r ·A/ ey k ·A/ * ·G/ ah n ah dh er ·G/ * ·G/ l ·G/ ih ·G/ * ·G/ dx ah l ·F/ p iy s ah\n| ·A * ·< ·A v m ay ·A/ hh aa r t d aa r l ih ng y ae ·A/ y ae ·d/ * ·d/ * ·A * ·A/ * ·B/ y ae ·A/ * ·F/ y ae ·E/ * ·D/ *\n| ·z2 ·c w aw ·> ·A * ·A/ ah n ah ·G/ * ·G/ * ·G/ dh er ·F/ l ih ·G/ * ·G/ dx ah ·G/ l p iy s ah\n| ·E2 v ·F/ m ay ·A/ * ·B/ hh aa ·F/ r t b ey ·F/ * ·F/ b iy b ey b ·E iy b ey ·D b iy ·< ·D *\n| ·z ·B y uw ·B n ow ·B/ y uw g ·B * ·G3/2 aa dx ah ·z/ ·G/ ih f ·B/ ih t ·A/ m\n| ·B ey k ·A s y uw ·G/ f iy ·G/ * ·A/ l g uh ·F/ d ·z ·G/ ay w ·^c/ aa ·d n t y uw t uw ·d/ f iy ·d/ *\n| ·e l g uh d n aw y ae ·d/ * ·c/ * ·B/ * ·^c * ·B/ * ·F2 * ·z2\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/41_614b6524d9c1_chorus_2/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/41_614b6524d9c1_chorus_2/gt_melody_cut.wav",
        "duration": 21.8
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/41_614b6524d9c1_chorus_2/gen_vocal.mp3",
              "duration": 19.6
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/41_614b6524d9c1_chorus_2/gen_vocal.mp3",
              "duration": 19.2
            },
            "song": {
              "src": "M6_1000samples_with_mixed/41_614b6524d9c1_chorus_2/gen_mixed.mp3",
              "duration": 19.2
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/41_614b6524d9c1_chorus_2/gen_vocal.mp3",
              "duration": 24.8
            },
            "song": {
              "src": "LeVo2_1000samples/41_614b6524d9c1_chorus_2/gen_song.mp3",
              "duration": 24.8
            }
          }
        }
      ]
    },
    {
      "id": "group-10",
      "title": {
        "zh": "样例 10",
        "en": "Group 10"
      },
      "sampleId": "53_9b09daed5c20_chorus_2",
      "lyrics": "[chorus] Love in any language, straight from the heart, pulls us all together, never apart.And once we learn to speak it, all the world will hear.Love in any language, fluently spoken here.Though the rhetoric of government may keep us worlds apart",
      "prompt": "[Musicality-very-high], female, adult, modal, vibrato-moderate, general american, highly-varied, solo, pop, english, fully sung, hall, delay-none, chest, mixed, head, belt, vibrato, powerful, clear, bright, triumphant, tender.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_60_70>  <meter_2/4>  <key_D> \n| ·F4\n| ·B, l ah ·E/ v ih ·E/ n eh n iy l ae ·F ng ·G/ g ·F/ w\n| ·E/ * ·E7/2 ah\n| ·B/ jh s tr ey ·A/ * ·A * ·E/ t f r ah ·C/ m dh ·C/ ah hh ·E/ aa ·-\n| ·E4\n| ·B r t p uh l z ah s ao ·B l t ·< ·B ah ·B/ g ·B/ eh\n| ·F/ dh ·F7/2 er\n| ·A2 n eh ·=G/ v er ah ·^G/ * ·E/ p ·B,/ aa ·-\n| ·B,7/2 * ·B,/ r t ae n\n| ·B, w ah n ·E s w iy l ·< ·F er n ·G/ t uw s ·F/ p iy\n| ·E/ * ·E7/2 k ih\n| ·A t ao l dh ah ·A w er l d w ·< ·E ih l ·C/ hh iy r ·F/ l ah v ih n ·-\n| ·F4\n| ·B eh n iy l ae ·B ng ·< ·B g ·B *\n| ·F/ w ·F7/2 *\n| ·A/ ah jh f l uw ·B/ ah n t l ·c/ iy s ·B/ p ow ·E k ·E ah\n| ·E2 n hh iy ·z ·B/ r dh ow ·B/ dh ah r\n| ·B/ eh ·A/ * ·A dx er ih k ·z/ ·=G/ ah ·F/ v g ·F/ ah\n| ·=G/ * ·F/ * ·F/ v er n m ·G/ ah n t ·z3/2 ·E/ m ey\n| ·=D k iy ·=G,/ p ah s w ·D/ er ·E l ·> ·E d z ah p aa r t ·-\n| ·E2 ·z2 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/53_9b09daed5c20_chorus_2/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/53_9b09daed5c20_chorus_2/gt_melody_cut.wav",
        "duration": 39.4
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/53_9b09daed5c20_chorus_2/gen_vocal.mp3",
              "duration": 35.6
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/53_9b09daed5c20_chorus_2/gen_vocal.mp3",
              "duration": 31.2
            },
            "song": {
              "src": "M6_1000samples_with_mixed/53_9b09daed5c20_chorus_2/gen_mixed.mp3",
              "duration": 31.2
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/53_9b09daed5c20_chorus_2/gen_vocal.mp3",
              "duration": 25.3
            },
            "song": {
              "src": "LeVo2_1000samples/53_9b09daed5c20_chorus_2/gen_song.mp3",
              "duration": 25.3
            }
          }
        }
      ]
    },
    {
      "id": "group-11",
      "title": {
        "zh": "样例 11",
        "en": "Group 11"
      },
      "sampleId": "54_896d60c13cae_chorus_1",
      "lyrics": "[chorus] Who said I had known this from the beginning? Find it hard to work out why we have our doubts.If I talk to you, you know I'm too going to break my heart too.'Cause I would anyway end up like always.Tell me if that is true, that you can see it in my face.'Cause you know we're the same.First things I can say",
      "prompt": "[Musicality-very-high], female, adult, breathy, light, general american, soft, solo, pop, english, fully sung, room, delay-none, chest, mixed, head, breath-adlib, glissando-scoop, airy, delicate, cool, melancholic, tender.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_170_180>  <meter_4/4>  <key_Bmin> \n| ·D * ·E uw ·F2 * ·z4\n| ·z2 ·d ih t hh uw s ·c eh ·c2 * ·B * ·F d ay hh ae\n| ·D d n ·E ow n dh ih s ·E/ * ·F7/2 * ·z2\n| ·z2 ·B3/2 f r ah m ·A2 dh ah ·- ·A/ * ·z ·E b ih g ih\n| ·D * ·> ·B, n ih ng ·z4 ·z ·A f ay ·-\n| ·A * ·G2 n d ih ·F2 t hh aa ·- ·F/ * ·D3/2 r d t uw w ·D er\n| ·D2 * ·E2 k aw t ·z3 ·A w ay ·-\n| ·A * ·G2 w iy ·F2 hh ae ·B2 * ·=F *\n| ·D * ·E v aw ·F3 er d aw ·=F t s ih f ay ·(3:2:2 ·^F2 * ·c * ·-\n| ·c * ·F2 t ao k t uw y uw y uw ·- ·F/ * ·E3/2 n ·F2 ow ay m ·c * ·-\n| ·c * ·F t uw ·E2 * ·E g ow ih ·F ng ·z ·d t uw ·-\n| ·d * ·c2 b r ·B ey k m ay hh aa ·A3 * ·F r t t uw ·-\n| ·F * ·D3/2 * ·E3/2 * ·z3 ·F/ k ah z ay ·F/ * ·-\n| ·F * ·G3/2 * ·G/ * ·A * ·- ·(3 ·A * ·A w ·D uh d eh ·- ·D * ·E *\n| ·E * ·F3 n iy w ey ·z3 ·F eh ·-\n| ·F * ·G2 n d ah p l ay ·A2 * ·E * ·D * ·E *\n| ·E k ao ·F3 l w ey z ·z3 ·B t eh\n| ·c l ·F m iy ·F ih f dh ·E ae ·E t ·F2 ih z ·F tr ·-\n| ·F * ·F2 uw dh ae t y uw ·E k ae ·E n s iy ih ·F2 t ih n m ay f ey s ·d k ah ·-\n| ·d3/2 ·c2 ·B3/2 ·A2 ·F\n| ·E * ·D * ·D4 z ·z3/2 ·F/ y uw ·-\n| ·F * ·G n ·G ow ·A2 w iy r dh ·D2 ah ·E s ey\n| ·F2 m ·z4 ·z3/2 ·F/ f er s ·-\n| ·F * ·> ·G t th ih ·G ng ·A z ay ·- ·(3 ·A * ·A k ·D ae ·- ·D * ·E n\n| ·E * ·F s ey ·z6 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/54_896d60c13cae_chorus_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/54_896d60c13cae_chorus_1/gt_melody_cut.wav",
        "duration": 34.4
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/54_896d60c13cae_chorus_1/gen_vocal.mp3",
              "duration": 33.0
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/54_896d60c13cae_chorus_1/gen_vocal.mp3",
              "duration": 31.5
            },
            "song": {
              "src": "M6_1000samples_with_mixed/54_896d60c13cae_chorus_1/gen_mixed.mp3",
              "duration": 31.5
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/54_896d60c13cae_chorus_1/gen_vocal.mp3",
              "duration": 29.8
            },
            "song": {
              "src": "LeVo2_1000samples/54_896d60c13cae_chorus_1/gen_song.mp3",
              "duration": 29.8
            }
          }
        }
      ]
    },
    {
      "id": "group-12",
      "title": {
        "zh": "样例 12",
        "en": "Group 12"
      },
      "sampleId": "56_631a55cf8bd7_verse_1",
      "lyrics": "[verse] The little chicks say, \"Cheap, cheap, cheap\" when they are chilly, when they sleep.Mother hen looks all day for wheat and corn.She gives them food and keeps them warm.Under her two wings, they will go to sleep until tomorrow without a peep",
      "prompt": "[Musicality-very-high], female, adult, modal, vibrato-none, general american, dynamics-moderate, solo, traditional, english, fully sung, room, delay-none, mixed, technique-none, sweet, clear, bright, happy, playful.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_100_110>  <meter_4/4>  <key_C> \n| ·z7 ·C dh ah\n| ·C l ih ·D dx ah ·E3/2 l ch ih k ·G2 s s ey ·- ·G/ * ·z2\n| ·A2 ch iy p ·c2 * ·G2 ch iy p ch iy p ·z2\n| ·F2 w eh ·G n dh ey ·F aa r ch ·E2 ih ·E l iy ·> ·D w eh ·-\n| ·D2 * ·E3/2 n dh ey ·C2 s l iy p ·- ·C/ * ·z2\n| ·C m ah ·D dh er hh ·E eh ·F n l uh k ·G2 s ao l ·G d ey ·G f ao r\n| ·A2 w iy t ·c2 ae ·G2 n k ao r n ·z ·E sh iy g\n| ·F2 ih ·G2 v z dh eh ·E * ·> ·^D * ·E2 *\n| ·D2 m f uw d ae n k iy p s ·E3/2 dh eh ·C2 m w ao r m ·- ·C/ * ·z2\n| ·C ah n ·D * ·E d ·F er hh er t uw ·G2 w ih ng z ·z2\n| ·A dh ey ·A w ih l ·c g ow ·c t uw s ·G2 l iy p ·z2\n| ·F2 ah n ·G * ·F t ih ·E2 l t ah m aa ·E2 r ow\n| ·D2 w ih th aw ·E * ·D t ·C2 ah p iy p ·e2 *\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/56_631a55cf8bd7_verse_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/56_631a55cf8bd7_verse_1/gt_melody_cut.wav",
        "duration": 33.6
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/56_631a55cf8bd7_verse_1/gen_vocal.mp3",
              "duration": 31.2
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/56_631a55cf8bd7_verse_1/gen_vocal.mp3",
              "duration": 28.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/56_631a55cf8bd7_verse_1/gen_mixed.mp3",
              "duration": 28.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/56_631a55cf8bd7_verse_1/gen_vocal.mp3",
              "duration": 22.6
            },
            "song": {
              "src": "LeVo2_1000samples/56_631a55cf8bd7_verse_1/gen_song.mp3",
              "duration": 22.6
            }
          }
        }
      ]
    },
    {
      "id": "group-13",
      "title": {
        "zh": "样例 13",
        "en": "Group 13"
      },
      "sampleId": "57_5575cf74e224_chorus_1",
      "lyrics": "[chorus] You know I'm good for waiting, but waiting's wasted time.Oh, and I I don't take it lightly the trouble that I've gone through to get you to know who I am",
      "prompt": "[Musicality-very-high], male, adult, modal, vibrato-moderate, general american, highly-varied, solo, pop, english, fully sung, hall, delay-none, chest, mixed, belt, vibrato, glissando-scoop, bright, powerful, clear, sad, tense.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_70_80>  <meter_4/4>  <key_C> \n| ·E,2 * ·z4 ·z ·G,, y uw n\n| ·E, ow ·G, ay ·G,3 m g uh d ·G,/ f ao r w ·G,/ * ·A,2 ey dx ih\n| ·E, * ·E, * ·< ·D, ng ·D, b ah ·C, t w ·D,2 ey ·D, * ·-\n| ·D, * ·< ·D, * ·C,7/2 s t ah ·C,2 d t ay m ·- ·C,/ * ·-\n| ·C,2 * ·z3 ·D2 ow ·B, * ·-\n| ·B, * ·C3 ae n ay ·z4\n| ·E/ ay ·E d ow ·^D/ n t t ey ·=D/ * ·C/ k ·C ih ·D t l ay ·> ·B, t ·A,2 l iy\n| ·z2 ·E dh ah tr ah ·C2 b ah l ·C2 dh ae ·B, t ay\n| ·A,2 v ·A,2 g ao ·- ·A,/ * ·G,3/2 n ·A,2 th r uw\n| ·z ·G, t uw g ·G, eh ·G,2 t y uw t uw n ·C2 ow ·- ·C/ * ·D/ hh uw ay ae m ·-\n| ·D6 ·z2\n| ·z4 ·z ·C ow ·< ·D * ·B,/ * ·B,/ * ·- <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/57_5575cf74e224_chorus_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/57_5575cf74e224_chorus_1/gt_melody_cut.wav",
        "duration": 21.7
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/57_5575cf74e224_chorus_1/gen_vocal.mp3",
              "duration": 22.4
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/57_5575cf74e224_chorus_1/gen_vocal.mp3",
              "duration": 22.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/57_5575cf74e224_chorus_1/gen_mixed.mp3",
              "duration": 22.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/57_5575cf74e224_chorus_1/gen_vocal.mp3",
              "duration": 23.6
            },
            "song": {
              "src": "LeVo2_1000samples/57_5575cf74e224_chorus_1/gen_song.mp3",
              "duration": 23.6
            }
          }
        }
      ]
    },
    {
      "id": "group-14",
      "title": {
        "zh": "样例 14",
        "en": "Group 14"
      },
      "sampleId": "60_1f3cb0da46e2_chorus_1",
      "lyrics": "[chorus] Look into darkness.Where he leads, wait and bleed.Hear his voice.You are close to die, eye to eye.He lives.The embodiment of death",
      "prompt": "[Musicality-very-high], male, adult, harsh, vibrato-none, general american, powerful, solo, metal, english, fully sung, room, delay-none, chest, mixed, head, belt, growl, distortion, gritty, dark, angry.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_170_180>  <meter_4/4>  <key_G> \n| ·z8 <keychange>  <key_G> \n| ·B8 l uh k ih\n| ·A7 * ·G/ * ·c/ n ·-\n| ·c3/2 * ·G4 t uw ·- ·G2 * ·- ·G/ * ·-\n| ·G2 * ·A7/2 d aa ·B2 r k n ah s w eh ·- ·B/ *\n| ·F r hh iy l ·E3 iy ·F4 *\n| ·G15/2 * ·G/ d z w ·-\n| ·G * ·G3 ey ·A2 t ae n ·- ·A/ * ·B3/2 b l iy ·-\n| ·B8\n| ·z ·B7 d hh iy r hh ih ·-\n| ·B ·d7 ·-\n| ·d * ·e7 z v oy s ·-\n| ·e * ·B4 y uw ·c3 *\n| ·d * ·B3 aa ·A3/2 r k l ow s t uw ·G3/2 d ·G ay ·-\n| ·G6 ·F2\n| ·z ·=F3 ay ·G3/2 t uw ·F2 ay hh iy ·- ·F/ * ·-\n| ·=F8 ·-\n| ·=F6 * ·^D, l ih v z dh ·< ·E, ah\n| ·^d3/2 eh ·G,, m b aa d iy m ah ·C,3/2 n t ah ·G,,4 v d eh th ·-\n| ·G,,6 ·z2 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/60_1f3cb0da46e2_chorus_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/60_1f3cb0da46e2_chorus_1/gt_melody_cut.wav",
        "duration": 27.5
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/60_1f3cb0da46e2_chorus_1/gen_vocal.mp3",
              "duration": 26.2
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/60_1f3cb0da46e2_chorus_1/gen_vocal.mp3",
              "duration": 22.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/60_1f3cb0da46e2_chorus_1/gen_mixed.mp3",
              "duration": 22.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/60_1f3cb0da46e2_chorus_1/gen_vocal.mp3",
              "duration": 28.2
            },
            "song": {
              "src": "LeVo2_1000samples/60_1f3cb0da46e2_chorus_1/gen_song.mp3",
              "duration": 28.2
            }
          }
        }
      ]
    },
    {
      "id": "group-15",
      "title": {
        "zh": "样例 15",
        "en": "Group 15"
      },
      "sampleId": "80_b5192639b9d5_verse_5",
      "lyrics": "[verse] Once a deity, once was a king.The sickness really makes me sick.The soulless frontal backbeat.Mortality's needed, just to ring.What the fuck ever happened to the true spirit of rock? They are raping the pureness, cheating playback, shock",
      "prompt": "[Musicality-very-high], male, adult, harsh, vibrato-none, general american, powerful, solo, metal, english, fully sung, room, delay-none, chest, belt, growl, distortion, gritty, angry, energetic.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_150_160>  <meter_4/4>  <key_G> \n| ·z4 ·z/ ·A w ·E, * ·A3/2 ah\n| ·B * ·A n s ah d iy ah t ·A iy w ah n ·B2 s ·G3 w aa z\n| ·G2 ah k ih ng ·z4 ·z ·G dh ah s\n| ·A ih ·G3/2 k n ah ·B2 s r ·C,3/2 ih l iy ·z/ ·d/ m ey ·c k s ·-\n| ·c * ·< ·^G m iy ·A4 s ih ·z ·=G k dh ah s\n| ·G ow ·G2 l l ah s ·c/ f r ah n t ah ·E, * ·A3/2 l ·A n iy dx ah d jh ah ·D, s t t uw r ih ng\n| ·A2 w ah t ·z4 ·z/ ·G3/2 dh ah f ah k\n| ·^G/ * ·A * ·=G * ·B/ eh ·A * ·F2 v er ·z2\n| ·z3 ·A4 hh ae ·- ·A *\n| ·z2 ·E2 * ·z ·G * ·G p ah ·> ·A n ·-\n| ·A * ·A3 d t uw dh ah ·z2 ·F tr uw ·=F *\n| ·f2 s p ih r ·z ·d ah t ·A,,/ * ·E ah v r ·^G,,3/2 * ·=G/ * ·E/ aa k ·-\n| ·E2 ·z6\n| ·g' dh ey aa ·=F r ·< ·d' * ·G,,/ r ·^F ey ·E3/2 * ·z ·G/ p ih ·B/ *\n| ·^G * ·=G ng ·G * ·B dh ah ·z4\n| ·(3:2:2 ·B2 ch iy ·B,, dx ih ng ·- ·B,, * ·c p l ·< ·A ey ·B2 b ae k ·d sh aa k ·-\n| ·d4 ·z4 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/80_b5192639b9d5_verse_5/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/80_b5192639b9d5_verse_5/gt_melody_cut.wav",
        "duration": 25.5
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/80_b5192639b9d5_verse_5/gen_vocal.mp3",
              "duration": 21.0
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/80_b5192639b9d5_verse_5/gen_vocal.mp3",
              "duration": 21.0
            },
            "song": {
              "src": "M6_1000samples_with_mixed/80_b5192639b9d5_verse_5/gen_mixed.mp3",
              "duration": 21.0
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/80_b5192639b9d5_verse_5/gen_vocal.mp3",
              "duration": 22.6
            },
            "song": {
              "src": "LeVo2_1000samples/80_b5192639b9d5_verse_5/gen_song.mp3",
              "duration": 22.6
            }
          }
        }
      ]
    },
    {
      "id": "group-16",
      "title": {
        "zh": "样例 16",
        "en": "Group 16"
      },
      "sampleId": "82_9fc7f7c45b11_chorus_5",
      "lyrics": "[chorus] Well, if it's all spinning round a ball, and if your world's feeling crowded and small, maybe you can be the big star in tonight's show",
      "prompt": "[Musicality-very-high], female, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, hall, present, mixed, technique-none, bright, thin, clear, dreamy, energetic.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_120_130>  <meter_4/4>  <key_Emin> \n| ·z4 ·z ·^A, b iy w eh l ·D2 ih f ih <keychange>  <key_Emin> \n| ·D2 t s ao l s p ih n ih ng r aw ·D2 n d ah b ao l ae ·D3 * ·E n ih f y ao ·-\n| ·E4 * ·- ·E * ·A, r w er ·D * ·> ·A, *\n| ·D2 * ·D2 l d z f iy l ih ng k r aw dx ah d ae ·D3 * ·B, n s m ao l ·-\n| ·B,4 ·z4\n| ·D2 m ey ·D b iy y uw ·D k ae ·D2 * ·B,2 n b iy dh ah b ih g s\n| ·B,4 t aa ·B,2 r ih n t ah n ·B,2 ay t s sh ow ·-\n| ·B,2 ·z6 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/82_9fc7f7c45b11_chorus_5/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/82_9fc7f7c45b11_chorus_5/gt_melody_cut.wav",
        "duration": 15.8
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/82_9fc7f7c45b11_chorus_5/gen_vocal.mp3",
              "duration": 13.8
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/82_9fc7f7c45b11_chorus_5/gen_vocal.mp3",
              "duration": 15.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/82_9fc7f7c45b11_chorus_5/gen_mixed.mp3",
              "duration": 15.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/82_9fc7f7c45b11_chorus_5/gen_vocal.mp3",
              "duration": 31.1
            },
            "song": {
              "src": "LeVo2_1000samples/82_9fc7f7c45b11_chorus_5/gen_song.mp3",
              "duration": 31.1
            }
          }
        }
      ]
    },
    {
      "id": "group-17",
      "title": {
        "zh": "样例 17",
        "en": "Group 17"
      },
      "sampleId": "90_0fb9afd8227c_verse_5",
      "lyrics": "[verse] Dead president's corpse in the driver's car.The engine runs on glue and tar.Come on along, not going very far.To the east to meet the Tsar",
      "prompt": "[Musicality-very-high], male, adult, modal, light, general american, dynamics-moderate, solo, rock, english, fully sung, plate, delay-none, chest, technique-none, warm, gritty, powerful, tense, energetic.",
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_120_130>  <meter_4/4>  <key_F> \n| ·z6 ·=F2 eh\n| ·E d p r eh ·=F * ·E2 * ·F2 z ih d ah n t s k ao r p ·E s ih ·D n dh ah dr\n| ·E ay ·E2 v er z ·E3 k aa r ·z ·E dh ah eh\n| ·=F * ·E * ·E * ·D n ·E jh ah n ·E r ah n z ·E aa ·^D n\n| ·E g l uw ·E ae ·E n t ·E3 aa r k ah m ·z2\n| ·z ·G aa ·G * ·G n ·E2 ah l ao ·E2 ng\n| ·E n aa ·D t g ow ih ng v ·E eh ·D r iy ·E f aa ·E3 r\n| ·z ·E t ·(3:2:2 ·E2 * ·E uw dh ah iy s ·- ·E2 * ·z ·E t t uw m\n| ·E2 iy t ·E dh ah ·E z aa ·E * ·=F r ·z2 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/90_0fb9afd8227c_verse_5/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/90_0fb9afd8227c_verse_5/gt_melody_cut.wav",
        "duration": 18.2
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/90_0fb9afd8227c_verse_5/gen_vocal.mp3",
              "duration": 18.4
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/90_0fb9afd8227c_verse_5/gen_vocal.mp3",
              "duration": 18.8
            },
            "song": {
              "src": "M6_1000samples_with_mixed/90_0fb9afd8227c_verse_5/gen_mixed.mp3",
              "duration": 18.8
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/90_0fb9afd8227c_verse_5/gen_vocal.mp3",
              "duration": 30.6
            },
            "song": {
              "src": "LeVo2_1000samples/90_0fb9afd8227c_verse_5/gen_song.mp3",
              "duration": 30.6
            }
          }
        }
      ]
    },
    {
      "id": "group-18",
      "title": {
        "zh": "样例 18",
        "en": "Group 18"
      },
      "sampleId": "96_6f3a48e796cc_chorus_2",
      "lyrics": "[chorus] I'm gonna take a tranquilizer and just another tranquilizer.I lost my mind, I lost my voice because I'm hypnotized by too much choice",
      "prompt": "[Musicality-very-high], male, adult, modal, light, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, vibrato, breath-adlib, husky, mellow, clear, melancholic, sad.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_110_120>  <meter_4/4>  <key_Emin>  <keychange>  <key_E> \n| ·z3 ·G, ay m ·G,2 g aa ·G, n ah t ey ·A,/ k ah tr ·=G,/ ae ·-\n| ·=G,2 * ·^G, ng k w ah l ·F, ay ·E,/ * ·E, * ·E,/ z ·E, er ·> ·E, * ·-\n| ·E,2 * ·z/ ·F,3/2 ae n ·G, jh ah s t ah n ah dh er tr ae ·G, * ·G,/ * ·G, * ·G,/ ng ·-\n| ·G,3/2 * ·A,3/2 k w ah ·F, l ay ·E,3/2 * ·F,3/2 z er ·E, *\n| ·z/ ·=D, ay ·F,3/2 l ao s ·^D, t m ·F, ay ·=D, m ay n d ·z ·F, ay\n| ·F, l ao s ·=G,2 t m ay ·=D,2 v oy ·B,, s b ih k ·D, ao ·B,, z ay m\n| ·z2 ·=G, hh ih p ·G, n ah t ay ·G,3/2 * ·^G, z d b ay ·A,3/2 t uw ·-\n| ·A,/ * ·G,2 m ·- ·G,/ * ·E, ah ch ch oy ·=D,2 s t ey k ah l uh k ae t ah s t ey k ah n ah dh er l uh k ae t ah s ·z2 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/96_6f3a48e796cc_chorus_2/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/96_6f3a48e796cc_chorus_2/gt_melody_cut.wav",
        "duration": 17.2
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/96_6f3a48e796cc_chorus_2/gen_vocal.mp3",
              "duration": 19.3
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/96_6f3a48e796cc_chorus_2/gen_vocal.mp3",
              "duration": 19.3
            },
            "song": {
              "src": "M6_1000samples_with_mixed/96_6f3a48e796cc_chorus_2/gen_mixed.mp3",
              "duration": 19.3
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/96_6f3a48e796cc_chorus_2/gen_vocal.mp3",
              "duration": 29.9
            },
            "song": {
              "src": "LeVo2_1000samples/96_6f3a48e796cc_chorus_2/gen_song.mp3",
              "duration": 29.9
            }
          }
        }
      ]
    },
    {
      "id": "group-19",
      "title": {
        "zh": "样例 19",
        "en": "Group 19"
      },
      "sampleId": "96_c36c0b6d0172_chorus_3",
      "lyrics": "[chorus] Safe travels, don't die, don't die.Safe travels, don't die, don't die.Safe travels, don't die, don't die",
      "prompt": "[Musicality-very-high], male, adult, breathy, vibrato-moderate, received pronunciation (british rp), soft, solo, pop, english, fully sung, room, delay-none, chest, mixed, falsetto, glissando-scoop, vibrato, breath-adlib, airy, delicate, tender, calm.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_100_110>  <meter_3/4>  <key_G> \n| ·c2 ·z4\n| ·B2 s ey ·A/ f tr ae ·G * ·G3/2 * ·G *\n| ·E ·D4 ·- ·D\n| ·E2 v ·G ah ·c * ·d2 *\n| ·(3 ·e * ·B l ·B z d ow n t d ay d ow ·- ·B * ·< ·A n t d ay ·z2\n| ·B2 s ey f ·A/ tr ae ·G v ah ·G/ * ·E * ·E *\n| ·D * ·D3/2 * ·B,7/2 l\n| ·E2 z d ow ·G n ·d3 t d\n| ·c ay ·B d ow ·A2 n t d ay ·z2\n| ·A s ey f tr ae v ah ·< ·B * ·A l ·G * ·z ·G z d ow\n| ·=F n ·D3 t d ay ·z2\n| ·E d ow n ·E t ·G d ·G/ * ·d2 ay ·- ·d/ *\n| ·B3/2 ·B4 ·- ·B/ ·- <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/96_c36c0b6d0172_chorus_3/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/96_c36c0b6d0172_chorus_3/gt_melody_cut.wav",
        "duration": 21.3
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/96_c36c0b6d0172_chorus_3/gen_vocal.mp3",
              "duration": 17.9
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/96_c36c0b6d0172_chorus_3/gen_vocal.mp3",
              "duration": 21.4
            },
            "song": {
              "src": "M6_1000samples_with_mixed/96_c36c0b6d0172_chorus_3/gen_mixed.mp3",
              "duration": 21.4
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/96_c36c0b6d0172_chorus_3/gen_vocal.mp3",
              "duration": 31.5
            },
            "song": {
              "src": "LeVo2_1000samples/96_c36c0b6d0172_chorus_3/gen_song.mp3",
              "duration": 31.5
            }
          }
        }
      ]
    },
    {
      "id": "group-20",
      "title": {
        "zh": "样例 20",
        "en": "Group 20"
      },
      "sampleId": "100_3b8c3834c86b_chorus_2",
      "lyrics": "[chorus] I'll be drinking crooked whiskey and sometimes lemon drops.I'll be wearing diamond grills and Louis Vuittons a lot.Sometimes I can be extreme, I'm never gonna stop.Keep this party going, we'll be dancing till we drop",
      "prompt": "[Musicality-very-high], female, adult, modal, light, general american, dynamics-moderate, solo, pop, english, fully sung, plate, present, chest, mixed, head, melisma, vibrato, bright, thin, clear, playful, energetic.",
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_140_150>  <meter_2/4>  <key_D> \n| ·z4\n| ·(3 ·A ay ·A l b iy ·A dr ·A ih ng k ih ng k r uh k ah ·> ·A d w ih s k iy ae ·-\n| ·A/ * ·A * ·A/ * ·A n s ah ·G m\n| ·G t ay m ·=F z l eh m ah n ·F/ * ·G * ·A/ dr aa p s\n| ·z4\n| ·A ay ·A l b iy w eh ·(3 ·A r ih ng d ay ·A * ·A *\n| ·A m ah ·> ·A n d g r ih l z ae ·A n ·G l uw ih\n| ·G/ * ·=F s ah l ·F3/2 aa t s ah m t ay m ·G z ay\n| ·A2 ·z2\n| ·A, k ·A, ae ·A, n ·A/ * ·A/ b iy\n| ·A3/2 ih k ·A3/2 s tr iy ·G m ay m\n| ·G/ n eh ·=F v er g ·F3/2 aa ·G n ah s\n| ·A2 t aa p k iy p ·z2\n| ·z ·A * ·A dh ih s ·A/ p ·A/ *\n| ·A aa ·> ·A r t iy g ow ih ·A ng w iy l b ·> ·G iy\n| ·G d ae ·=F n s ih ng ·F t ih ·G/ l w iy ·D/ dr aa p\n| ·z4 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/100_3b8c3834c86b_chorus_2/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/100_3b8c3834c86b_chorus_2/gt_melody_cut.wav",
        "duration": 14.1
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/100_3b8c3834c86b_chorus_2/gen_vocal.mp3",
              "duration": 14.1
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/100_3b8c3834c86b_chorus_2/gen_vocal.mp3",
              "duration": 15.0
            },
            "song": {
              "src": "M6_1000samples_with_mixed/100_3b8c3834c86b_chorus_2/gen_mixed.mp3",
              "duration": 15.0
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/100_3b8c3834c86b_chorus_2/gen_vocal.mp3",
              "duration": 18.8
            },
            "song": {
              "src": "LeVo2_1000samples/100_3b8c3834c86b_chorus_2/gen_song.mp3",
              "duration": 18.8
            }
          }
        }
      ]
    },
    {
      "id": "group-21",
      "title": {
        "zh": "样例 21",
        "en": "Group 21"
      },
      "sampleId": "105_15361b90cec5_bridge_1",
      "lyrics": "[bridge] I'm not okay, so go ahead and tell me another lie.Goes around, comes around, just to fuck me over one more time.So what? Impressive, I left it be a meaningless step.Pulling carbon, holding my head, and shit is real as it gets.Hallucinating, so sedated, all for the time to fight.I really do not give up, ready for hell.Call for the ring, but tell them all of my meetings be with my demons after Alpha Omega.I'm on the front line.A couple pills in my system now, I'm behind.Jumping back to love, baby, you know I'm not fine.Alpha Omega, baby, we don't die.Alpha Omega, baby, we don't die",
      "prompt": "[Musicality-very-high], male, adult, raspy, vibrato-none, general american, powerful, solo, rock, english, rhythmic speech, plate, delay-none, chest, mixed, belt, distortion, gritty, metallic, angry, tense.",
      "leadSheet": "<bos>  <sec_bos>  [bridge]  <tempo_90_100>  <meter_4/4>  <key_Eb> \n| ·z8\n| ·z2 ·(3 ·z ·B, ay m n aa t ow k ey s ow g ow ah hh eh d ae ·=G, * ·(3 ·A, * ·G, * ·A, * ·(3:2:2 ·A, * ·A,2 *\n| ·A,/ n t ·A, eh ·A,/ l m iy ah ·A, * ·A, n ah dh er l ay ·B, * ·A,/ g ow z er ·=G,/ aw ·B, n d k ah ·B,/ * ·G,/ *\n| ·A,/ m z ·A,/ er aw n d jh ah s t t ·B,/ uw f ah k m ·A, iy ·A, ow v er w ah n m ao ·A,/ r t ay ·B,/ * ·A, * ·=C/ m s ow ·=D/ w ah t ·C/ ih m p r ·D/ eh ·D/ s ih v\n| ·=C ay ·D l eh ·D * ·=D * ·C * ·_D f t ih t b iy ah m iy ·D n ih ·=D ng l ah\n| ·E s s t eh ·> ·=E p p uh l ·=D * ·D * ·D ih ng k aa ·> ·D r b ah n hh ow l d ih ·_D ng m ay ·=D hh\n| ·(3 ·=D eh ·E * ·D d ae n sh ih ·E t ih z r ·E iy l ae z ih t ·F g eh ·E t s ·z2\n| ·F/ hh ah ·=C/ * ·E l ·E/ * ·=D/ uw s ah n ey ·E * ·E t ih ng s ow s ih ·E/ * ·E/ d ey ·D * ·D dx ih d ao\n| ·E/ l f ao ·=D/ r ·B, * ·z3 ·F dh ah t ay ·F * ·G m t uw f ay\n| ·=D/ * ·E t ay ·E/ r ih ·E/ l ·G/ iy d uw n ·F aa ·G t g ih ·< ·G v ah p ·z3/2 ·F/ r eh ·-\n| ·F * ·G d iy ·< ·G f ao r hh eh ·F * ·=E/ l k ·E ao ·=G/ l f ao ·F * ·F/ r dh ah r ih ·_E/ ng\n| ·E/ * ·G/ * ·G b ah t ·z/ ·A, * ·F/ t eh ·G/ * ·G/ l dh eh m ao l ah v m ay ·=G m iy ·G/ dx ih ng ·F/ z b iy w ih dh ·F/ m ·F/ ay d\n| ·(3 ·=G iy ·_G m ah n ·G z ae f t er ae l f ah ·A ow m eh g ·< ·F ah ·z2 ·z/ ·=D ay ·E/ * ·-\n| ·E * ·E/ * ·E/ m aa ·- ·(3 ·E * ·E * ·=D n dh ah ·D3 f r ·=C ah n\n| ·E t l ay n ·=D ah k ah p ah l p ih ·(3:2:2 ·E2 l z ih n ·E m ay ·E * ·E s ih s t ah ·E m n aw ·E * ·-\n| ·E * ·< ·=D * ·E * ·D3/2 ay ·_D3/2 * ·=G m b ih hh ay n d jh ah ·_G *\n| ·(3 ·=G m p ih ·G ng ·G b ·(3 ·_G * ·G ae ·=G * ·G3/2 * ·G * ·G3/2 k t uw l ah v b ey b iy y uw n ow ay m n aa\n| ·F t f ay ·G n ae ·F l ·> ·G f ah ow m eh ·G/ g ah b ·G/ ey ·=G/ b iy w iy ·G/ d ·G ow n ·G *\n| ·F * ·G t ·G/ * ·B d ay ·F/ ae ·G/ l f ah ow m ·G/ eh ·=G/ g ah b ey ·G/ b iy w iy d ow n ·G t d ay ·G *\n| ·z8 <eos>",
      "referenceAudio": {
        "src": "M6_1000samples/105_15361b90cec5_bridge_1/prompt_vocal.mp3",
        "duration": 10.0
      },
      "melodyGroundTruth": {
        "src": "M6_1000samples/105_15361b90cec5_bridge_1/gt_melody_cut.wav",
        "duration": 37.1
      },
      "systems": [
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 只输出 vocal",
            "en": "with lead-sheet and reference timbre · vocal only"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples/105_15361b90cec5_bridge_1/gen_vocal.mp3",
              "duration": 34.6
            },
            "song": null
          }
        },
        {
          "model": "M6",
          "note": {
            "zh": "有 lead-sheet 条件和参考音色 · 输出 vocal 与 song",
            "en": "with lead-sheet and reference timbre · vocal + song"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_mixed/105_15361b90cec5_bridge_1/gen_vocal.mp3",
              "duration": 41.7
            },
            "song": {
              "src": "M6_1000samples_with_mixed/105_15361b90cec5_bridge_1/gen_mixed.mp3",
              "duration": 41.7
            }
          }
        },
        {
          "model": "LeVo2",
          "note": {
            "zh": "无 lead-sheet 条件",
            "en": "without lead-sheet conditioning"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "LeVo2_1000samples/105_15361b90cec5_bridge_1/gen_vocal.mp3",
              "duration": 30.8
            },
            "song": {
              "src": "LeVo2_1000samples/105_15361b90cec5_bridge_1/gen_song.mp3",
              "duration": 30.8
            }
          }
        }
      ]
    }
  ]
};

window.DEMO_DATA.groups.forEach(function (group) {
  var root = 'M6_1000samples/' + group.sampleId + '/';
  var duration = group.melodyGroundTruth ? group.melodyGroundTruth.duration : undefined;
  group.recordingGroundTruth = {
    vocal: { src: root + 'gt_vocal.mp3', duration: duration },
    song: { src: root + 'gt_mixed.mp3', duration: duration }
  };
});

window.PROMPT_DEMO_DATA = {
  "columns": [
    {
      "key": "vocal",
      "label": {
        "zh": "纯人声",
        "en": "Vocal"
      }
    },
    {
      "key": "song",
      "label": {
        "zh": "带伴奏",
        "en": "Song"
      }
    }
  ],
  "groups": [
    {
      "id": "prompt-group-1",
      "title": {
        "zh": "样例 1",
        "en": "Group 1"
      },
      "sampleId": "27_970e62901597_verse_3",
      "lyrics": "[verse] This could be the final moment you have left.Say what's on your mind with your last breath.And even when you crack, you don't need to react",
      "prompts": [
        {
          "label": {
            "zh": "提示词 1",
            "en": "Prompts 1"
          },
          "value": "[Musicality-very-high], male, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, technique-none, warm, smooth, dark, tense."
        },
        {
          "label": {
            "zh": "提示词 2",
            "en": "Prompts 2"
          },
          "value": "[Musicality-very-high], female, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, plate, present, chest, mixed, technique-none, clear, bright, smooth, energetic, romantic."
        }
      ],
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_110_120>  <meter_2/4>  <key_C#min> \n| ·z4\n| ·A,, dh ih s ·B,, k uh d b ·C, iy ·F, dh ah f ay\n| ·E,2 n ·C, ah l m ow ·G,, m ah n\n| ·B,,/ t y uw ·B,, * ·B,, hh ae v l ·C,3/2 eh f t\n| ·z4\n| ·C, s ey w ·C, ah t s ·C, aa n ·F, y ao r m\n| ·E,2 ay ·C, n d w ih dh y ·G,, ao\n| ·B,,2 r l ae s ·B,, t b r eh ·C, th ·-\n| ·C,2 ·z2\n| ·A, ae ·F, n iy v ih n w eh n y uw k r ae k ·G, y ·F, uw d\n| ·G,2 ow n ·G, t ·F,/ n iy ·G,/ d ·-\n| ·G, * ·F, t uw ·G,2 r\n| ·G,2 iy ae ·z2 <eos>",
      "systems": [
        {
          "model": "M6 · Prompts 1",
          "note": {
            "zh": "原始提示词 · 使用参考音频",
            "en": "original prompts · with reference audio"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_raw_prompts/27_970e62901597_verse_3/gen_vocal.mp3",
              "duration": 13.4
            },
            "song": null
          }
        },
        {
          "model": "M6 · Prompts 2",
          "note": {
            "zh": "替换提示词 · 不使用参考音频",
            "en": "replaced prompts · no reference audio"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_other_prompts/27_970e62901597_verse_3/gen_vocal.mp3",
              "duration": 13.6
            },
            "song": {
              "src": "M6_1000samples_with_other_prompts/27_970e62901597_verse_3/gen_mixed.mp3",
              "duration": 13.6
            }
          }
        }
      ]
    },
    {
      "id": "prompt-group-2",
      "title": {
        "zh": "样例 2",
        "en": "Group 2"
      },
      "sampleId": "64_eefb7a15ea1c_verse_2",
      "lyrics": "[verse] Severed heart, my mistake.I will wait forever.I don't know if I'm awake or if I'm undercover",
      "prompts": [
        {
          "label": {
            "zh": "提示词 1",
            "en": "Prompts 1"
          },
          "value": "[Musicality-very-high], male, adult, modal, vibrato-none, general american, dynamics-moderate, solo, pop, english, fully sung, hall, delay-none, chest, technique-none, smooth, clear, mellow, melancholic, calm."
        },
        {
          "label": {
            "zh": "提示词 2",
            "en": "Prompts 2"
          },
          "value": "[Musicality-very-high], male, adult, breathy, vibrato-moderate, african american vernacular (aave), dynamics-moderate, solo, r&b, english, fully sung, plate, present, chest, mixed, falsetto, melisma, riffs-runs, breath-adlib, husky, airy, smooth, melancholic, tender."
        }
      ],
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_190_200>  <meter_4/4>  <key_Dmin> \n| ·z6 ·F,2 s eh ·-\n| ·F,/ * ·G,3 * ·G,4 v er d hh aa ·- ·G,/ * ·-\n| ·G, * ·F,2 r t ·G,2 m ay ·- ·G,/ * ·F,2 m ih s ·- ·F,/ *\n| ·F,3/2 t ey ·G,4 k ay w ih ·- ·G,/ * ·z2\n| ·z ·F,3 l w ·G,3 ey ·F, t ·-\n| ·F,2 * ·(3:2:2 ·E,2 f er eh ·E, v ·- ·E, * ·D,3 er ·-\n| ·D,6 ·z2\n| ·A,2 ay ·G,2 d ow n ·G,4 t n ow ·-\n| ·G,3/2 * ·F, ih f ay m ·G,3/2 ah ·F,3 w ·G, ey ·-\n| ·G,4 * ·F, k ·=B,2 ao r ih f ay m ·F, ah ·-\n| ·F,3/2 * ·G,2 n ·- ·G,/ * ·F,3 d er ·E, k ah ·-\n| ·E, * ·D,7 v er\n| ·z8 <eos>",
      "systems": [
        {
          "model": "M6 · Prompts 1",
          "note": {
            "zh": "原始提示词 · 使用参考音频",
            "en": "original prompts · with reference audio"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_raw_prompts/64_eefb7a15ea1c_verse_2/gen_vocal.mp3",
              "duration": 16.2
            },
            "song": null
          }
        },
        {
          "model": "M6 · Prompts 2",
          "note": {
            "zh": "替换提示词 · 不使用参考音频",
            "en": "replaced prompts · no reference audio"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_other_prompts/64_eefb7a15ea1c_verse_2/gen_vocal.mp3",
              "duration": 20.4
            },
            "song": {
              "src": "M6_1000samples_with_other_prompts/64_eefb7a15ea1c_verse_2/gen_mixed.mp3",
              "duration": 20.4
            }
          }
        }
      ]
    },
    {
      "id": "prompt-group-3",
      "title": {
        "zh": "样例 3",
        "en": "Group 3"
      },
      "sampleId": "82_52a558a32aaa_verse_2",
      "lyrics": "[verse] Thousand shall fall at thy side, and ten thousand at thy right hand.But it shall not come nigh thee.Only when thy night shall thou behold and see the reward of the wicked",
      "prompts": [
        {
          "label": {
            "zh": "提示词 1",
            "en": "Prompts 1"
          },
          "value": "[Musicality-very-high], male, adult, growl, vibrato-none, general american, powerful, solo, metal, english, rhythmic speech, room, delay-none, chest, distortion, vocal-fry, gritty, dark, angry."
        },
        {
          "label": {
            "zh": "提示词 2",
            "en": "Prompts 2"
          },
          "value": "[Musicality-very-high], male, adult, modal, light, general american, dynamics-moderate, solo, pop, english, fully sung, room, delay-none, chest, mixed, falsetto, melisma, glissando-scoop, vibrato, smooth, warm, clear, tender, romantic."
        }
      ],
      "leadSheet": "<bos>  <sec_bos>  [verse]  <tempo_ge200>  <meter_6/8>  <key_Bbmin> \n| ·z6\n| ·z3/4 ·E, th aw ·- ·E,/4 * ·B,,3/4 z ah n d ·C, sh ae l ·- ·C,/4 * ·A,, f ao l ·z/4 ·F,3/4 ae\n| ·G,, t dh ay s ay ·z ·C,3/4 * ·E, d ae n t ·E,3/4 eh n th aw ·D,/ z ah n d ·z\n| ·E,3/4 ae t ·=G,, dh ay ·E, r ay ·A,, t hh ae n d ·- ·A,,/4 * ·z3/4 ·D,/4 b ah t ih ·E,/ t sh ·D,/ ae l n ·-\n| ·D,/4 * ·E,7/4 aa t ·E, k ·E, ah m n ay dh iy ·z2\n| ·=G,3/4 ow n l ·=G,, iy w eh n ·- ·G,,/4 * ·z3/4 ·_G,,3/4 dh ay ·F,,3/4 * ·B,, n ay ·A,,3/4 t sh ae ·-\n| ·A,,/ * ·< ·G,,/ l dh ·G,3/4 aw b ih ·A, hh ow l d ·- ·A,/4 * ·z ·z/4 ·E, ae n s ·C,3/4 iy dh ah ·-\n| ·C, * ·B, r ·=E, ih w ao r d ah v ·z3/2 ·F,,3/2 dh ah w ih k ah d\n| ·z6 <eos>",
      "systems": [
        {
          "model": "M6 · Prompts 1",
          "note": {
            "zh": "原始提示词 · 使用参考音频",
            "en": "original prompts · with reference audio"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_raw_prompts/82_52a558a32aaa_verse_2/gen_vocal.mp3",
              "duration": 15.8
            },
            "song": null
          }
        },
        {
          "model": "M6 · Prompts 2",
          "note": {
            "zh": "替换提示词 · 不使用参考音频",
            "en": "replaced prompts · no reference audio"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_other_prompts/82_52a558a32aaa_verse_2/gen_vocal.mp3",
              "duration": 14.4
            },
            "song": {
              "src": "M6_1000samples_with_other_prompts/82_52a558a32aaa_verse_2/gen_mixed.mp3",
              "duration": 14.4
            }
          }
        }
      ]
    },
    {
      "id": "prompt-group-4",
      "title": {
        "zh": "样例 4",
        "en": "Group 4"
      },
      "sampleId": "92_ea76abe2f1d5_chorus_3",
      "lyrics": "[chorus] Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light? Kim Do I dot? Kim Do I blue light?",
      "prompts": [
        {
          "label": {
            "zh": "提示词 1",
            "en": "Prompts 1"
          },
          "value": "[Musicality-very-high], female, adult, modal, vibrato-moderate, general american, dynamics-moderate, solo, r&b, english, fully sung, room, delay-none, chest, mixed, vibrato, melisma, smooth, warm, clear, tender, calm."
        },
        {
          "label": {
            "zh": "提示词 2",
            "en": "Prompts 2"
          },
          "value": "[Musicality-very-high], female, adult, breathy, vibrato-none, general american, soft, solo, pop, english, fully sung, room, delay-none, chest, mixed, vocal-fry, breath-adlib, airy, cool, dark, mysterious."
        }
      ],
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_110_120>  <meter_4/4>  <key_Fmin> \n| ·z8\n| ·z ·A, * ·C k ih ·B, m d uw ·z ·A, ay ·z2\n| ·z ·A, * ·B,/ d aa t k ih ·C/ m ·B, d uw ay ·z ·F, b l uw ·z ·A, l ay\n| ·z ·A, t k ih m ·B,/ d uw ·C/ ay ·B, * ·z ·A, d aa t ·z2\n| ·z ·A, k ih m d ·C uw ay ·B, * ·z ·F,/ b l uw ·F,/ * ·z ·A,/ l ay ·A,/ t\n| ·z ·A,/ k ih ·A,/ m d ·C/ uw ay ·C/ * ·B, * ·z ·A, d aa t ·z2\n| ·z ·A, k ih ·C m d uw ay ·B, * ·z ·F, b l uw ·z ·A, l ay t\n| ·z ·A, k ih ·B,/ m d uw ay ·C/ * ·B, * ·z ·A, d aa t ·z2\n| ·z ·A, k ih m ·B,/ d uw ay ·C/ * ·B,2 * ·F, b l uw ·z ·A, l ay t\n| ·z8 <eos>",
      "systems": [
        {
          "model": "M6 · Prompts 1",
          "note": {
            "zh": "原始提示词 · 使用参考音频",
            "en": "original prompts · with reference audio"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_raw_prompts/92_ea76abe2f1d5_chorus_3/gen_vocal.mp3",
              "duration": 20.9
            },
            "song": null
          }
        },
        {
          "model": "M6 · Prompts 2",
          "note": {
            "zh": "替换提示词 · 不使用参考音频",
            "en": "replaced prompts · no reference audio"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_other_prompts/92_ea76abe2f1d5_chorus_3/gen_vocal.mp3",
              "duration": 18.5
            },
            "song": {
              "src": "M6_1000samples_with_other_prompts/92_ea76abe2f1d5_chorus_3/gen_mixed.mp3",
              "duration": 18.5
            }
          }
        }
      ]
    },
    {
      "id": "prompt-group-5",
      "title": {
        "zh": "样例 5",
        "en": "Group 5"
      },
      "sampleId": "97_4b80f4b0bf1d_chorus_2",
      "lyrics": "[chorus] Kaback, blood and distortion.Kaback, blood and distortion",
      "prompts": [
        {
          "label": {
            "zh": "提示词 1",
            "en": "Prompts 1"
          },
          "value": "[Musicality-very-high], male, adult, harsh, vibrato-none, accent-none, powerful, solo, metal, english, rhythmic speech, room, delay-none, chest, growl, distortion, gritty, angry, dark."
        },
        {
          "label": {
            "zh": "提示词 2",
            "en": "Prompts 2"
          },
          "value": "[Musicality-very-high], male, adult, raspy, heavy, african american vernacular (aave), highly-varied, solo, gospel, english, fully sung, hall, present, chest, falsetto, belt, vibrato, melisma, husky, gritty, powerful, melancholic, tender."
        }
      ],
      "leadSheet": "<bos>  <sec_bos>  [chorus]  <tempo_150_160>  <meter_2/4>  <key_Bbmin> \n| ·z4 <keychange>  <key_Bbmin> \n| ·E,, b l ah ·A,, d ae ·D,,2 n\n| ·A,,3/2 d ih ·A,,3/2 s t ·B,, ao r sh\n| ·B,, ah ·A,,3 n\n| ·z4\n| ·z ·B,, b ·B,,2 l ah\n| ·z2 ·A,, d ae ·G,, * ·-\n| ·G,, * ·=G,, n d ih s ·A,, t ao ·F,, r sh ah n ·-\n| ·F,,2 ·z2\n| ·z4 <eos>",
      "systems": [
        {
          "model": "M6 · Prompts 1",
          "note": {
            "zh": "原始提示词 · 使用参考音频",
            "en": "original prompts · with reference audio"
          },
          "variant": "ours",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_raw_prompts/97_4b80f4b0bf1d_chorus_2/gen_vocal.mp3",
              "duration": 7.5
            },
            "song": null
          }
        },
        {
          "model": "M6 · Prompts 2",
          "note": {
            "zh": "替换提示词 · 不使用参考音频",
            "en": "replaced prompts · no reference audio"
          },
          "variant": "baseline",
          "tracks": {
            "vocal": {
              "src": "M6_1000samples_with_other_prompts/97_4b80f4b0bf1d_chorus_2/gen_vocal.mp3",
              "duration": 7.1
            },
            "song": {
              "src": "M6_1000samples_with_other_prompts/97_4b80f4b0bf1d_chorus_2/gen_mixed.mp3",
              "duration": 7.1
            }
          }
        }
      ]
    }
  ]
};
