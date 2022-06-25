export interface LoaderContext {
    format: string;
    importAssertions?: Record<string, any>;
}
export interface LoadedSource {
    format: string;
    source: string | ArrayBuffer | SharedArrayBuffer | Uint8Array;
}
export declare function load(url: string, context: LoaderContext, defaultLoad: Function): Promise<LoadedSource>;
export interface ResolverContext {
    conditions: string[];
    parentURL: string | undefined;
}
export declare function resolve(specifier: string, context: ResolverContext, defaultResolve: Function): Promise<{
    url: string;
}>;
