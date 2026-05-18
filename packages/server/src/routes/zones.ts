//packages/server/src/routes/zones.ts
import express, { Request, Response } from "express";
import { Zones } from "../models";

import ZoneModel from "../services/sensorsOuts-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
  ZoneModel.index()
    .then((list: Zones[]) => res.send(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  ZoneModel.get(id as string)
    .then((dest: Zones | undefined) => {
      if (!dest) res.status(404).send();
      else res.send(dest)
    })
    .catch((err) => res.status(404).send(err));
});


router.post("/", (req: Request, res: Response) => {
  const newZone= req.body;

  ZoneModel.create(newZone)
    .then((zones: Zones) =>
      res.status(201).json(zones)
    )
    .catch((err) => res.status(500).send(err));
});


router.put("/:id", (req: Request, res: Response) => { //app->router
  const { id } = req.params;
  const newZone = req.body;

  ZoneModel.update(id as string, newZone)
    .then((zones: Zones | undefined) => res.json(zones))
    .catch((err: unknown) => res.status(404).end());
});

router.delete("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  ZoneModel.remove(userid as string)
    .then(() => res.status(204).end())
    .catch((err: unknown) => res.status(404).send(err));
});

export default router