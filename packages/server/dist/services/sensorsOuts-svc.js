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
function create(json) {
    const t = new ZoneModel(json);
    return t.save();
}
function update(id, zones) {
    return ZoneModel.findOneAndUpdate({ id }, zones, { new: true })
        .then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(userid) {
    return ZoneModel.findOneAndDelete({ userid }).then((deleted) => {
        if (!deleted)
            throw `${userid} not deleted`;
    });
}
export default { index, get, create, update, remove };
//Destination=Zones
//DestinationModel=ZoneModel
