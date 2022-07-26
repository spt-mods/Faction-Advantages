import {DependencyContainer} from "tsyringe";
import {IPostAkiLoadMod} from "@spt-aki/models/external/IPostAkiLoadMod";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

import {Weapons} from "./weapons";

class Mod implements IPostAkiLoadMod {
    private package = require("../package.json");

    postAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        logger.info(`Loading: ${this.package.displayName}`);

        staticRouterModService.registerStaticRouter(
            "StaticRouteUpdateWeaponStatsForFaction",
            [{
                url: "/client/game/start",
                action: (url: string, info: any, sessionID: string, output: string) => {
                    new Weapons(container).updateWeaponStatsForFaction(sessionID);
                    return output;
                }
            }],
            "aki"
        );
    }
}

module.exports = {mod: new Mod()}
