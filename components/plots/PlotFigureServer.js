import * as Plot from '@observablehq/plot';
import { createElement as h } from 'react';

// This is the default document creation approach suggested by Observable and taken from here:
// https://codesandbox.io/s/plot-react-f1jetw?file=/src/PlotFigure.js:0-3101

// Note that it is not TypeScript! As such it needs to be included explicitly in tsconfig

// For client-side rendering, see https://codesandbox.io/s/plot-react-csr-p4cr7t?file=/src/PlotFigure.jsx
// Based on https://github.com/observablehq/plot/blob/main/docs/components/PlotRender.js

// Function to fix semantic html errors for React
function parseAttributeNames(s) {
  if (s === 'class') return 'className';

  // Check if the parameter starts with 'aria' it shouldn't become camelCase
  if (s.startsWith('aria')) return s;

  // Convert hyphenated to camelCase for all other attributes
  return s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export default function PlotFigure({ options }) {
  return Plot.plot({ ...options, document: new Document() }).toHyperScript();
}

class Document {
  constructor() {
    this.documentElement = new Element(this, 'html');
  }

  createElementNS(namespace, tagName) {
    return new Element(this, tagName);
  }

  createElement(tagName) {
    return new Element(this, tagName);
  }

  createTextNode(value) {
    return new TextNode(this, value);
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }
}

class Style {
  static empty = new Style();

  setProperty() {}

  removeProperty() {}
}

class Element {
  constructor(ownerDocument, tagName) {
    this.ownerDocument = ownerDocument;
    this.tagName = tagName;
    // Add a random key to satisfy list requirements in react. This is bad practice!
    this.attributes = {
      key: Math.random().toString(36).substring(2, 7),
    };
    this.children = [];
    this.parentNode = null;
  }

  setAttribute(name, value) {
    const parsedName = parseAttributeNames(name);
    this.attributes[parsedName] = String(value);
  }

  setAttributeNS(namespace, name, value) {
    const parsedName = parseAttributeNames(name);
    this.setAttribute(parsedName, value);
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  getAttributeNS(name) {
    return this.getAttribute(name);
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  hasAttributeNS(name) {
    return this.hasAttribute(name);
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  removeAttributeNS(namespace, name) {
    this.removeAttribute(name);
  }

  addEventListener() {
    // ignored; interaction needs real DOM
  }

  removeEventListener() {
    // ignored; interaction needs real DOM
  }

  dispatchEvent() {
    // ignored; interaction needs real DOM
  }

  append(...children) {
    for (const child of children) {
      this.appendChild(child?.ownerDocument ? child : this.ownerDocument.createTextNode(child));
    }
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  insertBefore(child, after) {
    if (after == null) {
      this.children.push(child);
    } else {
      const i = this.children.indexOf(after);
      if (i < 0) throw new Error('insertBefore reference node not found');
      this.children.splice(i, 0, child);
    }
    child.parentNode = this;
    return child;
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }

  set textContent(value) {
    this.children = [this.ownerDocument.createTextNode(value)];
  }

  set style(value) {
    this.attributes.style = value;
  }

  get style() {
    return Style.empty;
  }

  toHyperScript() {
    return h(
      this.tagName,
      this.attributes,
      this.children.map((c) => c.toHyperScript())
    );
  }
}

class TextNode {
  constructor(ownerDocument, nodeValue) {
    this.ownerDocument = ownerDocument;
    this.nodeValue = String(nodeValue);
  }

  toHyperScript() {
    return this.nodeValue;
  }
}
