import { define, html } from "@unbndl/html";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { Store } from "@unbndl/store";
import { HeaderElement } from "./components/header.js";
import { ZoneElement } from "./components/elementsGet.js";
import { WateringLogElement } from "./components/wateringLog.js";
import { Model, init } from "./model.ts";
import { Msg } from "./messages.ts";
import update, { Cmd } from "./update.ts";

const routes: any[] = [
    {
        path: "/app/log/:zoneId",
        view: html`<watering-log
            zone-id=${($: any) => $.params.zoneId}
            api-src="/api/zones">
        </watering-log>`
    },
    {
        path: "/app",
        view: html`<zone-list
            src="/data/zoneList.json"
            api-src="/api/zones">
        </zone-list>`
    },
    {
        path: "/",
        redirect: "/app"
    }
];

define({
    "history-provider": BrowserHistory.Provider,
    "store-provider": class AppStore
        extends Store.Provider<Model, Msg, Cmd> {
        constructor() {
            super(update, init);
        }
    },
    "router-switch": class AppSwitch extends Switch.Element {
        constructor() { super(routes); }
    },
    "site-header":  HeaderElement,
    "zone-list":    ZoneElement,
    "watering-log": WateringLogElement
});