import { isFavorite, toggleFavorite } from "./favorites.js";
import { downloadPhoto } from "./photoCard.js";
import { getRelatedPhotos } from "../api.js";
import { emit } from "../events.js";

function getBackdrop() {
  return document.getElementById("modalBackdrop");
}

export function openModal(photo) {
  const backdrop = getBackdrop();
  const image = document.getElementById("modalImage");
  const details = document.getElementById("modalDetails");

  backdrop.classList.add("active");
  document.body.style.overflow = "hidden";

  image.src = photo.urls.regular;
  image.alt = photo.alt_description || "Foto de Unsplash";

  details.innerHTML = buildDetailsHTML(photo);
  bindModalEvents(photo);
  loadRelatedPhotos(photo.id);
}

export function closeModal() {
  const backdrop = getBackdrop();
  backdrop.classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("modalImage").src = "";
}

function buildDetailsHTML(photo) {
  const saved = isFavorite(photo.id);
  const desc = photo.description || photo.alt_description || "";
  const date = new Date(photo.created_at).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });

  return `
    <div class="modal__actions">
      <button class="modal__save-btn ${saved ? "modal__save-btn--saved" : ""}" id="modalSaveBtn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        ${saved ? "Guardado" : "Guardar"}
      </button>
      <button class="modal__download-btn" id="modalDownloadBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Descargar
      </button>
    </div>
    <a class="modal__user" href="https://unsplash.com/@${photo.user.username}" target="_blank" rel="noopener noreferrer">
      <img src="${photo.user.profile_image.large}" alt="${photo.user.name}" class="modal__avatar" />
      <div class="modal__user-info">
        <span class="modal__user-name">${photo.user.name}</span>
        <span class="modal__user-handle">@${photo.user.username}</span>
      </div>
    </a>
    ${desc ? `<p class="modal__description">${desc}</p>` : ""}
    <div class="modal__stats">
      <div class="modal__stat">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <span>${(photo.likes || 0).toLocaleString()} likes</span>
      </div>
      <div class="modal__stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span>${photo.width} x ${photo.height}</span>
      </div>
      <div class="modal__stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>${date}</span>
      </div>
      ${photo.location?.name ? `
      <div class="modal__stat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${photo.location.name}</span>
      </div>` : ""}
    </div>
    <div class="modal__related" id="modalRelated" hidden>
      <h3>Fotos relacionadas</h3>
      <div class="modal__related-grid" id="modalRelatedGrid"></div>
    </div>
  `;
}

function bindModalEvents(photo) {
  document.getElementById("modalSaveBtn")?.addEventListener("click", () => {
    toggleFavorite(photo);
    const btn = document.getElementById("modalSaveBtn");
    const nowSaved = isFavorite(photo.id);
    btn.classList.toggle("modal__save-btn--saved", nowSaved);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      ${nowSaved ? "Guardado" : "Guardar"}
    `;
  });

  document.getElementById("modalDownloadBtn")?.addEventListener("click", () => {
    downloadPhoto(photo);
  });
}

async function loadRelatedPhotos(photoId) {
  try {
    const related = await getRelatedPhotos(photoId);
    if (related.length === 0) return;

    const section = document.getElementById("modalRelated");
    const grid = document.getElementById("modalRelatedGrid");
    if (!section || !grid) return;

    section.hidden = false;
    const items = related.slice(0, 9);

    grid.innerHTML = items.map((r) => `
      <div class="modal__related-item">
        <img src="${r.urls.small}" alt="${r.alt_description || "Relacionada"}" loading="lazy" />
      </div>
    `).join("");

    grid.querySelectorAll(".modal__related-item").forEach((item, i) => {
      item.addEventListener("click", () => openModal(items[i]));
    });
  } catch { }
}

export function initModal() {
  const backdrop = getBackdrop();
  const closeBtn = document.getElementById("modalClose");

  closeBtn?.addEventListener("click", closeModal);

  backdrop?.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("active")) closeModal();
  });
}
