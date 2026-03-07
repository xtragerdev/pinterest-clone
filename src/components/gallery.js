import { state } from "../state.js";
import { createPhotoCard } from "./photoCard.js";

const SKEL_HEIGHTS = [200, 280, 180, 320, 240, 300, 220, 260, 190, 340, 250, 210];

function getGrid() {
  return document.getElementById("masonryGrid");
}

function getStatus() {
  return document.getElementById("galleryStatus");
}

export function showSkeleton() {
  const grid = getGrid();
  const status = getStatus();

  status.hidden = true;
  grid.innerHTML = Array.from({ length: 15 }, (_, i) => `
    <div class="skeleton-card" style="animation-delay:${i * 0.05}s">
      <div class="skeleton-card__image" style="height:${SKEL_HEIGHTS[i % SKEL_HEIGHTS.length]}px"></div>
      <div class="skeleton-card__info">
        <div class="skeleton-card__avatar"></div>
        <div class="skeleton-card__name"></div>
      </div>
    </div>
  `).join("");
}

export function renderGallery() {
  const grid = getGrid();
  const status = getStatus();
  const photos = state.activeView === "favorites" ? state.favorites : state.photos;

  if (photos.length === 0 && !state.loading) {
    grid.innerHTML = "";
    status.hidden = false;
    status.innerHTML = state.activeView === "favorites"
      ? "<p>No tienes imágenes guardadas aún.</p>"
      : "<p>No se encontraron imágenes. Prueba con otra búsqueda.</p>";
    return;
  }

  status.hidden = true;
  grid.innerHTML = "";
  photos.forEach((photo, i) => grid.appendChild(createPhotoCard(photo, i)));
}

export function appendPhotos(photos, startIndex) {
  const grid = getGrid();
  photos.forEach((photo, i) => grid.appendChild(createPhotoCard(photo, startIndex + i)));
}

export function showError(message) {
  const grid = getGrid();
  const status = getStatus();

  grid.innerHTML = "";
  status.hidden = false;
  status.className = "gallery__status gallery__status--error";
  status.innerHTML = `<p>${message}</p>`;
}

export function showLoadingMore(visible) {
  const el = document.getElementById("loadingMore");
  if (el) el.hidden = !visible;
}

export function updateSearchLabel() {
  const label = document.getElementById("searchLabel");
  const text = document.getElementById("searchLabelText");
  if (!label || !text) return;

  if (state.activeView === "favorites") {
    label.hidden = false;
    text.innerHTML = `Tus guardados <span>${state.favorites.length} imágenes</span>`;
  } else if (state.searchTerm) {
    label.hidden = false;
    text.innerHTML = `Resultados para: <span>${state.searchTerm}</span>`;
  } else {
    label.hidden = true;
  }
}
