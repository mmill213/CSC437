import zoneService from "./services/sensorsOuts-svc.ts";
import { Zones } from "./models";
import express, { Request, Response } from "express";
import { connect } from "./services/mongo.ts";
import router from "./routes/zones.ts";
import auth, { authenticateUser } from "./routes/auth.ts";
import fs from "node:fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
connect("ZoneDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

// Device endpoint for ESP8266 — API key auth
app.post("/api/device/data", (req: Request, res: Response) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send("Unauthorized");
        return;
    }
    zoneService.create({
        zoneId:      req.body.zoneId,
        name:        req.body.name || req.body.zoneId || "zone",
        moisture:    req.body.moisture,
        temperature: req.body.temperature,
        lastWatered: req.body.lastWatered,
        shouldWater: req.body.shouldWater,
        reservoir:   req.body.reservoir
    } as Zones)
    .then((zone: Zones) => res.status(201).json(zone))
    .catch((err: unknown) => res.status(500).send(err));
});

// Public zone routes
app.use("/api/zones", router);
app.use("/auth", auth);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// SPA fallback
app.use("/app", (req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" })
        .then((html) => res.send(html))
        .catch(() => res.status(404).send("Not found"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});