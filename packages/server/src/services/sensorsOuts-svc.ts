// src/services/sensorsOuts-svc.ts
import { Zones } from "../models";

const zones: {[key: string]: Zones} = {
    "Zone 1": {
        name: "Zone 1",
        wateringLog: [27, 53, 71, 3],
        lastWatered: 27,
        moisture: 37,
        temperature: 47,
        shouldWater: "Yes"
    }
    
};

function get(name: string) {
  return zones[name];
}

export default { get };