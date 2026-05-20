import { Schema, model } from "mongoose";
import { Zones } from "../models";

const zonesSchema = new Schema<Zones>(
    {
        zoneId:      String,
        name:        { type: String, required: true },
        lastWatered: Number,
        moisture:    Number,
        temperature: Number,
        shouldWater: String,
        reservoir:   String
    },
    { collection: "zonesSchema" }
);

const ZoneModel = model<Zones>("Zones", zonesSchema);

function index(): Promise<Zones[]> {
    return ZoneModel.find();
}

function get(zoneId: string): Promise<Zones | undefined> {
    return ZoneModel.find({ zoneId })
        .then((list) => list[0])
        .catch(() => { throw `${zoneId} Not Found`; });
}

function create(json: Zones): Promise<Zones> {
    const t = new ZoneModel(json);
    return t.save();
}

function update(id: string, zones: Zones): Promise<Zones | undefined> {
    return ZoneModel.findOneAndUpdate(
        { zoneId: id } as any,
        zones,
        { new: true }
    )
    .then((updated) => {
        if (!updated) throw `${id} not updated`;
        else return updated as unknown as Zones;
    });
}

function remove(userid: string): Promise<void> {
    return ZoneModel.findOneAndDelete({ zoneId: userid } as any)
        .then((deleted) => {
            if (!deleted) throw `${userid} not deleted`;
        });
}

export default { index, get, create, update, remove };