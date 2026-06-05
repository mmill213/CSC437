import { Scope } from '../effects';
import { TemplateArgs, TemplateEffect, TemplateReferenceEffect } from './template';
export type KindOfPlace = "element content" | "attr value" | "tag content";
type Place<K extends KindOfPlace> = {
    kind: K;
    nodeLabel: string;
};
export interface ElementContentPlace extends Place<"element content"> {
}
export interface AttributeValuePlace extends Place<"attr value"> {
    tagName: string;
    attrName: string;
}
export interface TagContentPlace extends Place<"tag content"> {
    tagName: string;
}
export type ReplacementPlace = ElementContentPlace | AttributeValuePlace | TagContentPlace;
export type MutationEffect<TT extends TemplateArgs> = (site: Element, fragment: DocumentFragment, ...scope: Scope<TT>) => void;
export type MutationEffectMap<TT extends TemplateArgs> = Map<string, Array<MutationEffect<TT>>>;
export declare class Mutation<TT extends TemplateArgs> {
    place: ReplacementPlace;
    constructor(place: ReplacementPlace);
    apply(_site: Element, _fragment: DocumentFragment): MutationEffect<TT> | undefined;
}
export declare class ElementContentMutation extends Mutation<TemplateArgs> {
    content: Node;
    constructor(place: ElementContentPlace, content: Node);
    apply(site: Element, fragment: DocumentFragment): undefined;
}
export declare class AttributeValueMutation extends Mutation<TemplateArgs> {
    text: string;
    name: string;
    constructor(place: AttributeValuePlace, text: string);
    apply(site: Element): undefined;
}
export type TagMutationFunction = (site: Element) => void;
export declare class TagContentMutation extends Mutation<TemplateArgs> {
    fn: TagMutationFunction;
    constructor(place: TagContentPlace, fn: TagMutationFunction);
    apply(site: Element): undefined;
}
export declare class ElementContentEffect<TT extends TemplateArgs> extends Mutation<TT> {
    fn: TemplateEffect<TT>;
    constructor(place: ElementContentPlace, fn: TemplateEffect<TT>);
    apply(_site: Element, _fragment: DocumentFragment): MutationEffect<TT>;
}
export declare class AttributeValueEffect<TT extends TemplateArgs> extends Mutation<TT> {
    fn: TemplateEffect<TT>;
    name: string;
    constructor(place: AttributeValuePlace, fn: TemplateEffect<TT>);
    apply(_site: Element, _fragment: DocumentFragment): MutationEffect<TT>;
}
export declare class TagReferenceEffect<TT extends TemplateArgs> extends Mutation<TT> {
    fn: TemplateReferenceEffect<TT>;
    constructor(place: TagContentPlace, fn: TemplateReferenceEffect<TT>);
    apply(_site: Element, _fragment: DocumentFragment): MutationEffect<TT>;
}
export {};
