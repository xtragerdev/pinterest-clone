import "./sidebar.css";
import { emit } from "../../events.js";
import { state } from "../../state.js";
import { createElement } from "../../utils/dom.js";
import {
  createBellIcon,
  createBookmarkIcon,
  createChevronLeftIcon,
  createCompassIcon,
  createHomeIcon,
  createMessageIcon,
} from "../../utils/icons.js";

const NAV_ITEMS = [
  { view: "home", label: "Inicio", icon: createHomeIcon },
  { view: "explore", label: "Explorar", icon: createCompassIcon },
  { view: "favorites", label: "Guardados", icon: createBookmarkIcon, badgeId: "sidebarBadge" },
  { view: "messages", label: "Mensajes", icon: createMessageIcon },
  { view: "notifications", label: "Notificaciones", icon: createBellIcon },
];

const MOBILE_ITEMS = [
  { view: "home", label: "Inicio", icon: createHomeIcon },
  { view: "explore", label: "Explorar", icon: createCompassIcon },
  { view: "favorites", label: "Guardados", icon: createBookmarkIcon, badgeId: "bottomBadge" },
  { view: "notifications", label: "Notificaciones", icon: createBellIcon },
];

const VIEWS_WITH_ACTION = ["home", "explore", "favorites"];

function createNavItem({ view, label, icon, badgeId }, itemClassName, activeClassName) {
  const iconWrapper = createElement("span", {
    className: itemClassName.includes("bottom-bar") ? "bottom-bar__icon" : "sidebar__icon",
    children: [icon()],
  });

  if (badgeId) {
    iconWrapper.append(
      createElement("span", {
        className: itemClassName.includes("bottom-bar") ? "bottom-bar__badge" : "sidebar__badge",
        id: badgeId,
        text: "0",
        hidden: true,
      })
    );
  }

  return createElement("button", {
    className: `${itemClassName} ${view === "home" ? activeClassName : ""}`.trim(),
    dataset: { view },
    attrs: { title: label, "aria-label": label },
    children: [
      iconWrapper,
      createElement("span", {
        className: itemClassName.includes("bottom-bar") ? "bottom-bar__label" : "sidebar__label",
        text: label,
      }),
    ],
  });
}

export function createSidebar() {
  const list = createElement("ul", { className: "sidebar__list" });

  NAV_ITEMS.forEach((item) => {
    list.append(createElement("li", {
      children: [createNavItem(item, "sidebar__item", "sidebar__item--active")],
    }));
  });

  const collapseIcon = createChevronLeftIcon({
    id: "collapseIcon",
    className: "sidebar__collapse-icon",
  });

  const collapseButton = createElement("button", {
    className: "sidebar__item sidebar__collapse-btn",
    id: "collapseBtn",
    attrs: { title: "Colapsar menu", "aria-label": "Colapsar menu" },
    children: [
      createElement("span", {
        className: "sidebar__icon",
        children: [collapseIcon],
      }),
      createElement("span", { className: "sidebar__label", text: "Colapsar" }),
    ],
  });

  return createElement("aside", {
    className: "sidebar",
    id: "sidebar",
    children: [
      createElement("nav", {
        className: "sidebar__nav",
        children: [list],
      }),
      createElement("div", {
        className: "sidebar__bottom",
        children: [collapseButton],
      }),
    ],
  });
}

export function createBottomBar() {
  const nav = createElement("nav", {
    className: "bottom-bar",
    id: "bottomBar",
    attrs: { "aria-label": "Navegacion movil" },
  });

  MOBILE_ITEMS.forEach((item) => {
    nav.append(createNavItem(item, "bottom-bar__item", "bottom-bar__item--active"));
  });

  return nav;
}

export function setActiveNav(view) {
  state.activeView = view;

  document.querySelectorAll(".sidebar__item[data-view]").forEach((button) => {
    button.classList.toggle("sidebar__item--active", button.dataset.view === view);
  });

  document.querySelectorAll(".bottom-bar__item[data-view]").forEach((button) => {
    button.classList.toggle("bottom-bar__item--active", button.dataset.view === view);
  });
}

function toggleCollapse() {
  state.sidebarCollapsed = !state.sidebarCollapsed;

  const sidebar = document.getElementById("sidebar");
  const icon = document.getElementById("collapseIcon");

  sidebar?.classList.toggle("sidebar--collapsed", state.sidebarCollapsed);
  icon?.classList.toggle("rotated", state.sidebarCollapsed);
  document.body.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
}

function handleNavClick(view) {
  if (!VIEWS_WITH_ACTION.includes(view)) return;
  emit("nav:change", view);
}

export function initSidebar() {
  document.getElementById("collapseBtn")?.addEventListener("click", toggleCollapse);

  document.getElementById("sidebar")?.addEventListener("click", (event) => {
    const button = event.target.closest(".sidebar__item[data-view]");
    if (button) handleNavClick(button.dataset.view);
  });

  document.getElementById("bottomBar")?.addEventListener("click", (event) => {
    const button = event.target.closest(".bottom-bar__item[data-view]");
    if (button) handleNavClick(button.dataset.view);
  });
}
