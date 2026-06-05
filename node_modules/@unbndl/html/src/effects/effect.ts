export type EffectArgs = Array<object>;

export interface Effect {
  execute(): void;
}

export type Effector<TT extends EffectArgs> = (
  ...scope: TT
) => void;

export class DirectEffect<TT extends EffectArgs>
  implements Effect
{
  private effectFn: Effector<[]>;

  constructor(fn: Effector<TT>, ...scope: TT) {
    this.effectFn = () => fn(...scope);
  }

  execute(): void {
    this.effectFn();
  }
}
