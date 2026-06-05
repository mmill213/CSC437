import { Context } from './context';
import { EffectArgs } from './effect';
export type Scope<TT extends EffectArgs> = {
    [Index in keyof TT]: Context<TT[Index]>;
};
export declare function exposeTuple<TT extends EffectArgs>(scope: Scope<TT>): TT;
export declare function createScope<TT extends EffectArgs>(tuple: TT): Scope<TT>;
