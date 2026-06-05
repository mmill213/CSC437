export class HomeViewElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = "";
        const elements = this.createContent();
        this.append(...elements);
    }

    createContent() {
        const style = document.createElement("style");
        style.textContent = `
          zone-list {
            display: block;
            width: 100%;
          }

          .component-section {
            grid-column: 1 / -1;
            padding: 1rem;
            text-align: center;
          }

          .component-section h2 {
            margin-bottom: 1rem;
            color: var(--color-secondary-header);
          }

          .component-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            max-width: 60rem;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .component-card {
            background-color: var(--color-background-card, rgba(255,255,255,0.85));
            color: var(--color-text);
            border-radius: 0.75rem;
            padding: 1rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            min-width: 0;
          }

          .component-card h3 {
            margin-top: 0;
            margin-bottom: 0.5rem;
          }

          @media screen and (max-width: 50rem) {
            .component-grid {
              grid-template-columns: 1fr;
            }
          }
        `;

        const zoneList = document.createElement("zone-list");
        zoneList.setAttribute("src", "/data/zoneList.json");
        zoneList.setAttribute("api-src", "/api/zones");

        const section = document.createElement("section");
        section.className = "component-section";
        section.innerHTML = `
            <h2>Components Used</h2>
            <div class="component-grid">
                <article class="component-card">
                    <h3>Moisture Sensor</h3>
                    <p>Capacitive Soil Moisture Sensor v1.2</p>
                </article>
                <article class="component-card">
                    <h3>Temperature Sensor</h3>
                    <p>DS18B20 digital temperature sensor</p>
                </article>
                <article class="component-card">
                    <h3>Watering Pump</h3>
                    <p>Submersible 3V DC Water Drop, Horizontal Type</p>
                </article>
            </div>
        `;

        return [style, zoneList, section];
    }
}