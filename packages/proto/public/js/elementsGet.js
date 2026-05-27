import { html, shadow, css } from "@unbndl/html";
import { fromAuth } from "@unbndl/auth";
import { createViewModel } from "@unbndl/view";

export class ZoneElement extends HTMLElement {
  viewModel = createViewModel({
    token: undefined,
    authenticated: false
  }).with(fromAuth(this), "authenticated", "token");

  constructor() {
    super();
    shadow(this).styles(ZoneElement.styles);

    // Re-fetch when auth state changes
    this.viewModel.addEventListener("updated", () => {
      const { authenticated, token } = this.viewModel.toObject();
      if (authenticated) {
        this.hydrate("/api/zones", token).then((data) => {
          shadow(this).replace(ZoneElement.render(data));
        });
      }
    });
  }

  get authorization() {
    const $ = this.viewModel.toObject();
    if ($.authenticated)
      return { Authorization: `Bearer ${$.token}` };
    else
      return {};
  }

  hydrate(src, token) {
    return fetch(src, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    .then((response) => {
      if (response.status !== 200)
        throw `HTTP Status ${response.status}`;
      else return response.json();
    })
    .catch((error) => {
      console.log(`Could not fetch ${src}:`, error);
    });
  }

  static render(data) {
    const items = Array.isArray(data) ? data : [];
    return html`
      <ul style="list-style-type: none;">
        ${items.map(renderItems)}
      </ul>
    `;
  }

  static styles = css`
    :host { display: contents; }

    ul {
      display: contents;
      >zone-item {
        justify-self: center;
        grid-column: auto/span 2;
      }
    }

    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: var(--color-icon-plant);
      &.water_drop { fill: var(--water-color); }
    }

    li {
      justify-self: center;
      grid-column: auto/span 2;
    }

    a { color: var(--color-accent); }
  `;
}

function renderItems(zone) {
  const { name, zoneId, shouldWater, moisture, temperature } = zone;
  return html`
    <li>
      <svg class="icon">
        <use href="sprite.svg#potted_plant_generic"/>
      </svg>
      <a href="./zones/zone1/zone1.html">${name}</a>
      <p>Moisture: ${moisture}% | Temp: ${temperature}°C | Water: ${shouldWater}</p>
    </li>
  `;
}