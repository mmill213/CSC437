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
export default router;
