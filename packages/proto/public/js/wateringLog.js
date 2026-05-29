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
        ${
          readings.length > 0
            ? html`
                <table>
                  <thead>
                    <tr>
                      <th>Temperature</th>
                      <th>Moisture</th>
                      <th>Should Water</th>
                      <th>Reservoir</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${readings.map(renderReadingRow)}
                  </tbody>
                </table>
              `
            : html`
                <p>No watering log data available for this zone.</p>
              `
        }
      </section>
    `;
  }

  static styles = css`
    :host {
      display: block;
      grid-column: 1 / -1;
    }

    .watering-log {
      max-width: 60rem;
      margin: 0 auto;
      color: var(--color-text);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--color-background-card, rgba(255, 255, 255, 0.85));
      color: var(--color-text);
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    th {
      font-weight: bold;
    }

    tr:last-child td {
      border-bottom: none;
    }

    @media screen and (max-width: 30rem) {
      table,
      thead,
      tbody,
      th,
      td,
      tr {
        display: block;
      }

      thead {
        display: none;
      }

      tr {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background-color: var(--color-background-card, rgba(255, 255, 255, 0.85));
        border-radius: 0.75rem;
      }

      td {
        border-bottom: none;
        padding: 0.35rem 0;
      }

      td::before {
        font-weight: bold;
        display: inline-block;
        width: 8rem;
      }

      td:nth-child(1)::before {
        content: "Temp:";
      }

      td:nth-child(2)::before {
        content: "Moisture:";
      }

      td:nth-child(3)::before {
        content: "Should Water:";
      }

      td:nth-child(4)::before {
        content: "Reservoir:";
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
    <tr>
      <td>${temperature}${temperature !== "N/A" ? "°C" : ""}</td>
      <td>${moisture}</td>
      <td>${shouldWater}</td>
      <td>${formatReservoir(reservoir)}</td>
    </tr>
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