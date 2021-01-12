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
// tslint:disable: no-console
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
exports.default = {
    action: action,
    att: att,
    code: code,
    error: error,
    info: info,
    json: json,
    newline: newline,
    red: red,
    title: title
};
function action(text) {
    console.log(chalk_1.default.cyan(text));
}
function att() {
    var e_1, _a;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var maxWidth = 0;
    var pairs = [];
    for (var i = 0; i < items.length; i += 2) {
        var key = items[i];
        var val = items[i + 1];
        maxWidth = Math.max(maxWidth, key.length);
        pairs.push([key, val]);
    }
    maxWidth++;
    try {
        for (var pairs_1 = __values(pairs), pairs_1_1 = pairs_1.next(); !pairs_1_1.done; pairs_1_1 = pairs_1.next()) {
            var _b = __read(pairs_1_1.value, 2), key = _b[0], val = _b[1];
            console.log(chalk_1.default.yellowBright(pad(key + ":", maxWidth)), chalk_1.default.bold.whiteBright(val));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (pairs_1_1 && !pairs_1_1.done && (_a = pairs_1.return)) _a.call(pairs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function code(filename, lineNum, linePos) {
    if (linePos === void 0) { linePos = -1; }
    var PAD = 5;
    var MARGIN = 2;
    var lines = fs_1.default.readFileSync(filename).toString().split("\n");
    var firstLine = Math.max(1, lineNum - MARGIN);
    var lastLine = Math.min(lines.length, lineNum + MARGIN);
    for (var i = firstLine; i <= lastLine; i++) {
        var line = lines[i - 1];
        console.log(chalk_1.default.gray(padR("" + i, PAD)) + " " + line);
        if (linePos > -1 && i === lineNum) {
            console.log(chalk_1.default.bold.redBright(padR("^", PAD + " ".length + linePos)));
        }
    }
}
function error(messageOrObject, maxLineLength) {
    var e_2, _a;
    if (maxLineLength === void 0) { maxLineLength = 120; }
    var message = typeof messageOrObject === 'string'
        ? messageOrObject : JSON.stringify(messageOrObject, null, "  ");
    var maxWidth = 0;
    var rawLines = message.split("\n");
    var linesToDisplay = [];
    try {
        for (var rawLines_1 = __values(rawLines), rawLines_1_1 = rawLines_1.next(); !rawLines_1_1.done; rawLines_1_1 = rawLines_1.next()) {
            var line = rawLines_1_1.value;
            if (line.length <= maxLineLength) {
                linesToDisplay.push(line);
                maxWidth = Math.max(maxWidth, line.length);
            }
            else {
                maxWidth = maxLineLength;
                var currentLine = line;
                while (currentLine.length > maxLineLength) {
                    linesToDisplay.push(currentLine.substr(0, maxLineLength));
                    currentLine = currentLine.substr(maxLineLength);
                }
                if (currentLine.length > 0) {
                    linesToDisplay.push(currentLine);
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rawLines_1_1 && !rawLines_1_1.done && (_a = rawLines_1.return)) _a.call(rawLines_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var ruler = "+-" + repeat("-", maxWidth) + "-+";
    console.log(chalk_1.default.bgRed.whiteBright((ruler + "\n" + linesToDisplay.map(function (s) { return "| " + pad(s, maxWidth) + " |"; }).join("\n") + "\n" + ruler + "\n").trim()));
}
function info(text) {
    console.log(text);
}
function json(obj) {
    console.log(JSON.stringify(obj, null, "  "));
}
function newline() {
    console.log();
}
function red(text) {
    console.log(chalk_1.default.red(text));
}
function title(name, version) {
    var line = "+-" + repeat("-", name.length + version.length + 1) + "-+";
    console.log(chalk_1.default.white(line + "\n| " + chalk_1.default.whiteBright(name) + " " + chalk_1.default.bold(version) + " |\n" + line + "\n"));
}
function repeat(char, length) {
    if (char.length === 0) {
        // tslint:disable-next-line: no-parameter-reassignment
        char = " ";
    }
    var out = char;
    while (out.length < length) {
        out = "" + out + char;
    }
    return out.substr(0, length);
}
function pad(text, size) {
    var out = text;
    while (out.length < size)
        out += " ";
    return out.substr(0, size);
}
function padR(text, size) {
    var out = text;
    while (out.length < size)
        out = " " + out;
    return out.substr(0, size);
}
//# sourceMappingURL=print.js.map