export function relay(
  event: Event,
  customType: string,
  detail?: any
) {
  const relay = event.target as EventTarget;
  const customEvent = new CustomEvent(customType, {
    bubbles: true,
    composed: true,
    detail
  });

  relay.dispatchEvent(customEvent);
  event.stopPropagation();
}
