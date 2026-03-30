import "./app.css";
import { createElement } from "../../utils/dom.js";
import { createBackToTop } from "../back-to-top/backToTop.js";
import { createGallerySection } from "../gallery/gallery.js";
import { createHeader } from "../header/header.js";
import { createModal } from "../modal/modal.js";
import { createSidebar, createBottomBar } from "../sidebar/sidebar.js";
import { createTopics } from "../topics/topics.js";

function createSearchLabel() {
  const heading = createElement("h2", { id: "searchLabelText" });
  return createElement("section", {
    className: "app__search-label",
    id: "searchLabel",
    hidden: true,
    children: [heading],
  });
}

function createMainContent() {
  return createElement("main", {
    className: "app__main",
    id: "appMain",
    children: [
      createHeader(),
      createTopics(),
      createSearchLabel(),
      createGallerySection(),
      createElement("div", {
        id: "scrollSentinel",
        className: "app__sentinel",
        attrs: { "aria-hidden": "true" },
      }),
    ],
  });
}

export function createApp() {
  return createElement("div", {
    className: "app-shell",
    children: [
      createSidebar(),
      createBottomBar(),
      createMainContent(),
      createModal(),
      createBackToTop(),
    ],
  });
}
