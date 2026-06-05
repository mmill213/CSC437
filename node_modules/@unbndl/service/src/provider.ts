import { Context, SignalReceiver } from "@unbndl/html";

export class Provider<T extends object> extends HTMLElement {
  readonly context: Context<T>;
  contextLabel: string;

  static DISCOVERY_EVENT = "un-provider:discover";
  static REGISTRY_EVENT = "un-provider:register";
  static CHANGE_EVENT = "un-provider:change";

  static {
    document.addEventListener(
      Provider.DISCOVERY_EVENT,
      (event: Event) => {
        const [contextLabel, respondFn] = (event as CustomEvent)
          .detail;
        const provider = registeredProvider(contextLabel);
        if (provider) {
          respondFn(provider);
        } else {
          // console.log("No response from provider:", contextLabel);
        }
      }
    );
    document.addEventListener(
      Provider.REGISTRY_EVENT,
      (event: Event) => {
        const [contextLabel, provider] = (event as CustomEvent)
          .detail;
        registerProvider(contextLabel, provider);
        // console.log("Provider registered", contextLabel, provider);
      }
    );
  }

  constructor(init: T, label: string) {
    super();
    this.contextLabel = label;
    this.context = new Context<T>(init);
    this.context.setHost(this, Provider.CHANGE_EVENT);
    this.addEventListener(
      Provider.DISCOVERY_EVENT,
      (event: Event) => {
        const [contextLabel, respondFn] = (event as CustomEvent)
          .detail;
        // console.log(
        //   "Provider checking for context",
        //   this.contextLabel,
        //   contextLabel
        // );
        if (contextLabel === this.contextLabel) {
          event.stopPropagation();
          respondFn(this);
        }
      }
    );
    const registryEvent = new CustomEvent(
      Provider.REGISTRY_EVENT,
      {
        bubbles: true,
        composed: true,
        detail: [this.contextLabel, this]
      }
    );
    this.dispatchEvent(registryEvent);
  }

  attach(observer: SignalReceiver<T>): T {
    this.addEventListener(
      Provider.CHANGE_EVENT,
      observer as EventListener
    );
    return this.context.toObject();
  }

  detach(observer: SignalReceiver<T>) {
    this.removeEventListener(
      Provider.CHANGE_EVENT,
      observer as EventListener
    );
  }
}

export function discover<T extends object>(
  observer: Element,
  contextLabel: string
): Promise<Provider<T>> {
  return new Promise<Provider<T>>((resolve, reject) => {
    const discoveryEvent = new CustomEvent(
      Provider.DISCOVERY_EVENT,
      {
        bubbles: true,
        composed: true,
        detail: [
          contextLabel,
          (provider: Provider<T>) =>
            provider ? resolve(provider) : reject()
        ]
      }
    );

    if (observer.isConnected)
      observer.dispatchEvent(discoveryEvent);
    else {
      // console.log("!!! Observer is not connected ... Discovery will fail!", observer);
      document.dispatchEvent(discoveryEvent);
    }
  });
}

const registry: { [key: string]: HTMLElement } = {};

function registerProvider<T extends object>(
  label: string,
  provider: Provider<T>
) {
  registry[label] = provider;
}

function registeredProvider<T extends object>(
  label: string
): Provider<T> | undefined {
  return registry[label] as Provider<T>;
}
