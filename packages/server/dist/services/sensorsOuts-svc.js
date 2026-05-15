// src/services/sensorsOuts-svc.ts
import { Schema, model } from "mongoose";
const zonesSchema = new Schema({
    zoneId: String,
    name: { type: String, required: true },
    lastWatered: Number, //last watered gets loaded into a db watering log
    moisture: Number,
    temperature: Number,
    shouldWater: String
}, { collection: "zonesSchema" });
const ZoneModel = model("Zones", zonesSchema);
function index() {
    return ZoneModel.find();
}
function get(zoneId) {
    return ZoneModel.find({ zoneId })
        .then((list) => list[0])
        .catch((err) => {
        throw `${zoneId} Not Found`;
    });
}
export default { index, get };
// const zones: {[key: string]: Zones} = {
//     "Zone 1": {
//         name: "Zone 1",
//         lastWatered: 27,
//         moisture: 37,
//         temperature: 47,
//         shouldWater: "Yes"
//     }
// };
