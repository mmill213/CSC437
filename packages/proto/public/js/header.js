import { css, html, shadow } from "@unbndl/html";

export class HeaderElement extends HTMLElement {
  constructor() {
    super();

    shadow(this).styles(HeaderElement.styles);

    this.reservoirLow = false;
    this.renderHeader();

    this.shadowRoot.addEventListener("change", (event) => {
      if (event.target.id === "darkMode") {
        this.toggleDarkMode(event);
      }
    });
  }

  static observedAttributes = ["api-src"];

  connectedCallback() {
    this.loadReservoirStatus();
  }

  attributeChangedCallback() {
    this.loadReservoirStatus();
  }

  async loadReservoirStatus() {
    const apiSrc = this.getAttribute("api-src");

    if (!apiSrc) return;

    try {
      const zoneReadingData = await this.hydrate(apiSrc);

      this.reservoirLow = isAnyReservoirLow(zoneReadingData);
      this.renderHeader();
    } catch (error) {
      console.log("Could not load reservoir status:", error);
    }
  }

  renderHeader() {
    const view = html`
      <header>
        <div class="title-group">
          <h1>Automatic Plant Watering System</h1>

          ${
            this.reservoirLow
              ? html`
                  <svg class="icon water_drop" aria-label="Water drop icon">
                    <use href="/sprite.svg#exclamation_water_drop"></use>
                  </svg>
                `
              : html`
                  <svg class="icon water_drop" aria-label="Water drop icon">
                    <use href="/sprite.svg#up_arrow_water_drop"></use>
                  </svg>
                `
          }
        </div>

        <div class="header-controls">
          <label>
            <input type="checkbox" autocomplete="off" id="darkMode" />
            <strong>Dark</strong>-mode
          </label>
        </div>
      </header>
    `;

    shadow(this).replace(view);
  }

  toggleDarkMode(event) {
    const customEvent = new CustomEvent("dark-mode", {
      bubbles: true,
      composed: true,
      detail: { checked: event.target.checked }
    });

    this.dispatchEvent(customEvent);
  }

  hydrate(src) {
    return fetch(src).then((response) => {
      if (response.status !== 200) {
        throw `HTTP Status ${response.status}`;
      }

      return response.json();
    });
  }

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

    svg.icon,
    img.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      flex-shrink: 0;
    }

    svg.icon {
      fill: var(--color-icon-plant);
    }

    svg.icon.water_drop {
      fill: var(--water-color);
    }

    img.alert-icon {
      object-fit: contain;
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
}

function isAnyReservoirLow(zoneReadingData) {
  if (!Array.isArray(zoneReadingData)) {
    return false;
  }

  const connectedZones = ["zone_1", "zone_2"];

  return connectedZones.some((zoneId) => {
    const latestReading = zoneReadingData
      .filter((reading) => reading.zoneId === zoneId)
      .sort((a, b) => {
        const idA = a._id ?? "";
        const idB = b._id ?? "";

        return idB.localeCompare(idA);
      })[0];

    if (!latestReading) {
      return false;
    }

    const reservoirValue = latestReading.reservoir ?? latestReading.lastWatered;

    return reservoirValue === 0 || reservoirValue === "0";
  });
}