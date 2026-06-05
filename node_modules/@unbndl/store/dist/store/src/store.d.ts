import { Context } from '@unbndl/html';
import { Auth } from '@unbndl/auth';
import { Message, Provider, Service } from '@unbndl/service';
declare const STORE_CONTEXT_DEFAULT = "context:store";
type UpdateFn<M extends object, Msg extends Message.Base, Cmd extends Message.Base> = (model: M, message: Msg | Cmd) => M | Message.Async<M, Cmd>;
type AuthorizedUpdateFn<M extends object, Msg extends Message.Base, Cmd extends Message.Base> = (model: M, message: Msg | Cmd, auth: Auth.Model) => M | Message.Async<M, Cmd>;
declare class StoreService<M extends object, Msg extends Message.Base, Cmd extends Message.Base> extends Service<Msg | Cmd, M> {
    static EVENT_TYPE: string;
    constructor(context: Context<M>, update: UpdateFn<M, Msg, Cmd>);
}
declare class StoreProvider<M extends object, Msg extends Message.Base, Cmd extends Message.Base> extends Provider<M> {
    viewModel: import('@unbndl/view').ViewModel<Auth.Model>;
    _updateFn: AuthorizedUpdateFn<M, Msg, Cmd>;
    constructor(updateFn: AuthorizedUpdateFn<M, Msg, Cmd>, init: M);
    connectedCallback(): void;
}
declare function dispatch<Msg extends Message.Base>(target: HTMLElement, message: Msg): void;
export { STORE_CONTEXT_DEFAULT as CONTEXT_DEFAULT, StoreProvider as Provider, StoreService as Service, dispatch };
