import * as Message from "./message";

export type Update<
  Msg extends Message.Base,
  M extends object
> = (message: Msg, model: M) => M | Message.Async<M, Msg>;
