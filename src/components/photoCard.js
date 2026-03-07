import { isFavorite, toggleFavorite } from "./favorites.js";
import { triggerDownload } from "../api.js";
import { emit } from "../events.js";

export function createPhotoCard(photo, index) {
  const ratio = photo.height / photo.width;
  const saved = isFavorite(photo.id);

  const card = document.createElement("article");
  card.className = "photo-card";
  card.style.animationDelay = `${(index % 30) * 0.03}s`;

  card.innerHTML = `
    <div class="photo-card__image-wrapper" style="padding-bottom:${ratio * 100}%;background-color:${photo.color || "#e0e0e0"}">
      <img src="${photo.urls.small}" alt="${photo.alt_description || "Foto de Unsplash"}" class="photo-card__image" loading="lazy" />
      <div class="photo-card__overlay">
        <button class="photo-card__save-btn ${saved ? "photo-card__save-btn--saved" : ""}" data-action="save">
          ${saved ? "Guardado" : "Guardar"}
        </button>
        <div class="photo-card__bottom-actions">
          <div class="photo-card__likes">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>${photo.likes}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="photo-card__action-circle" data-action="download" title="Descargar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <a class="photo-card__action-circle" href="${photo.links?.html || "#"}" target="_blank" rel="noopener noreferrer" title="Ver en Unsplash">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="photo-card__info">
      <a class="photo-card__user" href="https://unsplash.com/@${photo.user.username}" target="_blank" rel="noopener noreferrer">
        <img src="${photo.user.profile_image.medium}" alt="${photo.user.name}" class="photo-card__avatar" />
        <span class="photo-card__username">${photo.user.name}</span>
      </a>
    </div>
  `;

  bindCardEvents(card, photo);
  return card;
}

function bindCardEvents(card, photo) {
  const img = card.querySelector(".photo-card__image");
  img.addEventListener("load", () => img.classList.add("loaded"));

  card.querySelector(".photo-card__image-wrapper").addEventListener("click", (e) => {
    if (e.target.closest("[data-action]") || e.target.closest("a")) return;
    emit("photo:click", photo);
  });

  card.querySelector("[data-action='save']").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(photo);
    const btn = e.currentTarget;
    const nowSaved = isFavorite(photo.id);
    btn.textContent = nowSaved ? "Guardado" : "Guardar";
    btn.classList.toggle("photo-card__save-btn--saved", nowSaved);
  });

  card.querySelector("[data-action='download']").addEventListener("click", (e) => {
    e.stopPropagation();
    downloadPhoto(photo);
  });
}

export function downloadPhoto(photo) {
  triggerDownload(photo);
  const link = document.createElement("a");
  link.href = `${photo.urls.raw}&w=1920&dl=${photo.user.username}-unsplash.jpg`;
  link.download = `${photo.user.username}-unsplash.jpg`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
}
