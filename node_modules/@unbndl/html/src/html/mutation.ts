import { createEffect, Context, Scope } from "../effects";
import {
  TemplateArgs,
  TemplateEffect,
  TemplateReferenceEffect,
  TemplateValue
} from "./template";

export type KindOfPlace =
  | "element content"
  | "attr value"
  | "tag content";

type Place<K extends KindOfPlace> = {
  kind: K;
  nodeLabel: string;
};

export interface ElementContentPlace
  extends Place<"element content"> {}

export interface AttributeValuePlace
  extends Place<"attr value"> {
  tagName: string;
  attrName: string;
}

export interface TagContentPlace extends Place<"tag content"> {
  tagName: string;
}

export type ReplacementPlace =
  | ElementContentPlace
  | AttributeValuePlace
  | TagContentPlace;

export type MutationEffect<TT extends TemplateArgs> = (
  site: Element,
  fragment: DocumentFragment,
  ...scope: Scope<TT>
) => void;

export type MutationEffectMap<TT extends TemplateArgs> = Map<
  string,
  Array<MutationEffect<TT>>
>;

export class Mutation<TT extends TemplateArgs> {
  place: ReplacementPlace;
  constructor(place: ReplacementPlace) {
    this.place = place;
  }
  apply(
    _site: Element,
    _fragment: DocumentFragment
  ): MutationEffect<TT> | undefined {
    throw "abstract method 'apply' called";
  }
}

export class ElementContentMutation extends Mutation<TemplateArgs> {
  content: Node;

  constructor(place: ElementContentPlace, content: Node) {
    super(place);
    this.content = content;
  }

  override apply(
    site: Element,
    fragment: DocumentFragment
  ): undefined {
    const parent: Node = site.parentNode || fragment;
    parent.replaceChild(this.content, site);
  }
}

export class AttributeValueMutation extends Mutation<TemplateArgs> {
  text: string;
  name: string;

  constructor(place: AttributeValuePlace, text: string) {
    super(place);
    this.text = text;
    this.name = place.attrName;
  }

  override apply(site: Element): undefined {
    site.setAttribute(this.name, this.text);
  }
}

export type TagMutationFunction = (site: Element) => void;

export class TagContentMutation extends Mutation<TemplateArgs> {
  fn: TagMutationFunction;

  constructor(place: TagContentPlace, fn: TagMutationFunction) {
    super(place);
    this.fn = fn;
  }

  override apply(site: Element): undefined {
    this.fn(site);
  }
}

export class ElementContentEffect<
  TT extends TemplateArgs
> extends Mutation<TT> {
  fn: TemplateEffect<TT>;

  constructor(
    place: ElementContentPlace,
    fn: TemplateEffect<TT>
  ) {
    super(place);
    this.fn = fn;
  }

  override apply(
    _site: Element,
    _fragment: DocumentFragment
  ): MutationEffect<TT> {
    const key = this.place.nodeLabel;
    // console.log("Applying Element content effect", this);

    return (
      site: Element,
      fragment: DocumentFragment,
      ...scope: Scope<TT>
    ) => {
      const start = new Comment(` <<< ${key} `);
      const end = new Comment(` >>> ${key} `);
      const placeholder = new DocumentFragment();
      placeholder.replaceChildren(start, end);
      const parent = site.parentNode || fragment;
      parent.replaceChild(placeholder, site);
      createEffect<TT>(
        (...args: TT) => {
          const value = this.fn(...args);
          replaceElementContent(
            value as TemplateValue<TT>,
            start,
            end
          );
        },
        ...scope
      );
    };
  }
}

function replaceElementContent<TT extends TemplateArgs>(
  value: TemplateValue<TT>,
  start: Node,
  end: Node
) {
  const parent = start.parentNode;

  if (!parent) throw new Error("No parent for placeholder");

  const valueToNode = (v: TemplateValue<TT>) => {
    if (Array.isArray(v)) {
      const frag = new DocumentFragment();
      const nodes = v.map(valueToNode);
      frag.replaceChildren(...nodes);
      return frag;
    } else if (v instanceof Node) {
      return v;
    } else {
      return new Text(v?.toString() || "");
    }
  };

  const node = valueToNode(value);

  // console.log("📸 Rendered for view:", value, node);

  let p = start.nextSibling;
  while (p && p !== end) {
    const old = p;
    p = p.nextSibling;
    parent.removeChild(old);
  }

  if (node) parent.insertBefore(node, end);
}

export class AttributeValueEffect<
  TT extends TemplateArgs
> extends Mutation<TT> {
  fn: TemplateEffect<TT>;
  name: string;

  constructor(
    place: AttributeValuePlace,
    fn: TemplateEffect<TT>
  ) {
    super(place);
    this.fn = fn;
    this.name = place.attrName;
  }

  override apply(
    _site: Element,
    _fragment: DocumentFragment
  ): MutationEffect<TT> {
    return (site: Element, _, ...scope: Scope<TT>) =>
      createEffect<TT>(
        (...args: TT) => {
          const value = this.fn(...args);
          replaceAttributeValue(
            value as TemplateValue<TT>,
            site,
            this.name
          );
        },
        ...scope
      );
  }
}

function replaceAttributeValue<TT extends TemplateArgs>(
  value: TemplateValue<TT>,
  site: Element,
  attrName: string
) {
  const special = attrName.match(/^([.$])(.+)$/);
  if (special) {
    const [_, pre, name] = special;
    switch (pre) {
      case ".":
        (site as unknown as { [name]: any })[name] = value;
        break;
      case "$":
        if (
          "viewModel" in site &&
          site.viewModel instanceof Context
        ) {
          (
            site as unknown as {
              viewModel: Context<{ [name]: any }>;
            }
          ).viewModel.set(name, value);
        }
        break;
    }
  } else {
    switch (typeof value) {
      case "string":
        site.setAttribute(attrName, value);
        break;
      case "undefined":
      case "object": // i.e., null
      case "boolean":
        if (value) site.setAttribute(attrName, attrName);
        else site.removeAttribute(attrName);
        break;
      default:
        site.setAttribute(attrName, value?.toString());
    }
  }
}

export class TagReferenceEffect<
  TT extends TemplateArgs
> extends Mutation<TT> {
  fn: TemplateReferenceEffect<TT>;

  constructor(
    place: TagContentPlace,
    fn: TemplateReferenceEffect<TT>
  ) {
    super(place);
    this.fn = fn;
  }

  override apply(
    _site: Element,
    _fragment: DocumentFragment
  ): MutationEffect<TT> {
    return (site: Element, _, ...scope: Scope<TT>) =>
      createEffect<TT>(
        (...args: TT) => {
          const value = this.fn(...args);
          if (typeof value === "function") value(site);
        },
        ...scope
      );
  }
}
