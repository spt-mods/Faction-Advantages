import {DependencyContainer} from "tsyringe";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";
import {DatabaseServer} from "@spt-aki/servers/DatabaseServer";
import {PaymentHelper} from "@spt-aki/helpers/PaymentHelper";
import {ITraderAssort} from "@spt-aki/models/eft/common/tables/ITrader";

import traderConfig = require("../config/traders.json");
import factionTraders = require("../database/traders.json");

export class Traders {
    private logger: ILogger;
    private profileHelper: ProfileHelper;
    private databaseServer: DatabaseServer;
    private paymentHelper: PaymentHelper;

    constructor(container: DependencyContainer) {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.paymentHelper = container.resolve<PaymentHelper>("PaymentHelper")
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

    /**
     * Set a discount for traders of the player's faction with the setting in the trader config.
     * @param sessionID The profile ID of the logged in player.
     */
    setTraderDiscountForFactionTraders(sessionID: string): void {
        const playerFaction: string = this.profileHelper.getPmcProfile(sessionID).Info.Side;
        const databaseTraders = this.databaseServer.getTables().traders;

        for (const trader of factionTraders[playerFaction]) {
            this.applyDiscountToTraderAssort(databaseTraders[trader].assort);
            databaseTraders[trader].base.discount = -traderConfig.TraderDiscount;
        }
    }

    /**
     * Applies the discount from the trader config to the trader Assort.
     * @param assort The Assort of the trader.
     */
    applyDiscountToTraderAssort(assort: ITraderAssort) {
        for (const schemeID in assort.barter_scheme) {
            const scheme = assort.barter_scheme[schemeID][0];
            if (scheme.length === 1 && this.paymentHelper.isMoneyTpl(scheme[0]._tpl)) {
                const price = Math.round(scheme[0].count * (100 - traderConfig.TraderDiscount) / 100)
                scheme[0].count = price >= 1 ? price : 1;
            }
        }
    }
}
