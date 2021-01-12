"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var json5_1 = __importDefault(require("json5"));
var print_1 = __importDefault(require("./print"));
var EXTENSIONS = [
    '.css', '.png', '.jpg', '.jpeg', '.gif', 'webp',
    '.yaml', '.yml', '.json', '.woff2', '.ttf',
    '.vert', '.frag'
];
exports.default = { copy: copy };
var Project = /** @class */ (function () {
    function Project(root) {
        this.root = root;
        this.size = 0;
    }
    Project.prototype.loadJSON = function (filename) {
        var fullpath = path_1.default.resolve(this.root, filename);
        if (!fs_1.default.existsSync(fullpath)) {
            throw "Unable to find \"" + filename + "\":\n" + fullpath;
        }
        try {
            var content = fs_1.default.readFileSync(fullpath).toString();
            return json5_1.default.parse(content);
        }
        catch (ex) {
            throw "\"" + filename + "\" is not a valid JSON file!\n" + fullpath;
        }
    };
    Project.prototype.saveJSON = function (filename, data) {
        var fullpath = path_1.default.resolve(this.root, filename);
        fs_1.default.writeFileSync(fullpath, JSON.stringify(data, null, "    "));
    };
    Project.prototype.copy = function (relSrc, relDst) {
        var e_1, _a, e_2, _b;
        var root = this.root;
        var src = path_1.default.resolve(root, relSrc);
        var dst = path_1.default.resolve(root, relDst);
        if (!fs_1.default.existsSync(dst)) {
            fs_1.default.mkdirSync(dst);
        }
        var files = fs_1.default.readdirSync(src);
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var file = files_1_1.value;
                var path = path_1.default.resolve(src, file);
                var stats = fs_1.default.statSync(path);
                if (stats.isDirectory()) {
                    this.copy(relSrc + "/" + file, relDst + "/" + file);
                }
                else {
                    if (file === 'package.json')
                        continue;
                    if (file === 'package-lock.json')
                        continue;
                    try {
                        for (var EXTENSIONS_1 = (e_2 = void 0, __values(EXTENSIONS)), EXTENSIONS_1_1 = EXTENSIONS_1.next(); !EXTENSIONS_1_1.done; EXTENSIONS_1_1 = EXTENSIONS_1.next()) {
                            var ext = EXTENSIONS_1_1.value;
                            if (file.endsWith(ext)) {
                                this.size += stats.size;
                                fs_1.default.copyFileSync(path, path_1.default.resolve(dst, file));
                                break;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (EXTENSIONS_1_1 && !EXTENSIONS_1_1.done && (_b = EXTENSIONS_1.return)) _b.call(EXTENSIONS_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return Project;
}());
function copy(projectRootPath) {
    print_1.default.action("Copying assets...");
    var prj = new Project(projectRootPath);
    var tsconfig = prj.loadJSON("tsconfig.json");
    if (!tsconfig.compilerOptions) {
        throw "Missing entry 'compilerOptions' in tsconfig.json!";
    }
    if (typeof tsconfig.compilerOptions.outDir !== 'string') {
        throw "Missing entry 'compilerOptions.outDir' in tsconfig.json!";
    }
    var srcRoot = "src";
    var dstRoot = tsconfig.compilerOptions.outDir;
    prj.copy(srcRoot, dstRoot);
    if (prj.size === 0) {
        print_1.default.info("No asset found.");
    }
    else if (prj.size < 1024) {
        print_1.default.att('Assets total size', "Less than 1 Kb");
    }
    else {
        print_1.default.att('Assets total size', (prj.size >> 10) + " Kb");
    }
    updatePackage(prj, dstRoot);
}
function updatePackage(prj, dstRoot) {
    // Copy package.json and change attributes "main" and "types" to be local.
    var config = prj.loadJSON("package.json");
    config.main = "index.js";
    config.types = "index.d.ts";
    delete config.files;
    delete config.scripts;
    delete config.browserslist;
    prj.saveJSON(dstRoot + "/package.json", config);
}
//# sourceMappingURL=assets.js.map