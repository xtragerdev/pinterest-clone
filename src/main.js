import "./styles/base.css";
import { getPhotos, searchPhotos } from "./api.js";
import { createApp } from "./components/app/app.js";
import { initBackToTop } from "./components/back-to-top/backToTop.js";
import {
  appendPhotos,
  renderGallery,
  showError,
  showLoadingMore,
  showSkeleton,
  updateSearchLabel,
} from "./components/gallery/gallery.js";
import { initHeader } from "./components/header/header.js";
import { initModal, openModal } from "./components/modal/modal.js";
import { initSidebar, setActiveNav } from "./components/sidebar/sidebar.js";
import { initTopics, updateActiveTopic } from "./components/topics/topics.js";
import { on } from "./events.js";
import { loadFavorites, updateBadges } from "./services/favorites.js";
import { initInfiniteScroll } from "./services/infiniteScroll.js";
import { initDarkMode } from "./services/theme.js";
import { state } from "./state.js";

const PER_PAGE = 30;

function mountApp() {
  const app = document.getElementById("app");
  app.replaceChildren(createApp());
}

function resetFeedState(searchTerm = null) {
  state.loading = true;
  state.searchTerm = searchTerm;
  state.page = 1;
  state.hasMore = true;
}

async function loadFeed({ view, searchTerm = null, request, errorMessage }) {
  resetFeedState(searchTerm);
  setActiveNav(view);
  updateSearchLabel();
  updateActiveTopic();
  showSkeleton();
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    state.photos = await request(1, PER_PAGE);
    state.hasMore = state.photos.length === PER_PAGE;
    state.loading = false;
    renderGallery();
  } catch (error) {
    showError(error instanceof Error ? error.message : errorMessage);
  } finally {
    state.loading = false;
  }
}

async function goHome() {
  await loadFeed({
    view: "home",
    request: getPhotos,
    errorMessage: "Error al cargar las imagenes. Intentalo de nuevo.",
  });
}

async function doSearch(query) {
  await loadFeed({
    view: "explore",
    searchTerm: query,
    request: (page, perPage) => searchPhotos(query, page, perPage),
    errorMessage: "Error en la busqueda. Intentalo de nuevo.",
  });
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
      ? await searchPhotos(state.searchTerm, nextPage, PER_PAGE)
      : await getPhotos(nextPage, PER_PAGE);

    const existingIds = new Set(state.photos.map((photo) => photo.id));
    const unique = data.filter((photo) => !existingIds.has(photo.id));
    const startIndex = state.photos.length;

    state.photos.push(...unique);
    state.page = nextPage;
    state.hasMore = data.length === PER_PAGE;
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
    case "home":
      goHome();
      break;
    case "explore":
      doSearch("trending");
      break;
    case "favorites":
      showFavorites();
      break;
  }
});

on("search:submit", (query) => doSearch(query));
on("scroll:bottom", () => loadMore());
on("photo:click", (photo) => openModal(photo));
on("favorites:changed", () => {
  updateBadges();
  if (state.activeView === "favorites") renderGallery();
});

mountApp();
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
