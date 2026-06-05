import { Effect } from './effect';
export declare class EffectsManager<T extends object> {
    private running;
    private host?;
    private eventType;
    isRunning(): boolean;
    push(effect: Effect): void;
    pop(): void;
    current(): Effect | undefined;
    subscribe(key: keyof T, scope: T): void;
    runEffects(key: keyof T, scope: T): void;
    setHost(host: EventTarget, eventType?: string): void;
}
