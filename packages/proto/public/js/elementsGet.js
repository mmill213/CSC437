import { html, shadow, css } from "@unbndl/html";

export class ZoneElement extends HTMLElement {
  constructor() {
    super();
    shadow(this).styles(ZoneElement.styles);
    // no template
  }
  
  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        const view = ZoneElement.render(data)
        shadow(this).replace(view);
      });
    }
  }


  static render(data) {
  const items = data?.zoneList || [];
  return html`
    <ul style="list-style-type: none;">
      ${items.map(renderItems)}
    </ul>
  `;
  }

  static styles=css`


  :host{
    display:contents;
  }

  ul {
    display:contents;
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
    fill:var(--color-icon-plant);
    &.water_drop {fill:var(--water-color);}
  }

  li {
    justify-self: center;
    grid-column: auto/span 2;
  }

  a {
    color:var(--color-accent);
  }
  `;
  


  hydrate(src) {
  return fetch(src)
    .then((response) => {
      if (response.status !== 200)
        throw `HTTP Status ${response.status}`;
      else return response.json();
    })
    .catch((error) => {
      console.log(`Could not fetch ${src}:`, error);
    });
}
}

function renderItems(zoneItem) {
    const { name, iconName, zonePath } = zoneItem;

      return html`
        <li>
        <svg class="icon">
          <use href=${`sprite.svg#${iconName}`}/>
        </svg>

        <a href=${zonePath}> ${name} </a> 
      </li>
      `;
  }