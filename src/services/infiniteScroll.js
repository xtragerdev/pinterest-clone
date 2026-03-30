import { emit } from "../events.js";
import { state } from "../state.js";

export function initInfiniteScroll() {
  const sentinel = document.getElementById("scrollSentinel");
  if (!sentinel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;

      const shouldLoad =
        entry.isIntersecting &&
        !state.loading &&
        !state.loadingMore &&
        state.hasMore &&
        state.activeView !== "favorites";

      if (shouldLoad) emit("scroll:bottom");
    },
    { threshold: 0.1 }
  );

  observer.observe(sentinel);
}
