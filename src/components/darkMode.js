import { state } from "../state.js";

const STORAGE_KEY = "pinterest_dark";

export function loadDarkMode() {
  const saved = localStorage.getItem(STORAGE_KEY);
  state.dark = saved !== null
    ? JSON.parse(saved)
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.dark ? "dark" : "light");

  const icon = document.getElementById("darkModeIcon");
  const btn = document.getElementById("darkModeBtn");
  if (!icon || !btn) return;

  icon.innerHTML = state.dark
    ? '<path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
    : '<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>';

  btn.title = state.dark ? "Modo claro" : "Modo oscuro";
}

export function toggleDarkMode() {
  state.dark = !state.dark;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.dark));
  applyTheme();
}

export function initDarkMode() {
  loadDarkMode();
  applyTheme();
  document.getElementById("darkModeBtn")?.addEventListener("click", toggleDarkMode);
}
