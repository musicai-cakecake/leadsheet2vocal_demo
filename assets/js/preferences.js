(() => {
  "use strict";

  const root = document.documentElement;
  const read = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
  };
  const storedLanguage = read("leadsheet-v3-language");
  const storedTheme = read("leadsheet-v3-theme");
  root.dataset.lang = ["zh", "en", "both"].includes(storedLanguage) ? storedLanguage : "both";
  root.dataset.theme = ["light", "dark"].includes(storedTheme)
    ? storedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.lang = root.dataset.lang === "en" ? "en" : "zh-CN";

  function updateControls() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === root.dataset.lang));
    });
    document.getElementById("theme-toggle")?.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    const chineseTitle = "领谱生成歌声演示 · V3";
    const englishTitle = "Lead Sheet & Prompts to Vocal Generation · V3";
    document.title = root.dataset.lang === "zh" ? chineseTitle : root.dataset.lang === "en" ? englishTitle : `${chineseTitle} | ${englishTitle}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        root.dataset.lang = button.dataset.language;
        root.lang = root.dataset.lang === "en" ? "en" : "zh-CN";
        save("leadsheet-v3-language", root.dataset.lang);
        updateControls();
        window.dispatchEvent(new CustomEvent("languagechange", { detail: root.dataset.lang }));
      });
    });
    document.getElementById("theme-toggle").addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      save("leadsheet-v3-theme", root.dataset.theme);
      updateControls();
    });
    updateControls();
  });
})();
