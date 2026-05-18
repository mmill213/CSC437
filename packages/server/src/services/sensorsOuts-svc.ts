// src/services/sensorsOuts-svc.ts
import { Schema, model } from "mongoose";
import { Zones } from "../models";


const zonesSchema = new Schema<Zones>(
  {
    zoneId: String,
    name:{type: String, required:true},
    lastWatered: Number, //last watered gets loaded into a db watering log
    moisture: Number,
    temperature: Number,
    shouldWater: String
  },
  { collection: "zonesSchema" }
);


const ZoneModel = model<Zones>(
  "Zones",
  zonesSchema
);

function index(): Promise<Zones[]> {
  return ZoneModel.find();
}

function get(zoneId: string): Promise<Zones | undefined> {
  return ZoneModel.find({ zoneId })
    .then((list) => list[0])
    .catch((err) => {
      throw `${zoneId} Not Found`;
    });
}


function create(json: Zones): Promise<Zones> {
  const t = new ZoneModel(json);
  return t.save();
}

function update(
  id: String,
  zones: Zones
): Promise<Zones | undefined> {
  return ZoneModel.findOneAndUpdate(
    { id }, 
    zones,
    { new: true})
  .then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Zones;
  });
}

function remove(userid: String): Promise<void> {
  return ZoneModel.findOneAndDelete({ userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}


export default { index, get, create, update, remove };





//Destination=Zones
//DestinationModel=ZoneModel