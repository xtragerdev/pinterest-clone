import "./style.css";
import { state } from "./state.js";
import { on } from "./events.js";
import { getPhotos, searchPhotos } from "./api.js";

import { loadFavorites, updateBadges } from "./components/favorites.js";
import { initDarkMode } from "./components/darkMode.js";
import { setActiveNav, initSidebar } from "./components/sidebar.js";
import { initHeader } from "./components/header.js";
import { updateActiveTopic, initTopics } from "./components/topics.js";
import {
  showSkeleton,
  renderGallery,
  appendPhotos,
  showError,
  showLoadingMore,
  updateSearchLabel,
} from "./components/gallery.js";
import { openModal, initModal } from "./components/modal.js";
import { initBackToTop } from "./components/backToTop.js";
import { initInfiniteScroll } from "./components/infiniteScroll.js";

async function goHome() {
  state.loading = true;
  state.searchTerm = null;
  state.page = 1;
  state.hasMore = true;
  setActiveNav("home");
  updateSearchLabel();
  updateActiveTopic();
  showSkeleton();
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    state.photos = await getPhotos(1, 30);
    state.hasMore = state.photos.length === 30;
    renderGallery();
  } catch {
    showError("Error al cargar las imágenes. Inténtalo de nuevo.");
  } finally {
    state.loading = false;
  }
}

async function doSearch(query) {
  state.loading = true;
  state.searchTerm = query;
  state.page = 1;
  state.hasMore = true;
  setActiveNav("explore");
  updateSearchLabel();
  updateActiveTopic();
  showSkeleton();
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    state.photos = await searchPhotos(query, 1, 30);
    state.hasMore = state.photos.length === 30;
    renderGallery();
  } catch {
    showError("Error en la búsqueda. Inténtalo de nuevo.");
  } finally {
    state.loading = false;
  }
}

function showFavorites() {
  setActiveNav("favorites");
  state.searchTerm = null;
  state.loading = false;
  updateSearchLabel();
  updateActiveTopic();
  renderGallery();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadMore() {
  if (state.loadingMore || !state.hasMore || state.activeView === "favorites") return;

  state.loadingMore = true;
  showLoadingMore(true);
  const nextPage = state.page + 1;

  try {
    const data = state.searchTerm
      ? await searchPhotos(state.searchTerm, nextPage, 30)
      : await getPhotos(nextPage, 30);

    const existingIds = new Set(state.photos.map((p) => p.id));
    const unique = data.filter((p) => !existingIds.has(p.id));
    const startIndex = state.photos.length;

    state.photos.push(...unique);
    state.page = nextPage;
    state.hasMore = data.length === 30;
    appendPhotos(unique, startIndex);
  } catch {
    state.hasMore = false;
  } finally {
    state.loadingMore = false;
    showLoadingMore(false);
  }
}

on("nav:change", (view) => {
  switch (view) {
    case "home": goHome(); break;
    case "explore": doSearch("trending"); break;
    case "favorites": showFavorites(); break;
  }
});

on("search:submit", (query) => doSearch(query));
on("scroll:bottom", () => loadMore());
on("photo:click", (photo) => openModal(photo));
on("favorites:changed", () => {
  updateBadges();
  if (state.activeView === "favorites") renderGallery();
});

loadFavorites();
initDarkMode();
initSidebar();
initHeader();
initTopics();
initModal();
initBackToTop();
initInfiniteScroll();
updateBadges();
goHome();
