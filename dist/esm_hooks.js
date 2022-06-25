"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.load = void 0;
const TypeScriptLoader_1 = require("./loader/TypeScriptLoader");
async function load(url, context, defaultLoad) {
    if (TypeScriptLoader_1.TypeScriptLoader.getInfo(url)) {
        const loader = new TypeScriptLoader_1.TypeScriptLoader(url);
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
exports.load = load;
async function resolve(specifier, context, defaultResolve) {
    const { parentURL = undefined } = context;
    const tsInfo = TypeScriptLoader_1.TypeScriptLoader.getInfo(specifier);
    if (tsInfo != null) {
        return {
            url: new URL(specifier, parentURL).href
        };
    }
    return defaultResolve(specifier, context, defaultResolve);
}
exports.resolve = resolve;
