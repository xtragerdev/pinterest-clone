import "./header.css";
import { emit } from "../../events.js";
import { createElement } from "../../utils/dom.js";
import {
  createHeartFilledIcon,
  createMoonIcon,
  createPinterestLogoIcon,
  createSearchIcon,
} from "../../utils/icons.js";

export function createHeader() {
  const logoButton = createElement("button", {
    className: "header__logo",
    id: "logoBtn",
    attrs: { "aria-label": "Volver al inicio" },
    children: [
      createPinterestLogoIcon({ className: "header__logo-icon" }),
      createElement("span", { className: "header__logo-text", text: "Pinterest" }),
    ],
  });

  const searchInput = createElement("input", {
    className: "header__search-input",
    id: "searchInput",
    attrs: {
      type: "text",
      placeholder: "Buscar imagenes...",
      "aria-label": "Buscar imagenes",
    },
  });

  const searchForm = createElement("form", {
    className: "header__search",
    id: "searchForm",
    children: [
      createElement("div", {
        className: "header__search-wrapper",
        children: [
          createSearchIcon({ className: "header__search-icon" }),
          searchInput,
        ],
      }),
    ],
  });

  const favoritesButton = createElement("button", {
    className: "header__action-btn header__fav-btn",
    id: "headerFavBtn",
    attrs: { "aria-label": "Ver favoritos", title: "Favoritos" },
    children: [
      createHeartFilledIcon(),
      createElement("span", {
        className: "header__badge",
        id: "headerBadge",
        text: "0",
        hidden: true,
      }),
    ],
  });

  const darkModeButton = createElement("button", {
    className: "header__action-btn",
    id: "darkModeBtn",
    attrs: { "aria-label": "Cambiar tema", title: "Modo oscuro" },
    children: [createMoonIcon({ id: "darkModeIcon" })],
  });

  return createElement("header", {
    className: "header",
    id: "header",
    children: [
      createElement("div", {
        className: "header__inner",
        children: [
          logoButton,
          searchForm,
          createElement("div", {
            className: "header__actions",
            children: [favoritesButton, darkModeButton],
          }),
        ],
      }),
    ],
  });
}

export function initHeader() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const logo = document.getElementById("logoBtn");
  const favoritesButton = document.getElementById("headerFavBtn");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    emit("search:submit", query);
    input.value = "";
  });

  logo?.addEventListener("click", () => emit("nav:change", "home"));
  favoritesButton?.addEventListener("click", () => emit("nav:change", "favorites"));
}
