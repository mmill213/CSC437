import { Context } from "@unbndl/html";
import { Auth, fromAuth } from "@unbndl/auth";
import { Message, Provider, Service } from "@unbndl/service";
import { createViewModel } from "@unbndl/view";

const STORE_CONTEXT_DEFAULT = "context:store";

type UpdateFn<
  M extends object,
  Msg extends Message.Base,
  Cmd extends Message.Base
> = (model: M, message: Msg | Cmd) => M | Message.Async<M, Cmd>;

type AuthorizedUpdateFn<
  M extends object,
  Msg extends Message.Base,
  Cmd extends Message.Base
> = (
  model: M,
  message: Msg | Cmd,
  auth: Auth.Model
) => M | Message.Async<M, Cmd>;

class StoreService<
  M extends object,
  Msg extends Message.Base,
  Cmd extends Message.Base
> extends Service<Msg | Cmd, M> {
  static EVENT_TYPE = "store:message";

  constructor(
    context: Context<M>,
    update: UpdateFn<M, Msg, Cmd>
  ) {
    super(
      (message: Msg | Cmd, model: M) => update(model, message),
      context,
      StoreService.EVENT_TYPE
    );
  }
}

class StoreProvider<
  M extends object,
  Msg extends Message.Base,
  Cmd extends Message.Base
> extends Provider<M> {
  viewModel = createViewModel<Auth.Model>({
    authenticated: false
  }).with(fromAuth(this), "authenticated", "username", "token");

  _updateFn: AuthorizedUpdateFn<M, Msg, Cmd>;

  constructor(
    updateFn: AuthorizedUpdateFn<M, Msg, Cmd>,
    init: M
  ) {
    super(init, STORE_CONTEXT_DEFAULT);
    this._updateFn = updateFn;
  }

  connectedCallback() {
    const service = new StoreService<M, Msg, Cmd>(
      this.context,
      (model: M, message: Msg | Cmd) =>
        this._updateFn(
          model,
          message,
          this.viewModel.toObject()
        )
    );
    service.attach(this);
  }
}

function dispatch<Msg extends Message.Base>(
  target: HTMLElement,
  message: Msg
) {
  console.log("📨 Dispatching message:", message, target);
  target.dispatchEvent(
    new Message.Dispatch<Msg>(message, StoreService.EVENT_TYPE)
  );
}

export {
  STORE_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
  StoreProvider as Provider,
  StoreService as Service,
  dispatch
};
