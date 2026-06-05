import { } from "@unbndl/html";

export class HomeViewElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = "";
        const elements = this.createContent();
        this.append(...elements);
    }

    createContent() {
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
                    <p>Submersible 3V DC Water Pump, Horizontal Type</p>
                </article>
            </div>
        `;

        return [zoneList, section];
    }
}