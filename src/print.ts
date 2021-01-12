// tslint:disable: no-console
import FS from 'fs'
import Chalk from 'chalk'

export default {
    action,
    att,
    code,
    error,
    info,
    json,
    newline,
    red,
    title
}


function action(text: string) {
    console.log(Chalk.cyan(text))
}

function att(...items: string[]) {
    let maxWidth = 0
    const pairs: Array<[string, string]> = []
    for (let i = 0; i < items.length; i += 2) {
        const key = items[i]
        const val = items[i + 1]
        maxWidth = Math.max(maxWidth, key.length)
        pairs.push([key, val])
    }
    maxWidth++
    for (const [key, val] of pairs) {
        console.log(Chalk.yellowBright(pad(`${key}:`, maxWidth)), Chalk.bold.whiteBright(val))
    }
}

function code(filename: string, lineNum: number, linePos = -1) {
    const PAD = 5
    const MARGIN = 2
    const lines = FS.readFileSync(filename).toString().split("\n")
    const firstLine = Math.max(1, lineNum - MARGIN)
    const lastLine = Math.min(lines.length, lineNum + MARGIN)
    for (let i = firstLine; i <= lastLine; i++) {
        const line = lines[i - 1]
        console.log(`${Chalk.gray(padR(`${i}`, PAD))} ${line}`)
        if (linePos > -1 && i === lineNum) {
            console.log(Chalk.bold.redBright(padR("^", PAD + " ".length + linePos)))
        }
    }
}

function error(messageOrObject: any, maxLineLength = 120) {
    const message = typeof messageOrObject === 'string'
        ? messageOrObject : JSON.stringify(messageOrObject, null, "  ")
    let maxWidth = 0
    const rawLines = message.split("\n")
    const linesToDisplay: string[] = []
    for (const line of rawLines) {
        if (line.length <= maxLineLength) {
            linesToDisplay.push(line)
            maxWidth = Math.max(maxWidth, line.length)
        } else {
            maxWidth = maxLineLength
            let currentLine = line
            while (currentLine.length > maxLineLength) {
                linesToDisplay.push(currentLine.substr(0, maxLineLength))
                currentLine = currentLine.substr(maxLineLength)
            }
            if (currentLine.length > 0) {
                linesToDisplay.push(currentLine)
            }
        }
    }
    const ruler = `+-${repeat("-", maxWidth)}-+`
    console.log(Chalk.bgRed.whiteBright(`${ruler}
${linesToDisplay.map(s => `| ${pad(s, maxWidth)} |`).join("\n")}
${ruler}
`.trim()))
}

function info(text: string) {
    console.log(text)
}

function json(obj: any) {
    console.log(JSON.stringify(obj, null, "  "))
}


function newline() {
    console.log()
}

function red(text: string) {
    console.log(Chalk.red(text))
}

function title(name: string, version: string) {
    const line = `+-${repeat("-", name.length + version.length + 1)}-+`
    console.log(Chalk.white(`${line}
| ${Chalk.whiteBright(name)} ${Chalk.bold(version)} |
${line}
`))
}


function repeat(char: string, length: number): string {
    if (char.length === 0) {
        // tslint:disable-next-line: no-parameter-reassignment
        char = " "
    }

    let out = char
    while (out.length < length) {
        out = `${out}${char}`
    }

    return out.substr(0, length)
}

function pad(text: string, size: number) {
    let out = text
    while (out.length < size) out += " "

    return out.substr(0, size)
}

function padR(text: string, size: number) {
    let out = text
    while (out.length < size) out = ` ${out}`

    return out.substr(0, size)
}

