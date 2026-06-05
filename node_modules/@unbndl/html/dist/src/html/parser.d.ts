import { Template, TemplateArgs, TemplateParameter } from './template';
import { KindOfPlace, Mutation, ReplacementPlace } from './mutation';
export declare class TemplateParser<TT extends TemplateArgs> {
    static parser: DOMParser;
    docType: DOMParserSupportedType;
    plugins: Array<Replacement<TT>>;
    constructor(docType?: DOMParserSupportedType);
    use(plugin: Array<Replacement<TT>>): void;
    parse(template: TemplateStringsArray, params: Array<TemplateParameter<TT>>): Template<TT>;
    static OPEN_RE: RegExp;
    static IN_TAG_RE: RegExp;
    static ATTR_RE: RegExp;
    static CLOSE_RE: RegExp;
    classifyPlace(i: number, template: TemplateStringsArray): ReplacementPlace;
    tryReplacements(place: ReplacementPlace, param: TemplateParameter<TT>): Mutation<TT> | undefined;
}
type TypeCheckFunction<TT extends TemplateArgs> = (param: TemplateParameter<TT>, sub: Replacement<TT>) => boolean;
export interface Replacement<TT extends TemplateArgs> {
    place: KindOfPlace;
    types: Array<string> | TypeCheckFunction<TT>;
    mutator(place: ReplacementPlace, value: TemplateParameter<TT>): Mutation<TT>;
}
export {};
