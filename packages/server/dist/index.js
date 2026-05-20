// src/index.ts
import zoneService from "./services/sensorsOuts-svc.js";
import express from "express";
import { connect } from "./services/mongo.js";
import router from "./routes/zones.js";
import auth from "./routes/auth.js";
connect("ZoneDB");
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
// Device POST route, no auth required, uses API key instead
app.post("/api/device/data", (req, res) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send("Unauthorized");
        return;
    }
    const { zoneId, name, moisture, temperature, lastWatered, shouldWater } = req.body;
    zoneService.create({
        zoneId,
        name: name || zoneId || "zone",
        moisture,
        temperature,
        lastWatered,
        shouldWater
    })
        .then((zone) => res.status(201).json(zone))
        .catch((err) => res.status(500).send(err));
});
app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/zones", router);
//app.use("/api/zones", authenticateUser, router);
// app.get("/api/zones/:name", (req: Request, res: Response) => {
//   const { name } = req.params as{name:string};
//   const data = zoneService.get(name);
//   if (data) res.send(data)
//   else res.status(404).send();
// });
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/api/sensorsOuts/:id", (req, res) => {
    const { userid } = req.params;
    zoneService.get(userid)
        .then((dest) => {
        if (!dest)
            res.status(404).send();
        else
            res.send(dest);
    })
        .catch((err) => res.status(500).send(err));
});
app.use("/auth", auth);
app.get("/api/sensorsOuts", (req, res) => {
    zoneService.index()
        .then((list) => {
        res.send({ count: list.length, data: list });
    })
        .catch((err) => res.status(500).send(err));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
