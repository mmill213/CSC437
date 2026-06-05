import { Context, SignalReceiver } from '@unbndl/html';
export declare class Provider<T extends object> extends HTMLElement {
    readonly context: Context<T>;
    contextLabel: string;
    static DISCOVERY_EVENT: string;
    static REGISTRY_EVENT: string;
    static CHANGE_EVENT: string;
    constructor(init: T, label: string);
    attach(observer: SignalReceiver<T>): T;
    detach(observer: SignalReceiver<T>): void;
}
export declare function discover<T extends object>(observer: Element, contextLabel: string): Promise<Provider<T>>;
