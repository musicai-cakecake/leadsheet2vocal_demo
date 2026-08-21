# 领谱生成歌声音乐演示 / Lead Sheet & Prompts to Song Generation — DEMO

静态演示网页，用于展示 LeadSheet2Song（M6）与对照模型 LeVo2 的生成结果。
A static demo page presenting generated audio from LeadSheet2Song (M6) and the LeVo2 baseline.

内容来源于 `text.md`。 / Page content is derived from `text.md`.

## 功能 / Features

- 中文 / English / 双语三种显示模式，选择会被记住
- 浅色 / 深色主题，跟随系统偏好并可手动切换
- 内联 MP3 播放器：进度拖动、时间显示、同一时刻只播放一条音轨
- 每条音轨可单独下载，也可一键下载整组音频（下载文件名带样例与模型信息，避免重名）
- 领谱（lead sheet）按小节换行显示，可一键复制原文
- 响应式布局，手机上对比表自动改为堆叠卡片

## 本地预览 / Local preview

音频需要通过 HTTP 提供，直接双击打开 `index.html` 在部分浏览器上可以工作，但推荐起一个本地服务器：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 发布到 GitHub Pages / Publish to GitHub Pages

```bash
git init
git add .
git commit -m "Add lead-sheet to song generation demo page"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

然后在仓库 **Settings → Pages** 中，将 **Source** 设为 `Deploy from a branch`，
分支选 `main`、目录选 `/ (root)`，保存后几十秒即可访问：

```
https://<用户名>.github.io/<仓库名>/
```

说明 / Notes:

- 仓库内已包含 `.nojekyll`，避免 Jekyll 处理静态资源。
- 全部音频约 20 MB，远低于 GitHub 1 GB 的仓库软上限，无需 Git LFS。
- 页面使用相对路径，放在子目录（`/<仓库名>/`）下也能正常工作。

## 新增演示样例 / Adding samples

只需编辑 `assets/js/demos.js`，无需改动 `index.html` 或 `app.js`。

`lyrics` / `prompt` / `leadSheet` 三个字段的原文可以直接从样本目录里的
`condition.txt` 抄出来，对应关系是：

| demos.js 字段 | condition.txt 段落 |
| --- | --- |
| `lyrics` | 【1】description |
| `prompt` | 【2】type_info |
| `leadSheet` | 【3】leadsheet 的「解码后」一行及其后续小节 |

`leadSheet` 在 `condition.txt` 里是真实换行，写进 JS 字符串时用字面量 `\n`
（即源码中的 `\\n`）代替换行；页面会在每个 `\n` 处断行显示。

复制一个 `group` 对象并修改字段即可：

```js
{
  id: 'group-4',                              // 页面锚点，需唯一
  title: { zh: '样例 4', en: 'Group 4' },
  sampleId: '200_abcdef123456_chorus_2',      // 显示在标题旁的样本编号
  lyrics: '[verse] ...',                      // 留空则不显示该行
  prompt: '[Musicality-high], female, ...',   // 留空则不显示该行
  leadSheet: '<bos> ... \\n| ...',            // 留空则不显示该行
  systems: [
    {
      name: { zh: 'M6 · 有 lead-sheet 条件', en: 'M6 · with lead-sheet' },
      note: { zh: '输出 vocal 和带伴奏的 song', en: 'vocal + accompanied song' },
      variant: 'ours',                        // ours | baseline | gt，只影响配色
      tracks: {
        vocal: { src: 'M6_1000samples_with_mixed/<样本目录>/gen_vocal.mp3', duration: 12.9 },
        song:  { src: 'M6_1000samples_with_mixed/<样本目录>/gen_mixed.mp3', duration: 12.9 }
      }
    }
  ]
}
```

- `duration`（秒）是可选的，只用于音频加载前先把时长显示出来；填错或不填都不影响播放，
  播放器会在读到元数据后自动修正。可以用 `ffprobe` 批量获取：

```bash
for f in $(find . -name "*.mp3" | sort); do
  printf "%s %.1f\n" "$f" "$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")"
done
```

- 某个模型没有对应输出时，把该 track 写成 `null`，表格中会显示「— 无此输出」。

## 目录结构 / Structure

```
.
├── index.html                  页面结构与正文（中英双语）
├── assets/
│   ├── css/style.css           主题变量、布局、播放器样式
│   └── js/
│       ├── demos.js            演示数据 —— 新增样例只改这里
│       └── app.js              渲染、播放器、主题与语言切换
├── text.md                     原始文稿
├── M6_1000samples/             音频资源
├── M6_1000samples_with_mixed/
├── LeVo2_1000samples/
└── .nojekyll
```

## 音频命名约定 / Audio file conventions

| 文件 | 含义 |
| --- | --- |
| `gen_vocal.mp3` | 模型生成的纯人声 |
| `gen_mixed.mp3` / `gen_song.mp3` | 模型生成的带伴奏歌曲 |
| `gen_bgm.mp3` | 模型生成的伴奏（当前页面未展示） |
| `gt_vocal.mp3` | 真实录音的纯人声 |
| `gt_mixed.mp3` | 真实录音的带伴奏歌曲 |
| `gen_vocal.flac` | `M6_1000samples/` 下的无损原始输出 |

页面统一播放 MP3（48 kHz / 立体声 / 320 kbps CBR）。`M6_1000samples/` 中
样例 2、3 的 `gen_vocal*.mp3` 是由同目录的 `.flac` 按上述参数转码而来：

```bash
ffmpeg -i gen_vocal.flac -c:a libmp3lame -b:a 320k -ar 48000 -ac 2 -map_metadata -1 gen_vocal.mp3
```

三份 GT 音频（`gt_vocal.mp3` / `gt_mixed.mp3`）在三个模型目录下是逐字节相同的副本，
页面统一引用 `M6_1000samples_with_mixed/` 里的那一份。
