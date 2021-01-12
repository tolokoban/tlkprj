#! /usr/bin/env node
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var package_json_1 = __importDefault(require("../package.json"));
var assets_1 = __importDefault(require("./assets"));
var print_1 = __importDefault(require("./print"));
var args_1 = __importDefault(require("./args"));
var ts_1 = __importDefault(require("./ts"));
try {
    print_1.default.title("Tolokoban Projects", package_json_1.default.version);
    var args_2 = args_1.default.parse();
    if (args_2.debug)
        print_1.default.json(args_2);
    build(args_2);
    if (args_2.watch) {
        var event_1 = Debouncer(function (type, path) {
            print_1.default.status(type, path);
            build(args_2);
        }, 200);
        var watchedPath = path_1.default.resolve(args_2.projectRootPath, "src/");
        watch(watchedPath, event_1, new Set());
    }
}
catch (ex) {
    if (process.argv.includes("--debug")) {
        console.error(ex);
    }
    print_1.default.error(ex);
}
function watch(folder, event, watchedFolders) {
    var e_1, _a;
    if (watchedFolders.has(folder))
        return;
    watchedFolders.add(folder);
    print_1.default.action("Watching \"" + folder + "\"...");
    fs_1.default.watch(folder, { recursive: false }, function (eventType, filename) {
        var path = path_1.default.resolve(folder, filename);
        if (fs_1.default.existsSync(path)) {
            var stats = fs_1.default.statSync(path);
            if (stats.isDirectory()) {
                watch(path, event, watchedFolders);
            }
            event(eventType, path);
        }
        else {
            if (watchedFolders.has(path)) {
                // We need to unwatch this folder.
                print_1.default.action("Stop watching on \"" + path + "\"...");
                fs_1.default.unwatchFile(path);
                watchedFolders.delete(path);
            }
            event("delete", path);
        }
    });
    var files = fs_1.default.readdirSync(folder);
    try {
        for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
            var file = files_1_1.value;
            var path = path_1.default.resolve(folder, file);
            var stats = fs_1.default.statSync(path);
            if (stats.isDirectory()) {
                watch(path, event, watchedFolders);
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
}
function build(args) {
    var successful = ts_1.default.compile(args.projectRootPath);
    if (successful) {
        assets_1.default.copy(args.projectRootPath);
    }
}
function Debouncer(action, delay) {
    var timer = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(function () {
            timer = null;
            action.apply(void 0, __spread(args));
        }, delay);
    };
}
//# sourceMappingURL=index.js.map