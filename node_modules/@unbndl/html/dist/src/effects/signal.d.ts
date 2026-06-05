export type Signal<T, K extends keyof T> = {
    property: K;
    value: T[K];
};
export declare class SignalEvent<T, K extends keyof T> extends CustomEvent<Signal<T, K>> {
    constructor(eventType: string, signal: Signal<T, K>);
}
export type SignalReceiver<T> = (ev: SignalEvent<T, keyof T>) => void;
