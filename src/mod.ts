import {DependencyContainer} from "tsyringe";
import {IPostAkiLoadMod} from "@spt-aki/models/external/IPostAkiLoadMod";
class Mod implements IPostAkiLoadMod {
    private package = require("../package.json");

    postAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");

        logger.info(`Loading: ${this.package.displayName}`);
    }
}

module.exports = {mod: new Mod()}
