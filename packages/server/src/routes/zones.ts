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

export default router