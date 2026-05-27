import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { Auth, fromAuth } from "@unbndl/auth";
import reset from "./reset.css.js";

export class HeaderElement extends HTMLElement {
  viewModel = createViewModel({
    authenticated: false
  }).with(fromAuth(this), "authenticated", "username");

    view = html`
        <header>
            <h1>Automatic Plant Watering System</h1>
            <svg class="icon water_drop">
                <use href="/sprite.svg#up_arrow_water_drop"/>
            </svg>

            <label>
                <input type="checkbox" autocomplete="off" id="darkMode"/>
                <strong>Dark</strong>-mode
            </label>

            <nav class=${($) => $.authenticated ? "logged-in" : "logged-out"}>
                <p>Hello, ${($) => $.username || "Guest"}</p>
                <menu>
                    <li class="when-signed-in">
                        <button>Sign Out</button>
                    </li>
                    <li class="when-signed-out">
                        <a href="/login.html">Sign In</a>
                    </li>
                </menu>
            </nav>
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
            flex: auto;
            padding: 0.5rem 1rem;
            font-size: var(--font-size-large);
        }

        h1 {
            font-size: inherit;
            color: var(--color-header);
        }

        label {
            font-size: var(--font-size-small);
            margin-left: auto;
        }

        nav {
            font-size: var(--font-size-small);
            margin-left: 1rem;
            text-align: right;
        }

        nav a {
            font-size: var(--font-size-small);
        }

        p {
            font-size: var(--font-size-small);
            margin: 0;
        }

        li { display: none; }

        .logged-in .when-signed-in,
        .logged-out .when-signed-out {
            display: block;
        }

        svg.icon {
            display: inline;
            height: 2em;
            width: 2em;
            vertical-align: top;
            fill: var(--color-icon-plant);
        }

        svg.icon.water_drop {
            fill: var(--water-color);
        }
    `;

    constructor() {
        super();
        shadow(this)
            .styles(reset.styles, HeaderElement.styles)
            .replace(this.viewModel.render(this.view))
            .delegate(".when-signed-in button", {
                click: () => this.signout()
            });

        this.shadowRoot.addEventListener("change", (ev) => {
            if (ev.target.id === "darkMode") {
                this.toggleDarkMode(ev);
            }
        });
    }

    toggleDarkMode(ev) {
        const customEvent = new CustomEvent("dark-mode", {
            bubbles: true,
            composed: true,  // escapes Shadow DOM
            detail: { checked: ev.target.checked }
        });
        this.dispatchEvent(customEvent);
    }

  signout() {
    const customEvent = new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout"]
    });
    this.dispatchEvent(customEvent);
    }
}