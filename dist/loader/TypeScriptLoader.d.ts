export interface TranspileOptions {
    cjs?: boolean;
    jsx?: {
        jsxFactory?: string;
        jsxFragmentFactory?: string;
        jsxImportSource?: string;
    };
}
export declare class TypeScriptLoader {
    url: URL;
    constructor(url: string);
    readSourceFile(): Promise<string>;
    readSourceFileSync(): string;
    private __transpile;
    transpileSync(options?: TranspileOptions): {
        data: string;
        format: string;
    };
    transpile(options?: TranspileOptions): Promise<{
        data: string;
        format: string;
    }>;
    static REGEX: RegExp;
    static getInfo(src: string): {
        ext: string;
        meta: {
            cjs: boolean;
            module: boolean;
            jsx: boolean;
        };
    } | null;
}
