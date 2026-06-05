// src/update.ts
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";
import { Zones } from "server/models";

export type Cmd =
    | ["zones/load", { zones: Zones[] }]
    | ["zone/load", { zone: Zones }];

export default function update(
    model: Readonly<Model>,
    message: Msg | Cmd
): any {
    const [type, payload] = message;

    switch (type) {
        case "zones/request":
            return [
                model,
                fetchZones()
            ];

        case "zones/load": {
            const { zones } = payload as { zones: Zones[] };
            return { ...model, zones };
        }

        case "zone/request": {
            const { zoneId } = payload as { zoneId: string };
            return [
                model,
                fetchZone(zoneId)
            ];
        }

        case "zone/load": {
            const { zone } = payload as { zone: Zones };
            return { ...model, selectedZone: zone };
        }

        default:
            throw new Error(`Unhandled message "${type}"`);
    }
}

function fetchZones() {
    return fetch("/api/zones")
        .then((res) => {
            if (res.status === 200) return res.json();
            throw "Failed to fetch zones";
        })
        .then((json: unknown) => {
            if (json) return ["zones/load", { zones: json as Zones[] }];
            throw "No JSON in response";
        });
}

function fetchZone(zoneId: string) {
    return fetch(`/api/zones/${zoneId}`)
        .then((res) => {
            if (res.status === 200) return res.json();
            throw "Failed to fetch zone";
        })
        .then((json: unknown) => {
            if (json) return ["zone/load", { zone: json as any }];
            throw "No JSON in response";
        });
}