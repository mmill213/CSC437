import { html, shadow, css } from "@unbndl/html";

export class ZoneElement extends HTMLElement {
  constructor() {
    super();
    shadow(this).styles(ZoneElement.styles);
  }

  static observedAttributes = ["src", "api-src"];

  connectedCallback() {
    this.loadData();
  }

  attributeChangedCallback() {
    this.loadData();
  }

  async loadData() {
    const zoneListSrc = this.getAttribute("src");
    const apiSrc = this.getAttribute("api-src");

    if (!zoneListSrc || !apiSrc) return;

    try {
      const [zoneListData, zoneReadingData] = await Promise.all([
        this.hydrate(zoneListSrc),
        this.hydrate(apiSrc)
      ]);

      const view = ZoneElement.render(zoneListData, zoneReadingData);
      shadow(this).replace(view);
    } catch (error) {
      console.log("Could not load zone data:", error);

      shadow(this).replace(html`
        <section class="zone-dashboard">
          <p>Could not load zone data.</p>
        </section>
      `);
    }
  }

  static render(zoneListData, zoneReadingData) {
    const zones = zoneListData?.zoneList || [];

    return html`
      <section class="zone-dashboard">
        ${zones.map((zoneItem, index) =>
          renderZoneSection(zoneItem, zoneReadingData, index)
        )}
      </section>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }

    .zone-dashboard {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    .zone-card {
      background-color: var(--color-background-card, rgba(255, 255, 255, 0.85));
      color: var(--color-text);
      border-radius: 0.75rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .zone-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-size: var(--font-size-med-small);
    }

    .zone-header a {
      color: var(--color-accent);
      font-weight: bold;
    }

    .zone-reading-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .zone-reading {
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      padding: 0.5rem 0;
      font-size: var(--font-size-small);
    }

    .zone-reading:first-child {
      border-top: none;
    }

    .reading-row {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .reading-label {
      font-weight: bold;
    }

    .watering-log-link {
      display: inline-block;
      margin-top: 0.75rem;
      color: var(--color-accent);
      font-weight: bold;
    }

    .empty-message {
      font-size: var(--font-size-small);
      font-style: italic;
    }

    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: var(--color-icon-plant);
    }

    @media screen and (max-width: 50rem) {
      .zone-dashboard {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media screen and (max-width: 30rem) {
      .zone-dashboard {
        grid-template-columns: 1fr;
      }
    }
  `;

  hydrate(src) {
    return fetch(src).then((response) => {
      if (response.status !== 200) {
        throw `HTTP Status ${response.status}`;
      }

      return response.json();
    });
  }
}

function renderZoneSection(zoneItem, zoneReadingData, index) {
  const { name, iconName, zonePath } = zoneItem;

  const zoneNumber = index + 1;
  const isConnected = zoneNumber === 1 || zoneNumber === 2;

  const readings = isConnected
    ? getReadingsForZone(zoneReadingData, zoneNumber)
    : [];

  return html`
    <article class="zone-card">
      <header class="zone-header">
        <svg class="icon">
          <use href=${`sprite.svg#${iconName}`} />
        </svg>

        <a href=${zonePath}>${name}</a>
      </header>

      ${
        isConnected
          ? readings.length > 0
            ? html`
                <ul class="zone-reading-list">
                  ${readings.map(renderReading)}
                </ul>
              `
            : html`
                <p class="empty-message">No recent readings yet.</p>
              `
          : html`
              <p class="empty-message">Disconnected</p>
            `
      }

      ${
        isConnected
          ? html`
              <a class="watering-log-link" href=${getWateringLogPath(zonePath)}>
                Complete watering log
              </a>
            `
          : ""
      }
    </article>
  `;
}

function renderReading(reading) {
  const temperature = reading.temperature ?? "N/A";
  const moisture = reading.moisture ?? "N/A";
  const shouldWater = reading.shouldWater ?? "N/A";
  const lastWatered = reading.lastWatered ?? "N/A";

  return html`
    <li class="zone-reading">
      <div class="reading-row">
        <span class="reading-label">Temp:</span>
        <span>${temperature}${temperature !== "N/A" ? "°C" : ""}</span>
      </div>

      <div class="reading-row">
        <span class="reading-label">Moisture:</span>
        <span>${moisture}</span>
      </div>

      <div class="reading-row">
        <span class="reading-label">Should Water:</span>
        <span>${shouldWater}</span>
      </div>

      <div class="reading-row">
        <span class="reading-label">Last Watered:</span>
        <span>${lastWatered}</span>
      </div>
    </li>
  `;
}

function getReadingsForZone(zoneReadingData, zoneNumber) {
  const zoneId = `zone_${zoneNumber}`;

  if (!Array.isArray(zoneReadingData)) {
    return [];
  }

  return zoneReadingData
    .filter((reading) => reading.zoneId === zoneId)
    .slice(0, 5);
}

function getWateringLogPath(zonePath) {
  const parts = zonePath.split("/");
  parts[parts.length - 1] = "watering-log.html";
  return parts.join("/");
}