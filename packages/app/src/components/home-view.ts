import { css, html, shadow } from "@unbndl/html";

export class HomeViewElement extends HTMLElement {
  static template = html`<template>
    ...
  </template>`;
  static styles = css`...`;

  constructor() {
    super()
    shadow(this)
      .template(HomeViewElement.template)
      .styles(HomeViewElement.styles);
  }
}