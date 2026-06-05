import { html, shadow, css } from "@unbndl/html";

export class WateringLogElement extends HTMLElement {
  constructor() {
    super();
    shadow(this).styles(WateringLogElement.styles);
  }

  static observedAttributes = ["api-src", "zone-id"];

  connectedCallback() {
    this.loadData();
  }

  attributeChangedCallback() {
    this.loadData();
  }

  async loadData() {
    const apiSrc = this.getAttribute("api-src");
    const zoneId = this.getAttribute("zone-id");

    if (!apiSrc || !zoneId) return;

    try {
      const zoneReadingData = await this.hydrate(apiSrc);
      const readings = getReadingsForZone(zoneReadingData, zoneId);

      const view = WateringLogElement.render(readings);
      shadow(this).replace(view);
    } catch (error) {
      console.log("Could not load watering log:", error);

      shadow(this).replace(html`
        <section class="watering-log">
          <p>Could not load watering log data.</p>
        </section>
      `);
    }
  }
  

  static render(readings) {
    return html`
      <section class="watering-log">
        <p class="back-link">
          <a href="/app">Return to Dashboard</a>
        </p>
        ${
          readings.length > 0
            ? html`
                <div class="log-table">
                  <div class="log-row log-header">
                    <div>Temperature</div>
                    <div>Moisture</div>
                    <div>Should Water</div>
                    <div>Reservoir</div>
                  </div>

                  ${readings.map(renderReadingRow)}
                </div>
              `
            : html`
                <p>No watering log data available for this zone.</p>
              `
        }
        <p class="back-link">
          <a href="/app">Return to Dashboard</a>
        </p>
      </section>
    `;
  }

  static styles = css`
    :host {
      display: block;
      grid-column: 1 / -1;
      width: 100%;
    }

    .back-link {
        text-align: center;
        margin-top: 1rem;
        grid-column: 1 / -1;
    }

    .back-link a {
        color: var(--color-accent);
        font-weight: bold;
    }

    .watering-log {
      max-width: 75rem;
      margin: 0 auto;
      padding: 0 1rem;
      color: var(--color-text);
    }

    .log-table {
      background-color: var(--color-background-card, rgba(255, 255, 255, 0.85));
      color: var(--color-text);
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .log-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    .log-row:last-child {
      border-bottom: none;
    }

    .log-row > div {
      padding: 0.75rem 1rem;
      overflow-wrap: break-word;
    }

    .log-header {
      font-weight: bold;
      background-color: rgba(255, 255, 255, 0.35);
    }

    @media screen and (max-width: 40rem) {
      .log-row {
        grid-template-columns: 1fr;
        padding: 0.75rem 1rem;
      }

      .log-row > div {
        padding: 0.25rem 0;
      }

      .log-header {
        display: none;
      }

      .temperature::before {
        content: "Temperature: ";
        font-weight: bold;
      }

      .moisture::before {
        content: "Moisture: ";
        font-weight: bold;
      }

      .should-water::before {
        content: "Should Water: ";
        font-weight: bold;
      }

      .reservoir::before {
        content: "Reservoir: ";
        font-weight: bold;
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

function getReadingsForZone(zoneReadingData, zoneId) {
  if (!Array.isArray(zoneReadingData)) {
    return [];
  }

  return zoneReadingData
    .filter((reading) => reading.zoneId === zoneId)
    .sort((a, b) => {
      const idA = a._id ?? "";
      const idB = b._id ?? "";

      return idB.localeCompare(idA);
    });
}

function renderReadingRow(reading) {
  const temperature = reading.temperature ?? "N/A";
  const moisture = reading.moisture ?? "N/A";
  const shouldWater = reading.shouldWater ?? "N/A";
  const reservoir = reading.reservoir ?? reading.lastWatered ?? "N/A";

  return html`
    <div class="log-row">
      <div class="temperature">
        ${temperature}${temperature !== "N/A" ? "°C" : ""}
      </div>

      <div class="moisture">
        ${moisture}
      </div>

      <div class="should-water">
        ${shouldWater}
      </div>

      <div class="reservoir">
        ${formatReservoir(reservoir)}
      </div>
    </div>
  `;
}

function formatReservoir(reservoir) {
  if (reservoir === 0 || reservoir === "0") {
    return "Needs refill";
  }

  if (reservoir === 1 || reservoir === "1") {
    return "Good";
  }

  return reservoir;
}