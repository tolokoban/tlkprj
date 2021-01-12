#! /usr/bin/env node

import FS from 'fs'
import Path from 'path'
import Config from '../package.json'
import Assets from './assets'
import Print from './print'
import Args, { IArguments } from './args'
import TS from './ts'

try {
    Print.title("Tolokoban Projects", Config.version)
    const args = Args.parse()
    if (args.debug) Print.json(args)

    build(args)
    if (args.watch) {
        const event = Debouncer(
            (type: string, path: string) => {
                Print.status(type, path)
                build(args)
            },
            200
        )
        const watchedPath = Path.resolve(args.projectRootPath, "src/")
        watch(
            watchedPath,
            event,
            new Set<string>()
        )
    }
} catch (ex) {
    if (process.argv.includes("--debug")) {
        console.error(ex)
    }
    Print.error(ex)
}

function watch(
    folder: string,
    event: (type: string, path: string) => void,
    watchedFolders: Set<string>
) {
    if (watchedFolders.has(folder)) return

    watchedFolders.add(folder)
    Print.action(`Watching "${folder}"...`)
    FS.watch(
        folder,
        { recursive: false },
        (eventType: string, filename: string) => {
            const path = Path.resolve(folder, filename)
            if (FS.existsSync(path)) {
                const stats = FS.statSync(path)
                if (stats.isDirectory()) {
                    watch(path, event, watchedFolders)
                }
                event(eventType, path)
            } else {
                if (watchedFolders.has(path)) {
                    // We need to unwatch this folder.
                    Print.action(`Stop watching on "${path}"...`)
                    FS.unwatchFile(path)
                    watchedFolders.delete(path)
                }
                event("delete", path)
            }
        }
    )
    const files = FS.readdirSync(folder)
    for (const file of files) {
        const path = Path.resolve(folder, file)
        const stats = FS.statSync(path)
        if (stats.isDirectory()) {
            watch(path, event, watchedFolders)
        }
    }
}

function build(args: IArguments) {
    const successful = TS.compile(args.projectRootPath)
    if (successful) {
        Assets.copy(args.projectRootPath)
    }
}

function Debouncer<TArgs extends any[]>(
    action: (...args: TArgs) => void,
    delay: number
): (...args: TArgs) => void {
    let timer: NodeJS.Timeout | null = null

    return (...args: TArgs): void => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(
            () => {
                timer = null
                action(...args)
            },
            delay
        )
    }
}