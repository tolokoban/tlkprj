"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = __importDefault(require("../package.json"));
var assets_1 = __importDefault(require("./assets"));
var print_1 = __importDefault(require("./print"));
var args_1 = __importDefault(require("./args"));
var ts_1 = __importDefault(require("./ts"));
try {
    print_1.default.title("Tolokoban Projects", package_json_1.default.version);
    var args = args_1.default.parse();
    if (args.debug)
        print_1.default.json(args);
    build(args);
}
catch (ex) {
    print_1.default.error(ex);
}
function build(args) {
    var successful = ts_1.default.compile(args.projectRootPath);
    if (successful) {
        assets_1.default.copy(args.projectRootPath);
    }
}
//# sourceMappingURL=index.js.map