import { emit } from "../events.js";
import { state } from "../state.js";

const STORAGE_KEY = "pinterest_favorites";

export function loadFavorites() {
  try {
    state.favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    state.favorites = [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
}

export function isFavorite(id) {
  return state.favorites.some((favorite) => favorite.id === id);
}

export function toggleFavorite(photo) {
  if (isFavorite(photo.id)) {
    state.favorites = state.favorites.filter((favorite) => favorite.id !== photo.id);
  } else {
    state.favorites.push(photo);
  }

  saveFavorites();
  emit("favorites:changed");
}

export function updateBadges() {
  const count = state.favorites.length;
  const shouldShow = count > 0;

  [document.getElementById("headerBadge"), document.getElementById("sidebarBadge"), document.getElementById("bottomBadge")]
    .forEach((badge) => {
      if (!badge) return;
      badge.textContent = String(count);
      badge.hidden = !shouldShow;
    });
}
