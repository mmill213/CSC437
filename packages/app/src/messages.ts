// src/messages.ts
import { Zones } from "server/models";

export type Msg =
    | ["zones/request", Record<string, never>]
    | ["zones/load", { zones: Zones[] }]
    | ["zone/request", { zoneId: string }]
    | ["zone/load", { zone: Zones }]
    | ["zone/save", { zoneId: string; name: string }, { onSuccess?: () => void; onFailure?: (err: Error) => void }];

    