declare const _default: {
    parse: typeof parse;
    usage: typeof usage;
};
export default _default;
export interface IArguments {
    command: "build";
    debug: boolean;
    projectRootPath: string;
    watch: boolean;
}
declare function parse(): IArguments;
declare function usage(): void;
//# sourceMappingURL=args.d.ts.map