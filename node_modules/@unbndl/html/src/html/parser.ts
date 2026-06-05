import {
  Template,
  TemplateArgs,
  TemplateParameter,
  createTemplate
} from "./template";
import { Scope } from "../effects";
import {
  KindOfPlace,
  Mutation,
  MutationEffectMap,
  ReplacementPlace
} from "./mutation";
import { renderForEffects } from "./render";

export class TemplateParser<TT extends TemplateArgs> {
  static parser = new DOMParser();
  docType: DOMParserSupportedType = "text/html";
  plugins: Array<Replacement<TT>> = [];

  constructor(docType?: DOMParserSupportedType) {
    if (docType) this.docType = docType;
  }

  use(plugin: Array<Replacement<TT>>) {
    this.plugins = this.plugins.concat(plugin);
  }

  parse(
    template: TemplateStringsArray,
    params: Array<TemplateParameter<TT>>
  ): Template<TT> {
    const postProcess: {
      [node: string]: Array<Mutation<TT>>;
    } = {};
    const stringToParse = template
      .map((s, i) => {
        if (i >= params.length) return [s]; // no more parameters
        const param = params[i];
        const place = this.classifyPlace(i, template);
        const mutation = this.tryReplacements(place, param);
        // console.log("Place mutation:", i, place, mutation);
        if (mutation) {
          const post = postProcess[place.nodeLabel];
          if (post) post.push(mutation);
          else postProcess[place.nodeLabel] = [mutation];
          switch (place.kind) {
            case "attr value":
              return [s, `"" data-${place.nodeLabel}`];
            case "tag content":
              return [s, `data-${place.nodeLabel}`];
            case "element content":
              return [s, `<ins data-${place.nodeLabel}></ins>`];
          }
        } else {
          console.error(
            "No match for template parameter",
            place,
            param
          );
          throw `Failed to render template parameter ${i} around ${s}`;
        }
        return [s];
      })
      .flat()
      .join("");

    const doc = TemplateParser.parser.parseFromString(
      stringToParse,
      this.docType
    );

    const collection = doc.head.childElementCount
      ? doc.head.children
      : doc.body.children;
    const fragment = new DocumentFragment();
    fragment.replaceChildren(...collection);

    const effectors: MutationEffectMap<TT> = new Map();

    for (const label in postProcess) {
      const site: HTMLElement | null = fragment.querySelector(
        `[data-${label}]`
      );
      // console.log("Post-processing:", label, site);
      if (site) {
        const mutations = postProcess[label];
        mutations.forEach((m) => {
          const effector = m.apply(site, fragment);
          if (effector) {
            let list = effectors.get(label);
            if (list) list.push(effector);
            else effectors.set(label, [effector]);
          }
        });
      }
    }

    return createTemplate(fragment, (...scope: Scope<TT>) =>
      renderForEffects<TT>(fragment, effectors, ...scope)
    );
  }

  static OPEN_RE = /<([a-zA-z][$a-zA-Z0-9.-]*)\s+[^>]*$/;
  static IN_TAG_RE = /^(\s+|[^<>]*|"[^"]*")*$/;
  static ATTR_RE = /([$.]?[a-zA-Z][$a-zA-Z0-9.-]*)=\s*$/;
  static CLOSE_RE = /[/]?>[^<]*$/;

  classifyPlace(
    i: number,
    template: TemplateStringsArray
  ): ReplacementPlace {
    let tagOpen = null;
    // console.log("Classifying place", i, template);
    for (let prev = i; prev >= 0; prev--) {
      const tagEnd = template[prev].match(
        TemplateParser.CLOSE_RE
      );
      if (tagEnd) break;
      tagOpen = template[prev].match(TemplateParser.OPEN_RE);
      if (tagOpen) break;
      const tagContinue = template[prev].match(
        TemplateParser.IN_TAG_RE
      );
      if (!tagContinue) break;
    }
    if (tagOpen) {
      // console.log("Checking for attributes in open tag", template[i], tagOpen);
      const tagAttr = template[i].match(TemplateParser.ATTR_RE);
      if (tagAttr)
        return {
          kind: "attr value",
          nodeLabel: `node${i}`,
          tagName: tagOpen[1],
          attrName: tagAttr[1]
        };
      return {
        kind: "tag content",
        nodeLabel: `node${i}`,
        tagName: tagOpen[1]
      };
    }
    return { kind: "element content", nodeLabel: `node${i}` };
  }

  tryReplacements(
    place: ReplacementPlace,
    param: TemplateParameter<TT>
  ): Mutation<TT> | undefined {
    const replacements = this.plugins;
    for (let i = 0; i < replacements.length; i++) {
      const sub = replacements[i];
      if (place.kind === sub.place && checkType(param, sub)) {
        const mutation = sub.mutator(place, param);
        // console.log("Using Mutation", sub, mutation);
        return mutation;
      }
    }
    return undefined;
  }
}

type TypeCheckFunction<TT extends TemplateArgs> = (
  param: TemplateParameter<TT>,
  sub: Replacement<TT>
) => boolean;

export interface Replacement<TT extends TemplateArgs> {
  place: KindOfPlace;
  types: Array<string> | TypeCheckFunction<TT>;
  mutator(
    place: ReplacementPlace,
    value: TemplateParameter<TT>
  ): Mutation<TT>;
}

function checkType<TT extends TemplateArgs>(
  param: TemplateParameter<TT>,
  sub: Replacement<TT>
): boolean {
  if (typeof sub.types === "function")
    return sub.types(param, sub);
  return sub.types.includes(typeof param);
}
