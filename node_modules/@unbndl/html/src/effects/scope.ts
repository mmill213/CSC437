import { Context } from "./context";
import { EffectArgs } from "./effect";

export type Scope<TT extends EffectArgs> = {
  [Index in keyof TT]: Context<TT[Index]>
};

export function exposeTuple<TT extends EffectArgs>(
  scope: Scope<TT>
): TT {
  return scope.map((cx) => cx.toObject()) as TT;
}

export function createScope<TT extends EffectArgs>(
  tuple: TT
): Scope<TT> {
  return tuple.map((a) =>
    typeof a === "undefined" ? null : new Context(a)
  ) as Scope<TT>;
}
