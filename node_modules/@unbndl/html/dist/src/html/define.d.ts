type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};
export declare function define(defns: ElementDefinitions): CustomElementRegistry;
export {};
