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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var print_1 = __importDefault(require("./print"));
exports.default = {
    compile: compile
};
function compile(root) {
    var e_1, _a, e_2, _b;
    print_1.default.action("Compiling...");
    var result = child_process_1.default.spawnSync("tsc", ["-p", root]);
    var stdout = result.stdout.toString();
    if (result.status !== 0) {
        var maxDetailedErrors = 3;
        try {
            for (var _c = __values(stdout.split("\n")), _d = _c.next(); !_d.done; _d = _c.next()) {
                var line = _d.value;
                if (line.indexOf(": error TS") === -1)
                    continue;
                var pos = line.indexOf(":");
                var _e = parseErrorLine(line.substr(0, pos).trim()), name_1 = _e.name, lineNum = _e.lineNum, linePos = _e.linePos;
                var value = line.substr(pos + 1).trim();
                var fullPath = path_1.default.resolve(name_1);
                var filename = path_1.default.relative(root, fullPath);
                if (maxDetailedErrors-- > 0) {
                    print_1.default.error(filename + "\n" + value);
                    print_1.default.code(fullPath, lineNum, linePos);
                    print_1.default.newline();
                }
                else {
                    print_1.default.red(filename + " " + value + " [line " + lineNum + "]");
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    }
    var attribs = {};
    try {
        for (var _f = __values(stdout.split("\n")), _g = _f.next(); !_g.done; _g = _f.next()) {
            var line = _g.value;
            var pos = line.indexOf(":");
            var name_2 = line.substr(0, pos).trim();
            var value = line.substr(pos + 1).trim();
            attribs[name_2.toLowerCase()] = value;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    print_1.default.att("Compilation time", attribs["total time"]);
    return true;
}
function parseErrorLine(line) {
    var parenthesis = line.lastIndexOf("(");
    var name = line.substr(0, parenthesis);
    var rest = line.substr(parenthesis + 1);
    var _a = __read(rest.substr(0, rest.length - 1).split(","), 2), num = _a[0], pos = _a[1];
    return {
        name: name,
        lineNum: parseInt(num, 10),
        linePos: parseInt(pos, 10)
    };
}
//# sourceMappingURL=ts.js.map