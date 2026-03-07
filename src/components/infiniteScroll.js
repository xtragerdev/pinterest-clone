import { state } from "../state.js";
import { emit } from "../events.js";

export function initInfiniteScroll() {
  const sentinel = document.getElementById("scrollSentinel");
  if (!sentinel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const shouldLoad =
        entries[0].isIntersecting &&
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
