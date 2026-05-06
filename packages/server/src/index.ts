// src/index.ts
import Zones from "./services/sensorsOuts-svc.ts";

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

// with the other routes:
app.get("/api/zones/:name", (req: Request, res: Response) => {
  const { name } = req.params as{name:string};
  const data = Zones.get(name);
  
  if (data) res.send(data)
  else res.status(404).send();
});

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});