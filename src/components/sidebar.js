import { state } from "../state.js";
import { emit } from "../events.js";

const VIEWS_WITH_ACTION = ["home", "explore", "favorites"];

export function setActiveNav(view) {
  state.activeView = view;

  document.querySelectorAll(".sidebar__item[data-view]").forEach((btn) => {
    btn.classList.toggle("sidebar__item--active", btn.dataset.view === view);
  });

  document.querySelectorAll(".bottom-bar__item[data-view]").forEach((btn) => {
    btn.classList.toggle("bottom-bar__item--active", btn.dataset.view === view);
  });
}

function toggleCollapse() {
  state.sidebarCollapsed = !state.sidebarCollapsed;

  const sidebar = document.getElementById("sidebar");
  const icon = document.getElementById("collapseIcon");
  const main = document.getElementById("appMain");

  sidebar.classList.toggle("sidebar--collapsed", state.sidebarCollapsed);
  icon.classList.toggle("rotated", state.sidebarCollapsed);
  main.style.marginLeft = state.sidebarCollapsed ? "var(--sidebar-collapsed)" : "";
}

function handleNavClick(view) {
  if (!VIEWS_WITH_ACTION.includes(view)) return;
  emit("nav:change", view);
}

export function initSidebar() {
  document.getElementById("collapseBtn")?.addEventListener("click", toggleCollapse);

  document.getElementById("sidebar")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".sidebar__item[data-view]");
    if (btn) handleNavClick(btn.dataset.view);
  });

  document.getElementById("bottomBar")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".bottom-bar__item[data-view]");
    if (btn) handleNavClick(btn.dataset.view);
  });
}
