import { listen } from './listen';
import { delegate } from './delegate';
import { relay } from './relay';
export * from './events';
export declare const Events: {
    listen: typeof listen;
    delegate: typeof delegate;
    relay: typeof relay;
};
