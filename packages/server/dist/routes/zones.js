//packages/server/src/routes/zones.ts
import express from "express";
import ZoneModel from "../services/sensorsOuts-svc.js";
const router = express.Router();
router.get("/", (_, res) => {
    ZoneModel.index()
        .then((list) => res.send(list))
        .catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    ZoneModel.get(id)
        .then((dest) => {
        if (!dest)
            res.status(404).send();
        else
            res.send(dest);
    })
        .catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
    const newZone = req.body;
    ZoneModel.create(newZone)
        .then((zones) => res.status(201).json(zones))
        .catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const newZone = req.body;
    ZoneModel.update(id, newZone)
        .then((zones) => res.json(zones))
        .catch((err) => res.status(404).end());
});
router.delete("/:userid", (req, res) => {
    const { userid } = req.params;
    ZoneModel.remove(userid)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});
export default router;
