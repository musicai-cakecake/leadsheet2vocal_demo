/* ═══════════════════════════════════════════════════════════════
   Demo page behaviour: theme, language, demo rendering, audio players.
   Plain script (no ES modules) so the page also works from file://
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORE_THEME = 'velo-theme';
  var STORE_LANG = 'velo-lang';

  /* ---------- tiny helpers ---------- */

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function icon(className, path) {
    var span = el('span', className);
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = path;
    return span;
  }

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* private mode / file:// — ignore */ }
    return null;
  }

  function bilingual(parent, pair, tag) {
    var t = tag || 'span';
    if (!pair) return parent;
    if (pair.zh) parent.appendChild(el(t, 'lang lang-zh', pair.zh));
    if (pair.en) parent.appendChild(el(t, 'lang lang-en', pair.en));
    return parent;
  }

  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) return '--:--';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function slugify(str) {
    return String(str)
      .replace(/[·•]/g, ' ')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'audio';
  }

  function audioExtension(src) {
    var clean = String(src || '').split(/[?#]/)[0];
    var match = clean.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : 'audio';
  }

  var toastTimer;
  function toast(msg) {
    var box = document.getElementById('toast');
    if (!box) return;
    box.textContent = msg;
    box.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove('is-on'); }, 2400);
  }

  /* ---------- SVG paths ---------- */

  var SVG = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12 8 5.14Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2.2"/><path d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5"/></svg>'
  };

  /* ═══════════════ Theme ═══════════════ */

  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store(STORE_THEME, next);
    });
  }

  /* ═══════════════ Language ═══════════════ */

  function initLang() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]'));
    if (!buttons.length) return;

    function apply(mode) {
      root.setAttribute('data-lang', mode);
      root.setAttribute('lang', mode === 'en' ? 'en' : 'zh-CN');
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.langBtn === mode));
      });
      store(STORE_LANG, mode);
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.dataset.langBtn); });
    });

    apply(root.getAttribute('data-lang') || 'both');
  }

  /* ═══════════════ Audio players ═══════════════ */

  var players = [];

  function pauseAllExcept(keep) {
    players.forEach(function (p) { if (p !== keep) p.pause(); });
  }

  /**
   * Builds one inline audio player. `track` = { src, duration }.
   */
  function createPlayer(track, downloadName) {
    var src = encodeURI(track.src);

    var audio = new Audio();
    audio.preload = 'none';
    audio.src = src;

    var wrap = el('div', 'player');

    var playBtn = el('button', 'play');
    playBtn.type = 'button';
    playBtn.setAttribute('aria-label', '播放 / Play');
    playBtn.appendChild(icon('i-play', SVG.play));
    playBtn.appendChild(icon('i-pause', SVG.pause));

    var body = el('div', 'player-body');

    var seek = document.createElement('input');
    seek.type = 'range';
    seek.className = 'seek';
    seek.min = '0';
    seek.max = '1000';
    seek.step = '1';
    seek.value = '0';
    seek.setAttribute('aria-label', '播放进度 / Seek');

    var times = el('div', 'times');
    var cur = el('span', 'cur', '0:00');
    var dur = el('span', 'dur', track.duration ? fmtTime(track.duration) : '--:--');
    times.appendChild(cur);
    times.appendChild(dur);

    body.appendChild(seek);
    body.appendChild(times);

    var dl = el('a', 'dl');
    dl.href = src;
    dl.setAttribute('download', downloadName);
    dl.setAttribute('aria-label', '下载 / Download ' + downloadName);
    dl.title = '下载 / Download';
    dl.appendChild(icon('', SVG.download));

    wrap.appendChild(playBtn);
    wrap.appendChild(body);
    wrap.appendChild(dl);

    var seeking = false;

    function total() {
      return isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (track.duration || 0);
    }

    function paint() {
      var d = total();
      var ratio = d > 0 ? Math.min(audio.currentTime / d, 1) : 0;
      if (!seeking) seek.value = String(Math.round(ratio * 1000));
      seek.style.setProperty('--p', ratio);
      cur.textContent = fmtTime(audio.currentTime);
    }

    audio.addEventListener('loadedmetadata', function () {
      dur.textContent = fmtTime(total());
      paint();
    });
    audio.addEventListener('timeupdate', paint);
    audio.addEventListener('play', function () {
      wrap.classList.add('is-playing');
      playBtn.setAttribute('aria-label', '暂停 / Pause');
    });
    audio.addEventListener('pause', function () {
      wrap.classList.remove('is-playing');
      playBtn.classList.remove('is-loading');
      playBtn.setAttribute('aria-label', '播放 / Play');
    });
    audio.addEventListener('ended', function () {
      audio.currentTime = 0;
      paint();
    });
    audio.addEventListener('waiting', function () { playBtn.classList.add('is-loading'); });
    audio.addEventListener('playing', function () { playBtn.classList.remove('is-loading'); });
    audio.addEventListener('error', function () {
      wrap.classList.add('is-error');
      playBtn.classList.remove('is-loading');
      dur.textContent = '!';
      toast('音频加载失败 / Failed to load: ' + track.src);
    });

    seek.addEventListener('pointerdown', function () { seeking = true; });
    seek.addEventListener('input', function () {
      var ratio = Number(seek.value) / 1000;
      seek.style.setProperty('--p', ratio);
      var d = total();
      if (d > 0) cur.textContent = fmtTime(ratio * d);
    });
    function commitSeek() {
      if (!seeking) return;
      seeking = false;
      var d = total();
      if (d > 0) audio.currentTime = (Number(seek.value) / 1000) * d;
    }
    seek.addEventListener('pointerup', commitSeek);
    seek.addEventListener('change', function () {
      var d = total();
      if (d > 0) audio.currentTime = (Number(seek.value) / 1000) * d;
      seeking = false;
    });

    var api = {
      pause: function () { if (!audio.paused) audio.pause(); }
    };

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        pauseAllExcept(api);
        playBtn.classList.add('is-loading');
        var p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () { playBtn.classList.remove('is-loading'); });
        }
      } else {
        audio.pause();
      }
    });

    players.push(api);
    return { node: wrap, href: src, name: downloadName };
  }

  /* ═══════════════ Rendering ═══════════════ */

  function renderLeadSheet(raw) {
    var box = el('div', 'sheet');
    var pre = el('pre');
    // The source keeps bar lines as a literal two-character "\n" marker.
    pre.textContent = String(raw).split('\\n').join('\n').trim();
    box.appendChild(pre);

    var copy = el('button', 'mini-btn sheet-copy');
    copy.type = 'button';
    copy.appendChild(icon('', SVG.copy));
    copy.appendChild(el('span', null, 'Copy'));
    copy.addEventListener('click', function () {
      var text = raw;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { toast('已复制领谱 / Lead sheet copied'); },
          function () { legacyCopy(text); }
        );
      } else {
        legacyCopy(text);
      }
    });
    box.appendChild(copy);
    return box;
  }

  function legacyCopy(text) {
    var ta = el('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      toast('已复制领谱 / Lead sheet copied');
    } catch (e) {
      toast('复制失败 / Copy failed');
    }
    document.body.removeChild(ta);
  }

  function metaRow(keyZh, keyEn, valueNode) {
    var row = el('div', 'meta-row');
    var key = el('div', 'meta-key');
    key.appendChild(el('span', 'lang lang-zh', keyZh));
    key.appendChild(el('span', 'lang lang-en', keyEn));
    row.appendChild(key);
    var val = el('div', 'meta-val');
    val.appendChild(valueNode);
    row.appendChild(val);
    return row;
  }

  function renderGroup(group, columns) {
    var section = el('section', 'demo-group');
    section.id = group.id;
    var groupFiles = [];

    /* --- head --- */
    var head = el('div', 'group-head');
    var title = el('h3', 'group-title');
    bilingual(title, group.title);
    head.appendChild(title);
    if (group.sampleId) head.appendChild(el('code', 'group-id', group.sampleId));

    var actions = el('div', 'group-actions');
    var dlAll = el('button', 'mini-btn');
    dlAll.type = 'button';
    dlAll.appendChild(icon('', SVG.download));
    dlAll.appendChild(el('span', 'lang lang-zh', '下载本组音频'));
    dlAll.appendChild(el('span', 'lang lang-en', 'Download all'));
    actions.appendChild(dlAll);
    head.appendChild(actions);
    section.appendChild(head);

    /* --- metadata --- */
    var hasMeta = group.lyrics || group.prompt ||
      (group.prompts && group.prompts.length) || group.leadSheet ||
      (group.referenceAudio && group.referenceAudio.src);
    if (hasMeta) {
      var meta = el('div', 'meta');
      if (group.lyrics) {
        var lyricsVal = el('div', 'is-lyrics', group.lyrics);
        meta.appendChild(metaRow('歌词', 'Lyrics', lyricsVal));
      }
      if (group.prompt) {
        meta.appendChild(metaRow('提示词', 'Prompt', el('div', null, group.prompt)));
      }
      if (group.prompts && group.prompts.length) {
        group.prompts.forEach(function (prompt, index) {
          var label = prompt.label || {
            zh: '提示词 ' + (index + 1),
            en: 'Prompts ' + (index + 1)
          };
          meta.appendChild(metaRow(
            label.zh,
            label.en,
            el('div', null, prompt.value || '')
          ));
        });
      }
      if (group.leadSheet) {
        meta.appendChild(metaRow('领谱', 'Lead sheet', renderLeadSheet(group.leadSheet)));
      }
      if (group.referenceAudio && group.referenceAudio.src) {
        var referenceName = [
          group.sampleId || group.id,
          'reference-timbre'
        ].join('__') + '.' + audioExtension(group.referenceAudio.src);
        var referencePlayer = createPlayer(group.referenceAudio, referenceName);
        meta.appendChild(metaRow(
          '参考音色音频',
          'Reference timbre audio',
          referencePlayer.node
        ));
        groupFiles.push(referencePlayer);
      }
      section.appendChild(meta);
    }

    /* --- comparison grid --- */
    var tracks = el('div', 'tracks');

    var thead = el('div', 'track-head');
    var hSys = el('div');
    hSys.appendChild(el('span', 'lang lang-zh', '模型'));
    hSys.appendChild(el('span', 'lang lang-en', 'System'));
    thead.appendChild(hSys);
    columns.forEach(function (c) { thead.appendChild(bilingual(el('div'), c.label)); });
    tracks.appendChild(thead);

    group.systems.forEach(function (sys) {
      var row = el('div', 'track-row');
      row.setAttribute('data-variant', sys.variant || 'gt');

      var sysCell = el('div', 'sys');
      sysCell.appendChild(el('span', 'sys-name', sys.model || ''));
      if (sys.note) {
        var noteEl = el('span', 'sys-note');
        bilingual(noteEl, sys.note);
        sysCell.appendChild(noteEl);
      }
      row.appendChild(sysCell);

      columns.forEach(function (col) {
        var cell = el('div', 'track-cell');
        var label = el('div', 'cell-label');
        bilingual(label, col.label);
        cell.appendChild(label);

        var track = sys.tracks ? sys.tracks[col.key] : null;
        if (track && track.src) {
          var fileName = [
            group.sampleId || group.id,
            slugify(sys.model || '') + (sys.note && sys.note.en ? '-' + slugify(sys.note.en) : ''),
            col.key
          ].join('__') + '.' + audioExtension(track.src);
          var p = createPlayer(track, fileName);
          cell.appendChild(p.node);
          groupFiles.push(p);
        } else {
          var dash = el('div', 'no-track');
          dash.appendChild(el('span', null, '— '));
          dash.appendChild(el('span', 'lang lang-zh', '无此输出'));
          dash.appendChild(el('span', 'lang lang-en', 'not produced'));
          cell.appendChild(dash);
        }
        row.appendChild(cell);
      });

      tracks.appendChild(row);
    });

    section.appendChild(tracks);

    if (group.melodyGroundTruth && group.melodyGroundTruth.src) {
      var melodyRow = el('div', 'melody-ground-truth');
      var melodyInfo = el('div', 'melody-info');
      bilingual(melodyInfo, {
        zh: 'Lead Sheet 旋律乐谱',
        en: 'Lead Sheet Melody'
      }, 'strong');
      bilingual(melodyInfo, {
        zh: '领谱渲染音频',
        en: 'rendered lead-sheet melody'
      }, 'span');

      var melodyName = [
        group.sampleId || group.id,
        'lead-sheet-melody-ground-truth'
      ].join('__') + '.' + audioExtension(group.melodyGroundTruth.src);
      var melodyPlayer = createPlayer(group.melodyGroundTruth, melodyName);

      melodyRow.appendChild(melodyInfo);
      melodyRow.appendChild(melodyPlayer.node);
      section.appendChild(melodyRow);
      groupFiles.push(melodyPlayer);
    }

    if (group.recordingGroundTruth) {
      var recordingRow = el('div', 'track-row recording-ground-truth');
      recordingRow.setAttribute('data-variant', 'gt');

      var recordingInfo = el('div', 'sys');
      recordingInfo.appendChild(el('span', 'sys-name', 'GT'));
      var recordingNote = el('span', 'sys-note');
      bilingual(recordingNote, {
        zh: '真实录音',
        en: 'ground-truth recording'
      });
      recordingInfo.appendChild(recordingNote);
      recordingRow.appendChild(recordingInfo);

      columns.forEach(function (col) {
        var cell = el('div', 'track-cell');
        var label = el('div', 'cell-label');
        bilingual(label, col.key === 'vocal' ? {
          zh: '真实 Vocal · 纯人声',
          en: 'Ground-truth Vocal'
        } : {
          zh: '真实 Song · 带伴奏',
          en: 'Ground-truth Song'
        });
        cell.appendChild(label);

        var track = group.recordingGroundTruth[col.key];
        if (track && track.src) {
          var fileName = [
            group.sampleId || group.id,
            'GT-ground-truth-recording',
            col.key
          ].join('__') + '.' + audioExtension(track.src);
          var player = createPlayer(track, fileName);
          cell.appendChild(player.node);
          groupFiles.push(player);
        }
        recordingRow.appendChild(cell);
      });

      section.appendChild(recordingRow);
    }

    dlAll.addEventListener('click', function () {
      if (!groupFiles.length) return;
      toast('开始下载 ' + groupFiles.length + ' 个文件 / Downloading ' + groupFiles.length + ' files');
      groupFiles.forEach(function (f, i) {
        setTimeout(function () {
          var a = el('a');
          a.href = f.href;
          a.download = f.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, i * 350);
      });
    });

    return section;
  }

  function renderDemoCollection(mountId, data) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    if (!data || !data.groups || !data.groups.length) {
      mount.appendChild(el('p', 'notice', '未找到演示数据 / No demo data found (assets/js/demos.js).'));
      return;
    }
    var columns = data.columns || [
      { key: 'vocal', label: { zh: '纯人声 Vocal', en: 'Vocal' } },
      { key: 'song', label: { zh: '带伴奏 Song', en: 'Song' } }
    ];
    var frag = document.createDocumentFragment();
    data.groups.forEach(function (g) { frag.appendChild(renderGroup(g, columns)); });
    mount.appendChild(frag);
  }

  function renderDemos() {
    renderDemoCollection('demo-root', window.DEMO_DATA);
    renderDemoCollection('prompt-demo-root', window.PROMPT_DEMO_DATA);
  }

  /* ═══════════════ Nav scroll-spy ═══════════════ */

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { map[t.id] = a; targets.push(t); }
    });

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var chosen = null;
      targets.forEach(function (t) { if (visible[t.id] && !chosen) chosen = t.id; });
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (chosen && map[chosen]) map[chosen].classList.add('is-active');
    }, { rootMargin: '-70px 0px -65% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ═══════════════ Boot ═══════════════ */

  function boot() {
    initTheme();
    renderDemos();
    initLang();          // after render, so generated .lang nodes get the current mode
    initScrollSpy();

    // Stop playback when the tab is hidden for a while is unnecessary, but a
    // global Escape to stop everything is handy when comparing many takes.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') pauseAllExcept(null);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
