import { state } from "../state.js";
import { createMoonIcon, createSunIcon } from "../utils/icons.js";

const STORAGE_KEY = "pinterest_dark";

function loadDarkMode() {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  state.dark =
    savedTheme !== null
      ? JSON.parse(savedTheme)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.dark ? "dark" : "light");

  const button = document.getElementById("darkModeBtn");
  if (!button) return;

  button.replaceChildren(
    state.dark
      ? createSunIcon({ id: "darkModeIcon" })
      : createMoonIcon({ id: "darkModeIcon" })
  );

  const label = state.dark ? "Modo claro" : "Modo oscuro";
  button.title = label;
  button.setAttribute("aria-label", label);
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
