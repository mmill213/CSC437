import { Scope } from './scope';
import { Effect, Effector, EffectArgs } from './effect';
export declare function createEffect<TT extends EffectArgs>(fn: Effector<TT>, ...scope: Scope<TT>): void;
export type Signals<T extends object> = Map<keyof T, Set<Effect>>;
export declare class Scheduler {
    private signals;
    private scheduled;
    static scheduler: Scheduler;
    subscribe<T extends object>(scope: T, key: keyof T, effect: Effect): void;
    scheduleEffects<T extends object>(scope: T, key: keyof T): void;
}
