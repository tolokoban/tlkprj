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
var path_1 = __importDefault(require("path"));
exports.default = {
    parse: parse,
    usage: usage
};
var AVAILABLE_FLAGS = [
    "--debug",
    "-p", "--project",
    "-w", "--watch"
];
function parse() {
    var options = parseOptions();
    var final = {
        command: "build",
        debug: options.hasFlag("debug"),
        projectRootPath: process.cwd(),
        watch: options.hasFlag("w", "watch")
    };
    var projectRootPath = options.getString("p", "project");
    if (projectRootPath) {
        final.projectRootPath = path_1.default.resolve(projectRootPath);
    }
    return final;
}
function usage() {
}
var OptionsBag = /** @class */ (function () {
    function OptionsBag(options) {
        this.options = options;
    }
    OptionsBag.prototype.getString = function () {
        var e_1, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        var options = this.options;
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var abbrev = names_1_1.value;
                var name_1 = abbrev.length === 1 ? "-" + abbrev : "--" + abbrev;
                var value = options[name_1];
                if (typeof value === "string")
                    return value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    OptionsBag.prototype.hasFlag = function () {
        var e_2, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        var options = this.options;
        try {
            for (var names_2 = __values(names), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                var abbrev = names_2_1.value;
                var name_2 = abbrev.length === 1 ? "-" + abbrev : "--" + abbrev;
                var value = options[name_2];
                if (value === true)
                    return true;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (names_2_1 && !names_2_1.done && (_a = names_2.return)) _a.call(names_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    return OptionsBag;
}());
function parseOptions() {
    var e_3, _a;
    var args = process.argv.splice(2);
    var options = {};
    var name = "";
    try {
        for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
            var arg = args_1_1.value;
            if (arg.startsWith("-")) {
                name = arg;
                if (!AVAILABLE_FLAGS.includes(name)) {
                    throw "Invalid flag: \"" + arg + "\"!";
                }
                options[name] = true;
            }
            else {
                var currentValue = options[name];
                if (typeof currentValue === 'undefined' || typeof currentValue === 'boolean') {
                    options[name] = arg;
                }
                else if (Array.isArray(currentValue)) {
                    currentValue.push(arg);
                }
                else {
                    options[name] = [currentValue, arg];
                }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return new OptionsBag(options);
}
//# sourceMappingURL=args.js.map