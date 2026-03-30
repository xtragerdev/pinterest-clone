export function createElement(tagName, options = {}) {
  const {
    id,
    className,
    text,
    type,
    value,
    hidden,
    styles,
    attrs,
    dataset,
    children,
  } = options;

  const element = document.createElement(tagName);

  if (id) element.id = id;
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  if (type) element.type = type;
  if (value !== undefined) element.value = value;
  if (hidden !== undefined) element.hidden = hidden;

  if (styles) {
    Object.entries(styles).forEach(([property, propertyValue]) => {
      element.style[property] = propertyValue;
    });
  }

  if (attrs) {
    Object.entries(attrs).forEach(([name, attributeValue]) => {
      if (attributeValue !== undefined && attributeValue !== null) {
        element.setAttribute(name, String(attributeValue));
      }
    });
  }

  if (dataset) {
    Object.entries(dataset).forEach(([name, dataValue]) => {
      element.dataset[name] = dataValue;
    });
  }

  if (children) {
    appendChildren(element, children);
  }

  return element;
}

export function appendChildren(parent, children) {
  const childList = Array.isArray(children) ? children : [children];

  childList.forEach((child) => {
    if (child === null || child === undefined || child === false) return;

    if (typeof child === "string" || typeof child === "number") {
      parent.append(document.createTextNode(String(child)));
      return;
    }

    parent.append(child);
  });
}

export function clearElement(element) {
  element.replaceChildren();
}

export function createFragment(children = []) {
  const fragment = document.createDocumentFragment();
  appendChildren(fragment, children);
  return fragment;
}
