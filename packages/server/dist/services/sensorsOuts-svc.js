import { Schema, model } from "mongoose";
const zonesSchema = new Schema({
    zoneId: String,
    name: { type: String, required: true },
    lastWatered: Number,
    moisture: Number,
    temperature: Number,
    shouldWater: String,
    reservoir: String
}, { collection: "zonesSchema", timestamps: true });
const ZoneModel = model("Zones", zonesSchema);
function index() {
    return ZoneModel.find().sort({ _id: -1 });
}
function get(zoneId) {
    return ZoneModel.find({ zoneId })
        .then((list) => list[0])
        .catch(() => { throw `${zoneId} Not Found`; });
}
function create(json) {
    const t = new ZoneModel(json);
    return t.save();
}
function update(id, zones) {
    return ZoneModel.findOneAndUpdate({ zoneId: id }, zones, { new: true })
        .then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(userid) {
    return ZoneModel.findOneAndDelete({ zoneId: userid })
        .then((deleted) => {
        if (!deleted)
            throw `${userid} not deleted`;
    });
}
export default { index, get, create, update, remove };
