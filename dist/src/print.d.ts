declare const _default: {
    action: typeof action;
    att: typeof att;
    code: typeof code;
    error: typeof error;
    info: typeof info;
    json: typeof json;
    newline: typeof newline;
    red: typeof red;
    status: typeof status;
    title: typeof title;
};
export default _default;
declare function action(text: string): void;
declare function att(...items: string[]): void;
declare function code(filename: string, lineNum: number, linePos?: number): void;
declare function error(messageOrObject: any, maxLineLength?: number): void;
declare function info(text: string): void;
declare function json(obj: any): void;
declare function newline(): void;
declare function red(text: string): void;
declare function status(name: string, message?: string): void;
declare function title(name: string, version: string): void;
//# sourceMappingURL=print.d.ts.map