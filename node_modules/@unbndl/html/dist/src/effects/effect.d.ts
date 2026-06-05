export type EffectArgs = Array<object>;
export interface Effect {
    execute(): void;
}
export type Effector<TT extends EffectArgs> = (...scope: TT) => void;
export declare class DirectEffect<TT extends EffectArgs> implements Effect {
    private effectFn;
    constructor(fn: Effector<TT>, ...scope: TT);
    execute(): void;
}
