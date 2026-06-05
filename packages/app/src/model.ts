// src/model.ts
import { Zones } from "server/models";

export interface Model {
    zones?: Zones[];
    selectedZone?: Zones;
}

export const init: Model = {};