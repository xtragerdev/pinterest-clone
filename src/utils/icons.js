import { createElement } from "./dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgNode(tagName, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tagName);

  Object.entries(attrs).forEach(([name, value]) => {
    node.setAttribute(name, String(value));
  });

  return node;
}

function createSvgIcon(baseAttrs, children) {
  const svg = createSvgNode("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    ...baseAttrs,
  });

  children.forEach(({ tag, attrs }) => {
    svg.append(createSvgNode(tag, attrs));
  });

  return svg;
}

function cloneIcon(factory, options = {}) {
  const icon = factory();

  if (options.id) icon.id = options.id;
  if (options.className) icon.setAttribute("class", options.className);
  if (options.title) icon.setAttribute("aria-label", options.title);

  return icon;
}

export function createHomeIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" } },
        { tag: "polyline", attrs: { points: "9 22 9 12 15 12 15 22" } },
      ]),
    options
  );
}

export function createCompassIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "circle", attrs: { cx: "12", cy: "12", r: "10" } },
        { tag: "polygon", attrs: { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" } },
      ]),
    options
  );
}

export function createBookmarkIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" } },
      ]),
    options
  );
}

export function createMessageIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" } },
      ]),
    options
  );
}

export function createBellIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" } },
        { tag: "path", attrs: { d: "M13.73 21a2 2 0 0 1-3.46 0" } },
      ]),
    options
  );
}

export function createChevronLeftIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [{ tag: "polyline", attrs: { points: "15 18 9 12 15 6" } }]),
    options
  );
}

export function createSearchIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "circle", attrs: { cx: "11", cy: "11", r: "8" } },
        { tag: "line", attrs: { x1: "21", y1: "21", x2: "16.65", y2: "16.65" } },
      ]),
    options
  );
}

export function createHeartFilledIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon(
        {
          fill: "currentColor",
          stroke: "none",
        },
        [
          {
            tag: "path",
            attrs: {
              d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
            },
          },
        ]
      ),
    options
  );
}

export function createMoonIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon(
        {
          fill: "currentColor",
          stroke: "none",
        },
        [{ tag: "path", attrs: { d: "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" } }]
      ),
    options
  );
}

export function createSunIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "circle", attrs: { cx: "12", cy: "12", r: "5" } },
        { tag: "line", attrs: { x1: "12", y1: "1", x2: "12", y2: "3" } },
        { tag: "line", attrs: { x1: "12", y1: "21", x2: "12", y2: "23" } },
        { tag: "line", attrs: { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" } },
        { tag: "line", attrs: { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" } },
        { tag: "line", attrs: { x1: "1", y1: "12", x2: "3", y2: "12" } },
        { tag: "line", attrs: { x1: "21", y1: "12", x2: "23", y2: "12" } },
        { tag: "line", attrs: { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" } },
        { tag: "line", attrs: { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" } },
      ]),
    options
  );
}

export function createDownloadIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" } },
        { tag: "polyline", attrs: { points: "7 10 12 15 17 10" } },
        { tag: "line", attrs: { x1: "12", y1: "15", x2: "12", y2: "3" } },
      ]),
    options
  );
}

export function createExternalLinkIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" } },
        { tag: "polyline", attrs: { points: "15 3 21 3 21 9" } },
        { tag: "line", attrs: { x1: "10", y1: "14", x2: "21", y2: "3" } },
      ]),
    options
  );
}

export function createCloseIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({ "stroke-width": "2.5" }, [
        { tag: "line", attrs: { x1: "18", y1: "6", x2: "6", y2: "18" } },
        { tag: "line", attrs: { x1: "6", y1: "6", x2: "18", y2: "18" } },
      ]),
    options
  );
}

export function createImageSizeIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "rect", attrs: { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" } },
        { tag: "circle", attrs: { cx: "8.5", cy: "8.5", r: "1.5" } },
        { tag: "polyline", attrs: { points: "21 15 16 10 5 21" } },
      ]),
    options
  );
}

export function createCalendarIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "rect", attrs: { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" } },
        { tag: "line", attrs: { x1: "16", y1: "2", x2: "16", y2: "6" } },
        { tag: "line", attrs: { x1: "8", y1: "2", x2: "8", y2: "6" } },
        { tag: "line", attrs: { x1: "3", y1: "10", x2: "21", y2: "10" } },
      ]),
    options
  );
}

export function createLocationIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({}, [
        { tag: "path", attrs: { d: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" } },
        { tag: "circle", attrs: { cx: "12", cy: "10", r: "3" } },
      ]),
    options
  );
}

export function createArrowUpIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon({ "stroke-width": "2.5" }, [{ tag: "polyline", attrs: { points: "18 15 12 9 6 15" } }]),
    options
  );
}

export function createSpinner() {
  return createElement("div", { className: "gallery__spinner" });
}

export function createPinterestLogoIcon(options) {
  return cloneIcon(
    () =>
      createSvgIcon(
        {
          viewBox: "0 0 24 24",
          fill: "currentColor",
          stroke: "none",
        },
        [
          {
            tag: "path",
            attrs: {
              d: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
            },
          },
        ]
      ),
    options
  );
}
