// src/models/sensorsOuts.ts

export interface Zones {
  zoneId?: string;
  name: string;
  lastWatered: number;
  moisture: number;
  temperature: number;
  shouldWater: string;
  reservoir?: string;
}