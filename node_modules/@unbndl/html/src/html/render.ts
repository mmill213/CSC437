import { TemplateArgs } from "./template";
import { MutationEffectMap } from "./mutation";
import { Scope } from "../effects";

export function renderForEffects<TT extends TemplateArgs>(
  original: DocumentFragment,
  effectors: MutationEffectMap<TT>,
  ...scope: Scope<TT>
): DocumentFragment {
  const fragment = original.cloneNode(true) as DocumentFragment;

  // console.log("🎞️ Rendering for effects:", fragment);
  Array.from(effectors.entries()).forEach(
    ([label, mutations]) => {
      const site: HTMLElement | null = fragment.querySelector(
        `[data-${label}]`
      );
      if (site)
        mutations.forEach((fn) => fn(site, fragment, ...scope));
    }
  );
  return fragment;
}
