// src/index.ts
import zoneService from "./services/sensorsOuts-svc.ts";

import { Zones } from "./models";

import express, { Request, Response } from "express";

import { connect } from "./services/mongo.ts";

import router from "./routes/zones.ts";

connect("ZoneDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/zones", router);


// app.get("/api/zones/:name", (req: Request, res: Response) => {
//   const { name } = req.params as{name:string};
//   const data = zoneService.get(name);
  
//   if (data) res.send(data)
//   else res.status(404).send();
// });


app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/sensorsOuts/:id", (req: Request, res: Response) => {
  const { userid } = req.params;
  
  zoneService.get(userid as string)
    .then((dest: Zones | undefined) => {
      if (!dest) res.status(404).send();
      else res.send(dest)
    })
    .catch((err) => res.status(500).send(err));
});


app.get("/api/sensorsOuts", (req: Request, res: Response) => {
  zoneService.index()
    .then((list: Zones[]) => {
      res.send({ count: list.length, data: list });
    })
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
