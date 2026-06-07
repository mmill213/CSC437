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

        case "zone/save": {
            const { zoneId, name } = payload as { zoneId: string; name: string };
            return [model, saveZoneName(zoneId, name, callbacks)];
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

function saveZoneName(
    zoneId: string,
    name: string,
    callbacks?: { onSuccess?: () => void; onFailure?: (err: Error) => void }
): Promise<Cmd> {
    return fetch(`/api/zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
        .then((res) => {
            if (res.status === 200) return res.json();
            throw new Error(`${res.status} saving zone ${zoneId}`);
        })
        .then((json: unknown) => {
            if (json) {
                callbacks?.onSuccess?.();
                return fetchZones() as Promise<Cmd>;
            }
            throw new Error("No JSON in response");
        })
        .catch((err) => {
            callbacks?.onFailure?.(err instanceof Error ? err : new Error(String(err)));
            throw err;
        });
}