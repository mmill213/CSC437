import { TemplateArgs } from './template';
import { MutationEffectMap } from './mutation';
import { Scope } from '../effects';
export declare function renderForEffects<TT extends TemplateArgs>(original: DocumentFragment, effectors: MutationEffectMap<TT>, ...scope: Scope<TT>): DocumentFragment;
