import { type } from 'os'
import Path from 'path'
import Print from './print'

export default {
    parse,
    usage
}


const AVAILABLE_FLAGS = [
    "--debug",
    "-p", "--project",
    "-w", "--watch"
]

export interface IArguments {
    command: "build"
    debug: boolean
    projectRootPath: string
    watch: boolean
}

function parse(): IArguments {
    const options = parseOptions()
    const final: IArguments = {
        command: "build",
        debug: options.hasFlag("debug"),
        projectRootPath: process.cwd(),
        watch: options.hasFlag("w", "watch")
    }
    const projectRootPath = options.getString("p", "project")
    if (projectRootPath) {
        final.projectRootPath = Path.resolve(projectRootPath)
    }

    return final
}

function usage() {

}


interface IOptions {
    [key: string]: undefined | boolean | string | string[]
}

class OptionsBag {
    constructor(private readonly options: IOptions) { }

    getString(...names: string[]): string | null {
        const { options } = this
        for (const abbrev of names) {
            const name = abbrev.length === 1 ? `-${abbrev}` : `--${abbrev}`
            const value = options[name]
            if (typeof value === "string") return value
        }

        return null
    }

    hasFlag(...names: string[]): boolean {
        const { options } = this
        for (const abbrev of names) {
            const name = abbrev.length === 1 ? `-${abbrev}` : `--${abbrev}`
            const value = options[name]
            if (value === true) return true
        }

        return false
    }
}

function parseOptions(): OptionsBag {
    const args = process.argv.splice(2)
    const options: IOptions = {}
    let name = ""
    for (const arg of args) {
        if (arg.startsWith("-")) {
            name = arg
            if (!AVAILABLE_FLAGS.includes(name)) {
                throw `Invalid flag: "${arg}"!`
            }
            options[name] = true
        } else {
            const currentValue = options[name]
            if (typeof currentValue === 'undefined' || typeof currentValue === 'boolean') {
                options[name] = arg
            }
            else if (Array.isArray(currentValue)) {
                currentValue.push(arg)
            }
            else {
                options[name] = [currentValue, arg]
            }
        }
    }

    return new OptionsBag(options)
}