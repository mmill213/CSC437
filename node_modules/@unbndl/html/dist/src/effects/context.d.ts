import { Effect, Effector } from './effect';
import { EffectsManager } from './manager';
export declare class Context<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context<T>);
    get(prop: keyof T): T[typeof prop];
    set(prop: keyof T, value: T[typeof prop]): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect): Readonly<T>;
    close(): void;
}
export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;
