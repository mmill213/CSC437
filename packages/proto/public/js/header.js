import { css, html, shadow } from "@unbndl/html";

export class HeaderElement extends HTMLElement {
  view = html`
    <header>
      <div class="title-group">
        <h1>Automatic Plant Watering System</h1>

        <svg class="icon water_drop">
          <use href="/sprite.svg#up_arrow_water_drop"></use>
        </svg>
      </div>

      <div class="header-controls">
        <label>
          <input type="checkbox" autocomplete="off" id="darkMode" />
          <strong>Dark</strong>-mode
        </label>
      </div>
    </header>
  `;

  static styles = css`
    :host {
      display: block;
      grid-column: 1 / -1;
      background-color: var(--color-accent-inverted);
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 1rem;
      font-size: var(--font-size-large);
    }

    .title-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex: 1;
    }

    h1 {
      font-size: inherit;
      color: var(--color-header);
      margin: 0;
      text-align: center;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-left: auto;
    }

    label {
      font-size: var(--font-size-small);
      white-space: nowrap;
    }

    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: var(--color-icon-plant);
      flex-shrink: 0;
    }

    svg.icon.water_drop {
      fill: var(--water-color);
    }

    @media screen and (max-width: 50rem) {
      header {
        font-size: var(--font-size-medium);
      }
    }

    @media screen and (max-width: 30rem) {
      header {
        flex-direction: column;
        align-items: center;
        font-size: var(--font-size-med-small);
      }

      .title-group {
        width: 100%;
      }

      .header-controls {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        margin-left: 0;
      }
    }
  `;

  constructor() {
    super();

    shadow(this)
      .styles(HeaderElement.styles)
      .replace(this.view);

    this.shadowRoot.addEventListener("change", (event) => {
      if (event.target.id === "darkMode") {
        this.toggleDarkMode(event);
      }
    });
  }

  toggleDarkMode(event) {
    const customEvent = new CustomEvent("dark-mode", {
      bubbles: true,
      composed: true,
      detail: { checked: event.target.checked }
    });

    this.dispatchEvent(customEvent);
  }
}