import { TypeScriptLoader } from "./loader/TypeScriptLoader";

export interface LoaderContext {
    format: string;
    importAssertions?: Record<string, any>;
}

export interface LoadedSource {
    format: string;
    source: string | ArrayBuffer | SharedArrayBuffer | Uint8Array;
}

export async function load(url: string, context: LoaderContext, defaultLoad: Function): Promise<LoadedSource> {  
    if (TypeScriptLoader.getInfo(url)) {
        const loader = new TypeScriptLoader(url);
        const transpiled = await loader.transpile({
            jsx: context.importAssertions?.jsx
        });

        return {
            format: transpiled.format,
            source: transpiled.data
        };
    }

    return await defaultLoad(url, context, defaultLoad);
}

export interface ResolverContext {
    conditions: string[];
    parentURL: string | undefined;
}

export async function resolve(specifier: string, context: ResolverContext, defaultResolve: Function): Promise<{ url: string; }> {
    const { parentURL = undefined } = context;

    const tsInfo = TypeScriptLoader.getInfo(specifier);
    if (tsInfo != null) {
        return {
            url: new URL(specifier, parentURL).href
        };
    }
    
    return defaultResolve(specifier, context, defaultResolve);
}