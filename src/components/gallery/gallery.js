import "./gallery.css";
import { state } from "../../state.js";
import { clearElement, createElement } from "../../utils/dom.js";
import { createSpinner } from "../../utils/icons.js";
import { createPhotoCard } from "../photo-card/photoCard.js";

const SKEL_HEIGHTS = [200, 280, 180, 320, 240, 300, 220, 260, 190, 340, 250, 210];

function getGrid() {
  return document.getElementById("masonryGrid");
}

function getStatus() {
  return document.getElementById("galleryStatus");
}

function createSkeletonCard(index) {
  return createElement("article", {
    className: "skeleton-card",
    styles: { animationDelay: `${index * 0.05}s` },
    children: [
      createElement("div", {
        className: "skeleton-card__image",
        styles: { height: `${SKEL_HEIGHTS[index % SKEL_HEIGHTS.length]}px` },
      }),
      createElement("div", {
        className: "skeleton-card__info",
        children: [
          createElement("div", { className: "skeleton-card__avatar" }),
          createElement("div", { className: "skeleton-card__name" }),
        ],
      }),
    ],
  });
}

function showStatusMessage(message, isError = false) {
  const status = getStatus();
  if (!status) return;

  status.hidden = false;
  status.className = isError ? "gallery__status gallery__status--error" : "gallery__status";
  clearElement(status);
  status.append(createElement("p", { text: message }));
}

export function createGallerySection() {
  return createElement("section", {
    className: "gallery",
    id: "gallery",
    children: [
      createElement("div", { className: "gallery__masonry", id: "masonryGrid" }),
      createElement("div", { className: "gallery__status", id: "galleryStatus", hidden: true }),
      createElement("div", {
        className: "gallery__loading-more",
        id: "loadingMore",
        hidden: true,
        children: [createSpinner(), createElement("span", { text: "Cargando mas..." })],
      }),
    ],
  });
}

export function showSkeleton() {
  const grid = getGrid();
  const status = getStatus();
  if (!grid || !status) return;

  status.hidden = true;
  status.className = "gallery__status";
  clearElement(grid);

  Array.from({ length: 15 }, (_, index) => createSkeletonCard(index)).forEach((card) => {
    grid.append(card);
  });
}

export function renderGallery() {
  const grid = getGrid();
  const status = getStatus();
  if (!grid || !status) return;

  const photos = state.activeView === "favorites" ? state.favorites : state.photos;

  if (photos.length === 0 && !state.loading) {
    clearElement(grid);
    showStatusMessage(
      state.activeView === "favorites"
        ? "No tienes imagenes guardadas aun."
        : "No se encontraron imagenes. Prueba con otra busqueda."
    );
    return;
  }

  status.hidden = true;
  status.className = "gallery__status";
  clearElement(grid);

  photos.forEach((photo, index) => {
    grid.append(createPhotoCard(photo, index));
  });
}

export function appendPhotos(photos, startIndex) {
  const grid = getGrid();
  if (!grid) return;

  photos.forEach((photo, index) => {
    grid.append(createPhotoCard(photo, startIndex + index));
  });
}

export function showError(message) {
  const grid = getGrid();
  if (grid) clearElement(grid);
  showStatusMessage(message, true);
}

export function showLoadingMore(visible) {
  const element = document.getElementById("loadingMore");
  if (element) element.hidden = !visible;
}

export function updateSearchLabel() {
  const label = document.getElementById("searchLabel");
  const text = document.getElementById("searchLabelText");
  if (!label || !text) return;

  clearElement(text);

  if (state.activeView === "favorites") {
    label.hidden = false;
    text.append("Tus guardados ");
    text.append(createElement("span", { text: `${state.favorites.length} imagenes` }));
    return;
  }

  if (state.searchTerm) {
    label.hidden = false;
    text.append("Resultados para: ");
    text.append(createElement("span", { text: state.searchTerm }));
    return;
  }

  label.hidden = true;
}
