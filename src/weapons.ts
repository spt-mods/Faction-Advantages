import {DependencyContainer} from "tsyringe";
import {ILogger} from "@spt-aki/models/spt/utils/ILogger";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";
import {DatabaseServer} from "@spt-aki/servers/DatabaseServer";
import {ITemplateItem} from "@spt-aki/models/eft/common/tables/ITemplateItem";

export class Weapons {
    private logger: ILogger;
    private profileHelper: ProfileHelper;
    private databaseServer: DatabaseServer;

    constructor(container: DependencyContainer) {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    }

    /**
     * Update all weapons stats according to the player's faction with modifiers from the weapons config.
     * When the player is in the Usec faction all Usec related weapons get a stat boost and
     * all Bear related weapons get a stat buff.
     * @param sessionID The profile ID of the logged in player.
     */
    updateWeaponStatsForFaction(sessionID: string) {
        const weaponsList = require("../database/weapons.json");
        const playerFaction: string = this.profileHelper.getPmcProfile(sessionID).Info.Side;
        const databaseItems: Record<string, ITemplateItem> = this.databaseServer.getTables().templates.items;

        for (let weapon of weaponsList[playerFaction]) {
            // TODO: Modify weapon stats
            databaseItems[weapon]._props.Ergonomics = 100;
            //this.logger.warning(databaseItems[weapon]._props.Ergonomics.toString())
            //this.logger.warning(databaseItems[weapon]._props.Name)
        }
    }
}
