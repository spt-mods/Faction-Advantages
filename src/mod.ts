import {DependencyContainer} from "tsyringe";
import {IPreAkiLoadMod} from "@spt-aki/models/external/IPreAkiLoadMod";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";

import {Weapons} from "./weapons";
import {Traders} from "./traders";

class Mod implements IPreAkiLoadMod {
    private profileHelper: ProfileHelper;
    private package = require("../package.json");

    preAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");

        logger.info(`Loading: ${this.package.displayName}`);

        staticRouterModService.registerStaticRouter(
            "StaticRouteFactionAdvantages",
            [{
                url: "/client/game/start",
                action: (url: string, info: any, sessionID: string, output: string) => {
                    if (profileHelper.getPmcProfile(sessionID).Info === undefined) {
                        return;
                    }
                    new Weapons(container).updateWeaponStatsForFaction(sessionID);
                    new Traders(container).updateRepairPriceForFactionTraders(sessionID);
                    return output;
                }
            }],
            "aki"
        );
    }
}

module.exports = {mod: new Mod()}
