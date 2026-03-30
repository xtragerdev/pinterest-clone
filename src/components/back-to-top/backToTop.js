import "./backToTop.css";
import { createElement } from "../../utils/dom.js";
import { createArrowUpIcon } from "../../utils/icons.js";

export function createBackToTop() {
  return createElement("button", {
    className: "back-to-top",
    id: "backToTop",
    attrs: { "aria-label": "Volver arriba" },
    children: [createArrowUpIcon()],
  });
}

export function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  window.addEventListener(
    "scroll",
    () => {
      button.classList.toggle("back-to-top--visible", window.scrollY > 600);
    },
    { passive: true }
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
