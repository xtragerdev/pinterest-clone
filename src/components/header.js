import { emit } from "../events.js";

export function initHeader() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const logo = document.getElementById("logoBtn");
  const favBtn = document.getElementById("headerFavBtn");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    emit("search:submit", query);
    input.value = "";
  });

  logo?.addEventListener("click", () => emit("nav:change", "home"));
  favBtn?.addEventListener("click", () => emit("nav:change", "favorites"));
}
