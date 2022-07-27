import {DependencyContainer} from "tsyringe";
import {IPreAkiLoadMod} from "@spt-aki/models/external/IPreAkiLoadMod";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";

import {Weapons} from "./weapons";
import {Traders} from "./traders";

class Mod implements IPreAkiLoadMod {
    private package = require("../package.json");

    preAkiLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        logger.info(`Loading: ${this.package.displayName}`);

        staticRouterModService.registerStaticRouter(
            "StaticRouteFactionAdvantages",
            [{
                url: "/client/game/start",
                action: (url: string, info: any, sessionID: string, output: string) => {
                    this.loadOnGameStart(container, sessionID);
                    return output;
                }
            }],
            "aki"
        );
    }

    loadOnGameStart(container: DependencyContainer, sessionID: string) {
        const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");

        if (profileHelper.getPmcProfile(sessionID).Info === undefined) {
            return;
        }

        new Weapons(container).updateWeaponStatsForFaction(sessionID);
        new Traders(container).updateRepairPriceForFactionTraders(sessionID);
        new Traders(container).setTraderDiscountForFactionTraders(sessionID);
    }
}

module.exports = {mod: new Mod()}
