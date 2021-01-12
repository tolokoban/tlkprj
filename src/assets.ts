import FS from "fs"
import Path from "path"
import JSON5 from 'json5'
import Print from './print'


const EXTENSIONS = [
    '.css', '.png', '.jpg', '.jpeg', '.gif', 'webp',
    '.yaml', '.yml', '.json', '.woff2', '.ttf',
    '.vert', '.frag'
]

export default { copy }


class Project {
    public size = 0

    constructor(private readonly root: string) { }

    loadJSON(filename: string): IPackage {
        const fullpath = Path.resolve(
            this.root,
            filename
        )
        if (!FS.existsSync(fullpath)) {
            throw `Unable to find "${filename}":\n${fullpath}`
        }

        try {
            const content = FS.readFileSync(fullpath).toString()
            return JSON5.parse(content)
        } catch (ex) {
            throw `"${filename}" is not a valid JSON file!\n${fullpath}`
        }
    }

    saveJSON(filename: string, data: any) {
        const fullpath = Path.resolve(
            this.root,
            filename
        )
        FS.writeFileSync(fullpath, JSON.stringify(data, null, "    "))
    }

    copy(relSrc: string, relDst: string) {
        const { root } = this
        const src = Path.resolve(root, relSrc)
        const dst = Path.resolve(root, relDst)
        if (!FS.existsSync(dst)) {
            FS.mkdirSync(dst)
        }
        const files = FS.readdirSync(src)
        for (const file of files) {
            const path = Path.resolve(src, file)
            const stats = FS.statSync(path)
            if (stats.isDirectory()) {
                this.copy(`${relSrc}/${file}`, `${relDst}/${file}`)
            } else {
                if (file === 'package.json') continue
                if (file === 'package-lock.json') continue
                for (const ext of EXTENSIONS) {
                    if (file.endsWith(ext)) {
                        this.size += stats.size
                        FS.copyFileSync(path, Path.resolve(dst, file))
                        break
                    }
                }
            }
        }
    }

}

function copy(projectRootPath: string) {
    Print.action("Copying assets...")
    const prj = new Project(projectRootPath)
    const tsconfig = prj.loadJSON("tsconfig.json")
    if (!tsconfig.compilerOptions) {
        throw "Missing entry 'compilerOptions' in tsconfig.json!"
    }
    if (typeof tsconfig.compilerOptions.outDir !== 'string') {
        throw "Missing entry 'compilerOptions.outDir' in tsconfig.json!"
    }
    const srcRoot = "src"
    const dstRoot = tsconfig.compilerOptions.outDir
    prj.copy(srcRoot, dstRoot)

    if (prj.size === 0) {
        Print.info("No asset found.")
    }
    else if (prj.size < 1024) {
        Print.att('Assets total size', "Less than 1 Kb")
    }
    else {
        Print.att('Assets total size', `${prj.size >> 10} Kb`)
    }
    updatePackage(prj, dstRoot)
}

interface IPackage {
    [key: string]: any
}

function updatePackage(prj: Project, dstRoot: string) {
    // Copy package.json and change attributes "main" and "types" to be local.
    const config = prj.loadJSON("package.json") as IPackage
    config.main = "index.js"
    config.types = "index.d.ts"
    delete config.files
    delete config.scripts
    delete config.browserslist
    prj.saveJSON(`${dstRoot}/package.json`, config)
}
