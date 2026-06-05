import { EventMap } from "./events";

export function delegate(
  element: Element | DocumentFragment,
  selector: string,
  map: EventMap
) {
  for (const eventType in map) {
    const listener = function (ev: Event) {
      const target = ev.target as HTMLElement;
      const match =
        target &&
        target instanceof HTMLElement &&
        (target.matches(selector) ||
          element.contains(target.closest(selector)));
      // console.log("Event delegation test:", match, selector, ev);
      if (match) map[eventType](ev);
    };
    // console.log("Listening for events", eventType, selector, element);
    element.addEventListener(eventType, listener);
  }
}
