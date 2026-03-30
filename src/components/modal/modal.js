import "./modal.css";
import { getRelatedPhotos } from "../../api.js";
import { clearElement, createElement } from "../../utils/dom.js";
import {
  createCalendarIcon,
  createCloseIcon,
  createDownloadIcon,
  createHeartFilledIcon,
  createImageSizeIcon,
  createLocationIcon,
} from "../../utils/icons.js";
import { isFavorite, toggleFavorite } from "../../services/favorites.js";
import { downloadPhoto } from "../photo-card/photoCard.js";

function getBackdrop() {
  return document.getElementById("modalBackdrop");
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createStat(icon, text) {
  return createElement("div", {
    className: "modal__stat",
    children: [icon, createElement("span", { text })],
  });
}

function updateModalSaveButton(button, saved) {
  if (!button) return;
  button.classList.toggle("modal__save-btn--saved", saved);
  clearElement(button);
  button.append(createHeartFilledIcon());
  button.append(createElement("span", { text: saved ? "Guardado" : "Guardar" }));
}

function buildDetailsContent(photo) {
  const saved = isFavorite(photo.id);
  const nodes = [];

  const saveButton = createElement("button", {
    className: `modal__save-btn ${saved ? "modal__save-btn--saved" : ""}`.trim(),
    id: "modalSaveBtn",
  });
  updateModalSaveButton(saveButton, saved);

  const downloadButton = createElement("button", {
    className: "modal__download-btn",
    id: "modalDownloadBtn",
    children: [createDownloadIcon(), createElement("span", { text: "Descargar" })],
  });

  nodes.push(
    createElement("div", {
      className: "modal__actions",
      children: [saveButton, downloadButton],
    })
  );

  nodes.push(
    createElement("a", {
      className: "modal__user",
      attrs: {
        href: `https://unsplash.com/@${photo.user.username}`,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      children: [
        createElement("img", {
          className: "modal__avatar",
          attrs: {
            src: photo.user.profile_image.large,
            alt: photo.user.name,
          },
        }),
        createElement("div", {
          className: "modal__user-info",
          children: [
            createElement("span", {
              className: "modal__user-name",
              text: photo.user.name,
            }),
            createElement("span", {
              className: "modal__user-handle",
              text: `@${photo.user.username}`,
            }),
          ],
        }),
      ],
    })
  );

  const description = photo.description || photo.alt_description;
  if (description) {
    nodes.push(createElement("p", { className: "modal__description", text: description }));
  }

  const stats = createElement("div", { className: "modal__stats" });
  stats.append(createStat(createHeartFilledIcon(), `${(photo.likes || 0).toLocaleString()} likes`));
  stats.append(createStat(createImageSizeIcon(), `${photo.width} x ${photo.height}`));
  stats.append(createStat(createCalendarIcon(), formatDate(photo.created_at)));

  if (photo.location?.name) {
    stats.append(createStat(createLocationIcon(), photo.location.name));
  }

  nodes.push(stats);

  nodes.push(
    createElement("section", {
      className: "modal__related",
      id: "modalRelated",
      hidden: true,
      children: [
        createElement("h3", { text: "Fotos relacionadas" }),
        createElement("div", { className: "modal__related-grid", id: "modalRelatedGrid" }),
      ],
    })
  );

  return nodes;
}

function bindModalEvents(photo) {
  document.getElementById("modalSaveBtn")?.addEventListener("click", () => {
    toggleFavorite(photo);
    updateModalSaveButton(document.getElementById("modalSaveBtn"), isFavorite(photo.id));
  });

  document.getElementById("modalDownloadBtn")?.addEventListener("click", () => {
    downloadPhoto(photo);
  });
}

async function loadRelated(photoId) {
  try {
    const related = await getRelatedPhotos(photoId);
    if (related.length === 0) return;

    const section = document.getElementById("modalRelated");
    const grid = document.getElementById("modalRelatedGrid");
    if (!section || !grid) return;

    section.hidden = false;
    clearElement(grid);

    related.slice(0, 9).forEach((photo) => {
      const button = createElement("button", {
        className: "modal__related-item",
        attrs: { type: "button", "aria-label": photo.alt_description || "Foto relacionada" },
        children: [
          createElement("img", {
            attrs: {
              src: photo.urls.small,
              alt: photo.alt_description || "Relacionada",
              loading: "lazy",
            },
          }),
        ],
      });

      button.addEventListener("click", () => openModal(photo));
      grid.append(button);
    });
  } catch {
    return;
  }
}

export function createModal() {
  return createElement("div", {
    className: "modal-backdrop",
    id: "modalBackdrop",
    children: [
      createElement("div", {
        className: "modal",
        id: "modal",
        children: [
          createElement("button", {
            className: "modal__close",
            id: "modalClose",
            attrs: { "aria-label": "Cerrar" },
            children: [createCloseIcon()],
          }),
          createElement("div", {
            className: "modal__content",
            children: [
              createElement("div", {
                className: "modal__image-section",
                children: [
                  createElement("img", {
                    className: "modal__image",
                    id: "modalImage",
                    attrs: { src: "", alt: "" },
                  }),
                ],
              }),
              createElement("div", {
                className: "modal__details",
                id: "modalDetails",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export function openModal(photo) {
  const backdrop = getBackdrop();
  const image = document.getElementById("modalImage");
  const details = document.getElementById("modalDetails");
  if (!backdrop || !image || !details) return;

  backdrop.classList.add("active");
  document.body.style.overflow = "hidden";

  image.src = photo.urls.regular;
  image.alt = photo.alt_description || "Foto de Unsplash";

  clearElement(details);
  buildDetailsContent(photo).forEach((node) => details.append(node));
  bindModalEvents(photo);
  loadRelated(photo.id);
}

export function closeModal() {
  const backdrop = getBackdrop();
  const image = document.getElementById("modalImage");
  const details = document.getElementById("modalDetails");

  backdrop?.classList.remove("active");
  document.body.style.overflow = "";

  if (image) {
    image.src = "";
    image.alt = "";
  }

  if (details) clearElement(details);
}

export function initModal() {
  const backdrop = getBackdrop();
  const closeButton = document.getElementById("modalClose");

  closeButton?.addEventListener("click", closeModal);

  backdrop?.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && backdrop?.classList.contains("active")) {
      closeModal();
    }
  });
}
