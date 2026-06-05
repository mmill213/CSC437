import { NameMapping, Source } from './source.ts';
import { Context, Template } from '@unbndl/html';
export type ViewState<T = object> = {
    [K in keyof Partial<T>]: any;
};
export declare class ViewModel<T extends ViewState<T>> extends Context<T> {
    constructor(init: T, adoptedContext?: Context<T>);
    get $(): Readonly<T>;
    with<S extends ViewState<T> = T>(source: Source<S>, ...keys: Array<keyof S & keyof T>): ViewModel<T>;
    withCalculated<S extends ViewState>(source: Source<S>, mapping: NameMapping<T, S>): ViewModel<T>;
    withRenamed<S extends ViewState>(source: Source<S>, renaming: {
        [K in keyof Partial<T>]: keyof S;
    }): ViewModel<T>;
    merge<S extends ViewState<T>>(source: Source<S>): ViewModel<T>;
    render(template: Template<[T]>): DocumentFragment;
}
export declare function createViewModel<T extends object>(): {} extends T ? ViewModel<T> : never;
export declare function createViewModel<T extends object>(init: T): ViewModel<T>;
