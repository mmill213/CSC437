import { html, css, shadow } from "@unbndl/html";
import reset from "./reset.css.js";

export class ZoneItem extends HTMLElement {
  static observedAttributes = ["icon-type", "zone-path"];
  static template = html`
    <template>
      <li>
        <svg class="icon">
          <use href="sprite.svg#potted_plant_generic"/>
        </svg>

        <a href="./zones/zone1/zone1.html"> <slot></slot> </a> 
      </li>

    
    </template>
  `;

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name){
        case "icon-type": 
          this._updateType(newValue);
          break;
        case "zone-path": 
          this._updatePath(newValue);
          break;
    }
  }

  _updateType(type) {
    const use = this.shadowRoot.querySelector("use");
    use.setAttribute("href", `sprite.svg#${type}`);
  }

  _updatePath(zonePath) {
    this.style.setProperty("href", `url(${zonePath})`);
  }

  constructor() {
    super();
    shadow(this)
      .template(ZoneItem.template)
      .styles(ZoneItem.styles)
  }

  // I like to keep the styles at the bottom of the class
  static styles = css`
  svg.icon {
    display: inline;
    height: 2em;
    width: 2em;
    vertical-align: top;
    fill:var(--color-icon-plant);
    &.water_drop {
      fill:var(--water-color);
    }
  }
  li {
    justify-self: center;
    grid-column: auto/span 2;
  }

  a {
    color:var(--color-accent);
  }


  
  `;
}