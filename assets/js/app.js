(() => {
  "use strict";

  const data = window.VOCAL_DEMOS;
  const root = document.documentElement;
  const strings = {
    sections: ["页面章节", "Page sections"],
    theme: ["切换深浅色主题", "Toggle light / dark theme"],
    studioAlt: ["音乐工作室中的企鹅插画", "An illustration of a penguin in a music studio"],
    searchLabel: ["搜索样本", "Search samples"],
    searchPlaceholder: ["搜索歌词、提示词、样本 ID…", "Search lyrics, prompts, sample ID…"],
    genreLabel: ["风格", "Style"],
    sectionLabel: ["段落", "Section"],
    clearFilters: ["清除筛选", "Reset filters"],
    pauseAll: ["暂停全部", "Pause all"],
    sampleIndex: ["样本快捷跳转", "Jump to a sample"],
    evaluationTable: ["评价结果表，可横向滚动", "Evaluation table; scroll horizontally if needed"],
    noResults: ["没有找到匹配样本", "No matching samples"],
    noResultsHint: ["试试其他歌词、提示词或筛选条件。", "Try different lyrics, prompts, or filters."],
    nowPlaying: ["当前音轨", "Current audio track"],
    closePlayer: ["停止并关闭播放器", "Stop and close player"],
    play: ["播放", "Play"],
    pause: ["暂停", "Pause"],
    seek: ["播放进度", "Playback position"],
    download: ["下载原始 WAV 音频", "Download original WAV audio"],
    copy: ["复制", "Copy"],
    copyId: ["复制样本 ID", "Copy sample ID"],
    copyABC: ["复制完整 ABC", "Copy full ABC"],
    copied: ["已复制到剪贴板", "Copied to clipboard"],
    copyError: ["无法复制，请手动选择文本。", "Copy failed. Please select the text manually."],
    loading: ["正在加载音频…", "Loading audio…"],
    audioError: ["音频加载失败，可点击重试或下载 WAV。", "Audio failed to load. Retry or download the WAV."],
    dataError: ["样本数据未能加载，请检查站点文件是否完整。", "Sample data could not load. Check that all site files are present."],
    count: ["显示 {shown} / {total} 组", "Showing {shown} / {total}"],
    allStyles: ["全部", "All styles"],
    allSections: ["全部", "All sections"],
  };
  const genres = {
    pop: ["流行", "Pop"],
    rock: ["摇滚", "Rock"],
    "r&b": ["R&B", "R&B"],
    country: ["乡村", "Country"],
    classical: ["古典", "Classical"],
    gospel: ["福音", "Gospel"],
    other: ["其他", "Other"],
  };
  const sections = {
    chorus: ["副歌", "Chorus"],
    verse: ["主歌", "Verse"],
    bridge: ["桥段", "Bridge"],
    outro: ["尾奏", "Outro"],
  };
  const voices = {
    male: ["男声", "Male voice"],
    female: ["女声", "Female voice"],
    unspecified: ["音色未标注", "Voice not specified"],
  };
  const models = [
    { id: "gt", label: "GT", role: ["真实参考", "Reference"], kind: "neutral" },
    { id: "gt_vae", label: "GT VAE", role: ["VAE 重建", "VAE reconstruction"], kind: "neutral" },
    { id: "v2", label: "V2", role: ["旧版基线", "Baseline"], kind: "baseline" },
    { id: "v3_forced", label: "V3 Forced", role: ["限总时长", "Duration constrained"], kind: "primary" },
    { id: "v3_free", label: "V3 Free", role: ["自由时长", "Free duration"], kind: "primary" },
    { id: "v3_oracle", label: "V3 Oracle", role: ["框架重建", "Reconstruction"], kind: "neutral" },
  ];

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function translate(pair, values = {}) {
    let result = root.dataset.lang === "en" ? pair[1] : root.dataset.lang === "zh" || pair[0] === pair[1] ? pair[0] : `${pair[0]} / ${pair[1]}`;
    Object.entries(values).forEach(([key, value]) => { result = result.replaceAll(`{${key}}`, String(value)); });
    return result;
  }

  const text = (key, values) => translate(strings[key], values);
  const bilingual = (zh, en) => `<span class="bilingual"><span class="lang-zh" lang="zh-CN">${escapeHTML(zh)}</span><span class="lang-en" lang="en">${escapeHTML(en)}</span></span>`;
  const icon = (name, className = "") => `<svg class="icon ${className}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const numberLabel = (sample) => String(sample.number).padStart(2, "0");
  const shortTitle = (sample) => sample.title.length > 88 ? `${sample.title.slice(0, 88)}…` : sample.title;

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
  }

  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(key) {
    clearTimeout(toastTimer);
    toast.dataset.message = key;
    toast.textContent = text(key);
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  function updateStaticLabels() {
    document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = text(element.dataset.i18n); });
    document.querySelectorAll("[data-i18n-label]").forEach((element) => { element.setAttribute("aria-label", text(element.dataset.i18nLabel)); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { element.placeholder = text(element.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => { element.alt = text(element.dataset.i18nAlt); });
    if (!toast.hidden && toast.dataset.message) toast.textContent = text(toast.dataset.message);
  }

  updateStaticLabels();
  if (!data || !Array.isArray(data.samples) || data.samples.length === 0) {
    document.getElementById("demo-list").textContent = text("dataError");
    window.addEventListener("languagechange", () => {
      updateStaticLabels();
      document.getElementById("demo-list").textContent = text("dataError");
    });
    return;
  }

  const priorityIds = (document.getElementById("demo").dataset.prioritySamples || "")
    .split(/\s+/).filter(Boolean);
  const priorityOrder = new Map(priorityIds.map((id, index) => [id, index]));
  data.samples = [...data.samples]
    .sort((a, b) => (priorityOrder.get(a.id) ?? priorityIds.length) - (priorityOrder.get(b.id) ?? priorityIds.length))
    .map((sample, index) => ({ ...sample, number: index + 1 }));

  function renderTrack(sample, model) {
    const track = sample.tracks[model.id];
    const filename = `${sample.id}_${model.id}.wav`;
    const audioInfo = `${track.sampleRate / 1000} kHz · ${track.channels} ch · ${track.bitsPerSample} bit · ${(track.bytes / 1024 / 1024).toFixed(2)} MiB`;
    return `<div class="audio-track ${model.kind === "primary" ? "track-primary" : ""}" id="track-${sample.number}-${model.id}" data-model="${model.id}" data-state="idle">
      <div class="audio-track-header"><span class="track-name">${model.label}</span><span class="badge badge-${model.kind}">${bilingual(...model.role)}</span></div>
      <div class="track-controls"><button type="button" class="play-button" aria-label="${escapeHTML(text("play"))} ${model.label}">${icon("play")}</button><input class="audio-seek" type="range" min="0" max="${track.duration}" step="0.1" value="0" disabled aria-label="${escapeHTML(text("seek"))}"></div>
      <div class="track-footer"><span class="audio-time">0:00 / ${formatTime(track.duration)}</span><a class="audio-download" href="${escapeHTML(track.src)}" download="${filename}" data-i18n-label="download" aria-label="${escapeHTML(text("download"))}" title="${audioInfo}">${icon("download")}WAV</a></div>
      <span class="track-status"></span><audio preload="none"></audio>
    </div>`;
  }

  function renderSample(sample) {
    const section = sections[sample.section];
    const language = sample.language === "English" ? ["英语", "English"] : ["语言未标注", "Language not specified"];
    const tags = [bilingual(...language), bilingual(...genres[sample.genre]), bilingual(...voices[sample.voice]), `${sample.bpm} BPM`, `K: ${escapeHTML(sample.key)}`, `M: ${escapeHTML(sample.meter)}`];
    return `<article class="sample-card card" id="sample-${numberLabel(sample)}" data-sample="${sample.id}" aria-labelledby="sample-title-${sample.number}">
      <div class="sample-header"><span class="sample-number">${numberLabel(sample)}</span><div class="sample-heading"><div class="sample-overline"><span>SAMPLE ${numberLabel(sample)}</span><span>·</span>${bilingual(section[0], section[1])}<span>${sample.sectionNumber}</span></div><h3 id="sample-title-${sample.number}" ${sample.language === "English" ? 'lang="en"' : ""}>${escapeHTML(shortTitle(sample))}</h3><div class="sample-id"><code>${sample.id}</code><button type="button" class="copy-id" data-copy="id" data-i18n-label="copyId" aria-label="${escapeHTML(text("copyId"))}">${icon("copy")}</button></div></div></div>
      <div class="sample-tags">${tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      <div class="sample-input-grid">
        <section class="input-panel"><div class="input-panel-header"><h4>${bilingual("歌词 · 原始输入", "Lyrics · original input")}</h4><button type="button" class="text-button" data-copy="lyrics">${icon("copy")}<span data-i18n="copy">${escapeHTML(text("copy"))}</span></button></div><pre class="lyrics-text" ${sample.language === "English" ? 'lang="en"' : ""}>${escapeHTML(sample.lyrics)}</pre></section>
        <section class="input-panel"><div class="input-panel-header"><h4>${bilingual("提示词 · 原始输入", "Prompts · original input")}</h4><button type="button" class="text-button" data-copy="prompt">${icon("copy")}<span data-i18n="copy">${escapeHTML(text("copy"))}</span></button></div><p class="prompt-text" lang="en">${escapeHTML(sample.prompt)}</p></section>
      </div>
      <details class="abc-details"><summary>${icon("score")}${bilingual("ABC 领谱 · 查看完整乐谱", "ABC lead sheet · view full score")}${icon("chevron", "chevron")}</summary><div class="abc-body"><div class="abc-actions"><button type="button" class="text-button" data-copy="abc">${icon("copy")}<span data-i18n="copyABC">${escapeHTML(text("copyABC"))}</span></button></div><pre class="abc-text"><code>${escapeHTML(sample.abc)}</code></pre></div></details>
      <div class="audio-area"><div class="audio-area-heading"><span>${icon("headphones")}${bilingual("音频对照", "Audio comparison")}</span><span class="audio-area-note">${bilingual("原始 WAV · 点击加载", "Original WAV · load on play")}</span></div><div class="audio-grid">${models.map((model) => renderTrack(sample, model)).join("")}</div></div>
    </article>`;
  }

  document.getElementById("demo-list").innerHTML = data.samples.map(renderSample).join("");
  document.getElementById("sample-index").innerHTML = data.samples.map((sample) => `<a href="#sample-${numberLabel(sample)}" data-index="${sample.id}" aria-label="${escapeHTML(translate(["跳到样本", "Jump to sample"]))} ${numberLabel(sample)}">${numberLabel(sample)}</a>`).join("");

  function updateRange(range, duration, currentTime, ready) {
    const current = Math.min(duration, Math.max(0, currentTime || 0));
    range.max = String(duration || 1);
    range.value = String(current);
    range.disabled = !ready;
    range.style.setProperty("--progress", `${duration ? current / duration * 100 : 0}%`);
    range.setAttribute("aria-valuetext", `${formatTime(current)} / ${formatTime(duration)}`);
  }

  class PlaybackManager {
    constructor() {
      this.active = null;
      this.bar = document.getElementById("now-playing");
      this.toggleButton = document.getElementById("now-toggle");
      this.range = document.getElementById("now-seek");
      this.time = document.getElementById("now-time");
      this.pauseButton = document.getElementById("pause-all");
      this.toggleButton.addEventListener("click", () => this.active?.toggle());
      this.range.addEventListener("input", () => this.active?.seek(Number(this.range.value)));
      this.pauseButton.addEventListener("click", () => this.active?.pause());
      document.getElementById("now-close").addEventListener("click", () => this.close());
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") this.active?.pause();
      });
    }

    activate(track) {
      if (this.active !== track) {
        this.active?.pause();
        this.active?.element.classList.remove("is-active");
        this.active = track;
        track.element.classList.add("is-active");
      }
      this.bar.hidden = false;
      document.body.classList.add("has-playback");
      this.update();
    }

    update() {
      this.pauseButton.disabled = !this.active || !["playing", "loading"].includes(this.active.state);
      if (!this.active) return;
      const track = this.active;
      const playing = ["playing", "loading"].includes(track.state);
      this.toggleButton.querySelector("use").setAttribute("href", `#icon-${playing ? "pause" : "play"}`);
      this.toggleButton.classList.toggle("is-loading", track.state === "loading");
      this.toggleButton.setAttribute("aria-label", `${text(playing ? "pause" : "play")} ${track.model.label}`);
      document.getElementById("now-model").textContent = `${track.model.label} · ${translate(["样本", "Sample"])} ${numberLabel(track.sample)}`;
      document.getElementById("now-title").textContent = shortTitle(track.sample);
      const link = document.getElementById("now-download");
      link.href = track.info.src;
      link.download = `${track.sample.id}_${track.model.id}.wav`;
      updateRange(this.range, track.duration, track.audio.currentTime, track.ready);
      this.time.textContent = `${formatTime(track.audio.currentTime)} / ${formatTime(track.duration)}`;
    }

    close() {
      this.active?.pause();
      this.active?.element.classList.remove("is-active");
      this.active = null;
      this.bar.hidden = true;
      document.body.classList.remove("has-playback");
      this.update();
    }
  }

  const playback = new PlaybackManager();

  class AudioTrack {
    constructor(sample, model) {
      this.sample = sample;
      this.model = model;
      this.info = sample.tracks[model.id];
      this.duration = this.info.duration;
      this.element = document.getElementById(`track-${sample.number}-${model.id}`);
      this.audio = this.element.querySelector("audio");
      this.button = this.element.querySelector(".play-button");
      this.range = this.element.querySelector(".audio-seek");
      this.time = this.element.querySelector(".audio-time");
      this.status = this.element.querySelector(".track-status");
      this.state = "idle";
      this.ready = false;
      this.request = 0;
      this.button.addEventListener("click", () => this.toggle());
      this.range.addEventListener("input", () => this.seek(Number(this.range.value)));
      this.audio.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
          this.duration = this.audio.duration;
          this.ready = true;
        }
        this.render();
      });
      this.audio.addEventListener("play", () => {
        if (playback.active !== this) playback.activate(this);
      });
      this.audio.addEventListener("playing", () => this.setState("playing"));
      this.audio.addEventListener("waiting", () => {
        if (!this.audio.paused && playback.active === this) this.setState("loading");
      });
      this.audio.addEventListener("pause", () => {
        if (!["error", "ended"].includes(this.state)) this.setState("paused");
      });
      this.audio.addEventListener("ended", () => this.setState("ended"));
      this.audio.addEventListener("timeupdate", () => this.renderProgress());
      this.audio.addEventListener("error", () => {
        this.setState("error");
        showToast("audioError");
      });
      this.render();
    }

    setState(state) {
      this.state = state;
      this.render();
    }

    toggle() {
      if (["playing", "loading"].includes(this.state)) this.pause();
      else this.play();
    }

    async play() {
      playback.activate(this);
      if (!this.audio.getAttribute("src")) this.audio.src = encodeURI(this.info.src);
      if (this.state === "error") {
        this.ready = false;
        this.audio.load();
      }
      if (this.audio.ended) this.audio.currentTime = 0;
      const request = ++this.request;
      this.setState("loading");
      try {
        await this.audio.play();
      } catch (error) {
        if (request !== this.request || playback.active !== this || error.name === "AbortError") return;
        this.setState("error");
        showToast("audioError");
      }
    }

    pause() {
      this.request += 1;
      this.audio.pause();
      if (!["error", "ended"].includes(this.state)) this.setState("paused");
    }

    seek(seconds) {
      if (!this.ready || !Number.isFinite(seconds)) return;
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.duration));
      this.renderProgress();
    }

    render() {
      const playing = ["playing", "loading"].includes(this.state);
      const context = `${this.model.label} · ${translate(["样本", "Sample"])} ${numberLabel(this.sample)}`;
      this.element.dataset.state = this.state;
      this.button.querySelector("use").setAttribute("href", `#icon-${playing ? "pause" : "play"}`);
      this.button.classList.toggle("is-loading", this.state === "loading");
      this.button.setAttribute("aria-label", `${text(playing ? "pause" : "play")} ${context}`);
      this.button.title = `${text(playing ? "pause" : "play")} ${context}`;
      this.range.setAttribute("aria-label", `${text("seek")} ${context}`);
      this.status.textContent = this.state === "error" ? text("audioError") : this.state === "loading" ? text("loading") : "";
      this.renderProgress();
    }

    renderProgress() {
      updateRange(this.range, this.duration, this.audio.currentTime, this.ready);
      this.time.textContent = `${formatTime(this.audio.currentTime)} / ${formatTime(this.duration)}`;
      if (playback.active === this) playback.update();
    }
  }

  const tracks = data.samples.flatMap((sample) => models.map((model) => new AudioTrack(sample, model)));
  const searchInput = document.getElementById("sample-search");
  const genreFilter = document.getElementById("genre-filter");
  const sectionFilter = document.getElementById("section-filter");
  const cards = data.samples.map((sample) => ({
    sample,
    element: document.getElementById(`sample-${numberLabel(sample)}`),
    index: document.querySelector(`[data-index="${sample.id}"]`),
    searchable: [sample.id, sample.lyrics, sample.prompt, sample.abc, ...genres[sample.genre], ...sections[sample.section], ...voices[sample.voice], sample.language === "English" ? "英语 English" : "语言未标注", sample.bpm].join(" ").toLowerCase(),
  }));

  function updateFilterOptions() {
    const selectedGenre = genreFilter.value || "all";
    const selectedSection = sectionFilter.value || "all";
    genreFilter.innerHTML = `<option value="all">${escapeHTML(text("allStyles"))}</option>` + Object.entries(genres).map(([key, value]) => `<option value="${key}">${escapeHTML(translate(value))}</option>`).join("");
    sectionFilter.innerHTML = `<option value="all">${escapeHTML(text("allSections"))}</option>` + Object.entries(sections).map(([key, value]) => `<option value="${key}">${escapeHTML(translate(value))}</option>`).join("");
    genreFilter.value = selectedGenre;
    sectionFilter.value = selectedSection;
  }

  function applyFilters() {
    const terms = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    cards.forEach(({ sample, element, index, searchable }) => {
      const matches = (genreFilter.value === "all" || sample.genre === genreFilter.value)
        && (sectionFilter.value === "all" || sample.section === sectionFilter.value)
        && terms.every((term) => searchable.includes(term));
      element.hidden = !matches;
      index.hidden = !matches;
      if (matches) shown += 1;
      else if (playback.active?.sample.id === sample.id) playback.active.pause();
    });
    document.getElementById("sample-count").textContent = text("count", { shown, total: data.sampleCount });
    document.getElementById("empty-state").hidden = shown !== 0;
    document.getElementById("clear-filters").hidden = terms.length === 0 && genreFilter.value === "all" && sectionFilter.value === "all";
  }

  function clearFilters() {
    searchInput.value = "";
    genreFilter.value = "all";
    sectionFilter.value = "all";
    applyFilters();
  }

  updateFilterOptions();
  applyFilters();
  searchInput.addEventListener("input", applyFilters);
  genreFilter.addEventListener("change", applyFilters);
  sectionFilter.addEventListener("change", applyFilters);
  document.getElementById("clear-filters").addEventListener("click", clearFilters);
  document.getElementById("empty-reset").addEventListener("click", () => { clearFilters(); searchInput.focus(); });

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(value); return; } catch { /* Fall back for local files or restricted clipboard access. */ }
    }
    const focused = document.activeElement;
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.readOnly = true;
    textarea.className = "visually-hidden";
    document.body.append(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } finally { textarea.remove(); focused?.focus({ preventScroll: true }); }
    if (!copied) throw new Error("Clipboard unavailable");
  }

  const sampleById = new Map(data.samples.map((sample) => [sample.id, sample]));
  document.getElementById("demo-list").addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-copy]");
    if (!button) return;
    const sample = sampleById.get(button.closest("[data-sample]").dataset.sample);
    if (!sample || !["id", "lyrics", "prompt", "abc"].includes(button.dataset.copy)) return;
    try { await copyText(sample[button.dataset.copy]); showToast("copied"); } catch { showToast("copyError"); }
  });

  window.addEventListener("languagechange", () => {
    updateStaticLabels();
    updateFilterOptions();
    document.querySelectorAll("[data-index]").forEach((link) => { link.setAttribute("aria-label", `${translate(["跳到样本", "Jump to sample"])} ${link.textContent}`); });
    tracks.forEach((track) => track.render());
    applyFilters();
    playback.update();
  });

  if ("IntersectionObserver" in window) {
    const navigation = [...document.querySelectorAll(".nav a")];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigation.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-90px 0px -52% 0px", threshold: 0 });
    document.querySelectorAll("main section[id].section").forEach((section) => observer.observe(section));
  }

  if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" }));
})();
