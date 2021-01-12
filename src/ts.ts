import Path from 'path'
import ChildProcess from 'child_process'
import Print from './print'


export default {
    compile
}


function compile(root: string): boolean {
    Print.action("Compiling...")
    const result = ChildProcess.spawnSync("tsc", ["-p", root])
    const stdout = result.stdout.toString()
    if (result.status !== 0) {
        let maxDetailedErrors = 3
        for (const line of stdout.split("\n")) {
            if (line.indexOf(": error TS") === -1) continue

            const pos = line.indexOf(":")
            const { name, lineNum, linePos } = parseErrorLine(line.substr(0, pos).trim())
            const value = line.substr(pos + 1).trim()
            const fullPath = Path.resolve(name)
            const filename = Path.relative(root, fullPath)
            if (maxDetailedErrors-- > 0) {
                Print.error(`${filename}\n${value}`)
                Print.code(fullPath, lineNum, linePos)
                Print.newline()
            } else {
                Print.red(`${filename} ${value} [line ${lineNum}]`)
            }
        }

        return false
    }

    const attribs: { [key: string]: string } = {}
    for (const line of stdout.split("\n")) {
        const pos = line.indexOf(":")
        const name = line.substr(0, pos).trim()
        const value = line.substr(pos + 1).trim()
        attribs[name.toLowerCase()] = value
    }
    Print.att("Compilation time", attribs["total time"])

    return true
}


function parseErrorLine(line: string) {
    const parenthesis = line.lastIndexOf("(")
    const name = line.substr(0, parenthesis)
    const rest = line.substr(parenthesis + 1)
    const [num, pos] = rest.substr(0, rest.length - 1).split(",")

    return {
        name,
        lineNum: parseInt(num, 10),
        linePos: parseInt(pos, 10)
    }
}