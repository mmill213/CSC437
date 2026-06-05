import { Source, SourceEffect } from './source.ts';
export declare function fromInputs<T extends object>(subject: Node): FromInputs<T>;
declare class FromInputs<T extends object> implements Source<T> {
    subject: Node;
    constructor(subject: Node);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}
export {};
