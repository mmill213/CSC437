import { Effect, Effector } from "./effect";
import { EffectsManager } from "./manager";
import { createEffect } from "./scheduler";

export class Context<T extends object> {
  private manager: EffectsManager<T>;
  private object: T;
  private proxy: T;

  static CHANGE_EVENT_TYPE = "un-context:change";

  constructor(init: T, adoptedContext?: Context<T>) {
    if (adoptedContext) {
      this.manager = adoptedContext.manager;
      this.object = adoptedContext.object;
      this.proxy = adoptedContext.proxy;
      this.update(init);
    } else {
      this.manager = new EffectsManager<T>();
      this.object = init;
      this.proxy = createContext<T>(this.object, this.manager);
    }
  }

  get(prop: keyof T): T[typeof prop] {
    return this.proxy[prop] as T[typeof prop];
  }

  set(prop: keyof T, value: T[typeof prop]) {
    this.proxy[prop] = value;
  }

  toObject(): Readonly<T> {
    return this.proxy as T;
  }

  update(next: Partial<T>) {
    Object.assign(this.proxy, next);
  }

  apply(mapFn: (t: T) => Partial<T>) {
    this.update(mapFn(this.proxy));
  }

  createEffect(fn: Effector<[T]>): void {
    createEffect(fn, this);
  }

  setHost(host: EventTarget, eventType?: string) {
    this.manager.setHost(host, eventType);
  }

  open(effect: Effect): Readonly<T> {
    this.manager.push(effect);
    return this.proxy;
  }

  close() {
    this.manager.pop();
  }
}

export function createContext<T extends object>(
  root: T,
  manager: EffectsManager<T>
) {
  let proxy = new Proxy(root, {
    get: (subject: T, prop: string, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      if (manager.isRunning() && isObservable(value)) {
        manager.subscribe(prop as keyof T, subject);
      }
      return value;
    },
    set: (subject: T, prop: string, newValue, receiver) => {
      const didSet = Reflect.set(
        subject,
        prop,
        newValue,
        receiver
      );
      if (didSet && isObservable(newValue)) {
        manager.runEffects(prop as keyof T, subject);
      }
      return didSet;
    }
  });

  return proxy;
}

function isObservable(value: unknown) {
  switch (typeof value) {
    case "object":
    case "number":
    case "string":
    case "symbol":
    case "boolean":
    case "undefined":
      return true;
    default:
      return false;
  }
}
