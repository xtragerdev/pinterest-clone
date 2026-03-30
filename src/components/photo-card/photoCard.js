import "./photoCard.css";
import { triggerDownload } from "../../api.js";
import { emit } from "../../events.js";
import { createElement } from "../../utils/dom.js";
import {
  createDownloadIcon,
  createExternalLinkIcon,
  createHeartFilledIcon,
} from "../../utils/icons.js";
import { isFavorite, toggleFavorite } from "../../services/favorites.js";

function updateSaveButton(button, saved) {
  button.textContent = saved ? "Guardado" : "Guardar";
  button.classList.toggle("photo-card__save-btn--saved", saved);
}

function buildDownloadUrl(photo) {
  const downloadUrl = new URL(photo.urls.raw);
  downloadUrl.searchParams.set("w", "1920");
  downloadUrl.searchParams.set("dl", `${photo.user.username}-unsplash.jpg`);
  return downloadUrl.toString();
}

function bindCardEvents(card, photo) {
  const image = card.querySelector(".photo-card__image");
  const imageWrapper = card.querySelector(".photo-card__image-wrapper");
  const saveButton = card.querySelector("[data-action='save']");
  const downloadButton = card.querySelector("[data-action='download']");

  const markAsLoaded = () => image.classList.add("loaded");
  image.addEventListener("load", markAsLoaded);
  if (image.complete) markAsLoaded();

  imageWrapper.addEventListener("click", (event) => {
    if (event.target.closest("[data-action]") || event.target.closest("a")) return;
    emit("photo:click", photo);
  });

  saveButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(photo);
    updateSaveButton(saveButton, isFavorite(photo.id));
  });

  downloadButton.addEventListener("click", (event) => {
    event.stopPropagation();
    downloadPhoto(photo);
  });
}

export function createPhotoCard(photo, index) {
  const ratio = photo.height / photo.width;
  const saved = isFavorite(photo.id);

  const saveButton = createElement("button", {
    className: `photo-card__save-btn ${saved ? "photo-card__save-btn--saved" : ""}`.trim(),
    dataset: { action: "save" },
    text: saved ? "Guardado" : "Guardar",
  });

  const image = createElement("img", {
    className: "photo-card__image",
    attrs: {
      src: photo.urls.small,
      alt: photo.alt_description || "Foto de Unsplash",
      loading: "lazy",
    },
  });

  const actionGroup = createElement("div", {
    className: "photo-card__action-group",
    children: [
      createElement("button", {
        className: "photo-card__action-circle",
        dataset: { action: "download" },
        attrs: { title: "Descargar", "aria-label": "Descargar" },
        children: [createDownloadIcon()],
      }),
      createElement("a", {
        className: "photo-card__action-circle",
        attrs: {
          href: photo.links?.html || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Ver en Unsplash",
          "aria-label": "Ver en Unsplash",
        },
        children: [createExternalLinkIcon()],
      }),
    ],
  });

  const card = createElement("article", {
    className: "photo-card",
    styles: { animationDelay: `${(index % 30) * 0.03}s` },
    children: [
      createElement("div", {
        className: "photo-card__image-wrapper",
        styles: {
          paddingBottom: `${ratio * 100}%`,
          backgroundColor: photo.color || "#e0e0e0",
        },
        children: [
          image,
          createElement("div", {
            className: "photo-card__overlay",
            children: [
              saveButton,
              createElement("div", {
                className: "photo-card__bottom-actions",
                children: [
                  createElement("div", {
                    className: "photo-card__likes",
                    children: [
                      createHeartFilledIcon(),
                      createElement("span", { text: String(photo.likes || 0) }),
                    ],
                  }),
                  actionGroup,
                ],
              }),
            ],
          }),
        ],
      }),
      createElement("div", {
        className: "photo-card__info",
        children: [
          createElement("a", {
            className: "photo-card__user",
            attrs: {
              href: `https://unsplash.com/@${photo.user.username}`,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            children: [
              createElement("img", {
                className: "photo-card__avatar",
                attrs: {
                  src: photo.user.profile_image.medium,
                  alt: photo.user.name,
                  loading: "lazy",
                },
              }),
              createElement("span", {
                className: "photo-card__username",
                text: photo.user.name,
              }),
            ],
          }),
        ],
      }),
    ],
  });

  bindCardEvents(card, photo);
  return card;
}

export function downloadPhoto(photo) {
  triggerDownload(photo);

  const link = document.createElement("a");
  link.href = buildDownloadUrl(photo);
  link.download = `${photo.user.username}-unsplash.jpg`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
}
