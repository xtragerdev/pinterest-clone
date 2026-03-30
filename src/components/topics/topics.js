import "./topics.css";
import { emit } from "../../events.js";
import { state } from "../../state.js";
import { clearElement, createElement } from "../../utils/dom.js";

const TOPICS = [
  "Naturaleza",
  "Arquitectura",
  "Animales",
  "Comida",
  "Viajes",
  "Tecnologia",
  "Arte",
  "Moda",
  "Deportes",
  "Musica",
  "Coches",
  "Flores",
  "Montanas",
  "Playa",
  "Ciudad",
];

export function createTopics() {
  return createElement("section", {
    className: "topics",
    id: "topics",
    children: [createElement("div", { className: "topics__scroll", id: "topicsScroll" })],
  });
}

export function updateActiveTopic() {
  document.querySelectorAll(".topics__pill").forEach((pill) => {
    pill.classList.toggle("topics__pill--active", pill.dataset.topic === state.searchTerm);
  });
}

export function initTopics() {
  const container = document.getElementById("topicsScroll");
  if (!container) return;

  clearElement(container);
  TOPICS.forEach((topic) => {
    container.append(
      createElement("button", {
        className: "topics__pill",
        dataset: { topic },
        text: topic,
      })
    );
  });

  container.addEventListener("click", (event) => {
    const pill = event.target.closest(".topics__pill");
    if (pill) emit("search:submit", pill.dataset.topic);
  });
}
