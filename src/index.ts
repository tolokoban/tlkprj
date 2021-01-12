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

} catch (ex) {
    Print.error(ex)
}


function build(args: IArguments) {
    const successful = TS.compile(args.projectRootPath)
    if (successful) {
        Assets.copy(args.projectRootPath)
    }
}