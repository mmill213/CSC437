import { EventMap } from "./events";

/**
 * Memory leak warning!
 * Need to also clean up all the event listeners, probably
 * on disconnectCallback();
 */

export function listen(element: Element | DocumentFragment, map: EventMap) {
  for (const eventType in map) {
    element.addEventListener(eventType, map[eventType]);
  }
}
