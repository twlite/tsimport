"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptLoader = void 0;
const ts = require("typescript");
const fs = require("node:fs");
class TypeScriptLoader {
    constructor(url) {
        this.url = new URL(url);
    }
    async readSourceFile() {
        if (!fs.existsSync(this.url))
            throw new Error(`Could not locate source file at ${this.url}`);
        try {
            const data = await fs.promises.readFile(this.url, { encoding: "utf-8" });
            return data;
        }
        catch {
            throw new Error(`Could not load ${this.url}`);
        }
    }
    readSourceFileSync() {
        if (!fs.existsSync(this.url))
            throw new Error(`Could not locate source file at ${this.url}`);
        try {
            const data = fs.readFileSync(this.url, { encoding: "utf-8" });
            return data;
        }
        catch {
            throw new Error(`Could not load ${this.url}`);
        }
    }
    __transpile(src, options) {
        try {
            const file = ts.transpileModule(src, {
                compilerOptions: {
                    module: options?.cjs ? ts.ModuleKind.CommonJS : ts.ModuleKind.ES2020,
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    allowJs: true,
                    alwaysStrict: true,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    jsx: ts.JsxEmit.React,
                    jsxFactory: options?.jsx?.jsxFactory || "React",
                    jsxFragmentFactory: options?.jsx?.jsxFragmentFactory || "React.Fragment"
                }
            });
            if (file.diagnostics?.length) {
                const messages = [];
                for (const diagnostic of file.diagnostics) {
                    if (diagnostic.code === 5047)
                        continue;
                    messages.push(`[TS${diagnostic.code}] Syntax Error: ${diagnostic.messageText}`);
                }
                if (messages.length)
                    throw new Error(messages.join("\n\n"));
            }
            return {
                data: file.outputText,
                format: "module"
            };
        }
        catch (e) {
            throw new Error(`Failed to load source: ${e}`);
        }
    }
    transpileSync(options) {
        return this.__transpile(this.readSourceFileSync(), options);
    }
    async transpile(options) {
        return this.__transpile(await this.readSourceFile(), options);
    }
    static getInfo(src) {
        const match = this.REGEX.exec(src);
        if (!match)
            return null;
        const meta = {
            cjs: match[0] === ".ts",
            module: match[0] === ".mts",
            jsx: match[0] === ".tsx"
        };
        return {
            ext: match[0],
            meta
        };
    }
}
exports.TypeScriptLoader = TypeScriptLoader;
TypeScriptLoader.REGEX = /\.ts$|\.mts$|\.tsx$/;
