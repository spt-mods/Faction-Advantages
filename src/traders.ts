import {DependencyContainer} from "tsyringe";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";
import {DatabaseServer} from "@spt-aki/servers/DatabaseServer";

import traderConfig = require("../config/traders.json");
import factionTraders = require("../database/traders.json");

export class Traders {
    private logger: ILogger;
    private profileHelper: ProfileHelper;
    private databaseServer: DatabaseServer;

    constructor(container: DependencyContainer) {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    }

    /**
     * Update the repair price of traders of the player's faction with the multipliers from the trader config.
     * @param sessionID The profile ID of the logged in player.
     */
    updateRepairPriceForFactionTraders(sessionID: string): void {
        const playerFaction: string = this.profileHelper.getPmcProfile(sessionID).Info.Side;
        const databaseTraders = this.databaseServer.getTables().traders;

        for (const trader of factionTraders[playerFaction]) {
            databaseTraders[trader].base.loyaltyLevels.map(loyaltyLevel => loyaltyLevel.repair_price_coef = Math.round(
                loyaltyLevel.repair_price_coef * traderConfig.RepairPriceMultiplier / 100
            ));
        }
    }
}
