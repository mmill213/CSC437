import { Source, SourceEffect } from './source.ts';
export declare function fromAttributes<T extends object>(subject: Element): FromAttributes<T>;
declare class FromAttributes<T extends object> implements Source<T> {
    subject: Element;
    constructor(subject: Element);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}
export {};
