import { state } from "../state.js";
import { emit } from "../events.js";

const STORAGE_KEY = "pinterest_favorites";

export function loadFavorites() {
  try {
    state.favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    state.favorites = [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
}

export function isFavorite(id) {
  return state.favorites.some((f) => f.id === id);
}

export function toggleFavorite(photo) {
  if (isFavorite(photo.id)) {
    state.favorites = state.favorites.filter((f) => f.id !== photo.id);
  } else {
    state.favorites.push(photo);
  }
  save();
  emit("favorites:changed");
}

export function updateBadges() {
  const count = state.favorites.length;
  const show = count > 0;
  const badges = [
    document.getElementById("headerBadge"),
    document.getElementById("sidebarBadge"),
    document.getElementById("bottomBadge"),
  ];
  badges.forEach((badge) => {
    if (!badge) return;
    badge.textContent = count;
    badge.hidden = !show;
  });
}
