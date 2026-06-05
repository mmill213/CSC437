import { listen } from "./listen";
import { delegate } from "./delegate";
import { relay } from "./relay";

export * from "./events";

export const Events = {
  listen,
  delegate,
  relay
};
