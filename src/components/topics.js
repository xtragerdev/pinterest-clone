import { state } from "../state.js";
import { emit } from "../events.js";

const TOPICS = [
  "Naturaleza", "Arquitectura", "Animales", "Comida", "Viajes",
  "Tecnología", "Arte", "Moda", "Deportes", "Música",
  "Coches", "Flores", "Montañas", "Playa", "Ciudad",
];

export function updateActiveTopic() {
  document.querySelectorAll(".topics__pill").forEach((pill) => {
    pill.classList.toggle("topics__pill--active", pill.dataset.topic === state.searchTerm);
  });
}

export function initTopics() {
  const container = document.getElementById("topicsScroll");
  if (!container) return;

  container.innerHTML = TOPICS.map(
    (t) => `<button class="topics__pill" data-topic="${t}">${t}</button>`
  ).join("");

  container.addEventListener("click", (e) => {
    const pill = e.target.closest(".topics__pill");
    if (pill) emit("search:submit", pill.dataset.topic);
  });
}
