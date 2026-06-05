import { fromService } from "@unbndl/service";
import * as Auth from "./auth.ts";

export function fromAuth(
  target: HTMLElement,
  contextLabel: string = Auth.CONTEXT_DEFAULT
) {
  return fromService<Auth.Model>(target, contextLabel);
}
