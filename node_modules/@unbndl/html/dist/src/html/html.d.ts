import { Template, TemplateArgs, TemplateParameter } from './template';
export declare function html<TT extends TemplateArgs>(template: TemplateStringsArray, ...params: Array<TemplateParameter<TT>>): Template<TT>;
