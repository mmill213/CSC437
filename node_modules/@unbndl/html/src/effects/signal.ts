export type Signal<T, K extends keyof T> = {
  property: K;
  value: T[K];
};

export class SignalEvent<T, K extends keyof T> extends CustomEvent<
  Signal<T, K>
> {
  constructor(eventType: string, signal: Signal<T, K>) {
    super(eventType, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: signal
    });
  }
}

export type SignalReceiver<T> = (ev: SignalEvent<T, keyof T>) => void;
