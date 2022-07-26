import {DependencyContainer} from "tsyringe";
import {ProfileHelper} from "@spt-aki/helpers/ProfileHelper";
import {DatabaseServer} from "@spt-aki/servers/DatabaseServer";
import {ITemplateItem} from "@spt-aki/models/eft/common/tables/ITemplateItem";

export class Weapons {
    private profileHelper: ProfileHelper;
    private databaseServer: DatabaseServer;

    constructor(container: DependencyContainer) {
        this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    }

    /**
     * Update all weapons stats from the player's faction with modifiers from the weapons config.
     * @param sessionID The profile ID of the logged in player.
     */
    updateWeaponStatsForFaction(sessionID: string): void {
        if (this.profileHelper.getPmcProfile(sessionID).Info === undefined) {
            return;
        }

        const playerFaction: string = this.profileHelper.getPmcProfile(sessionID).Info.Side;
        const databaseItems: Record<string, ITemplateItem> = this.databaseServer.getTables().templates.items;

        const weaponsList = require("../database/weapons.json");
        const multipliers = require("../config/weapons.json").Multipliers;

        for (let weapon of weaponsList[playerFaction]) {
            if (databaseItems[weapon] === undefined) {
                continue
            }

            databaseItems[weapon]._props.RecoilForceUp *= multipliers.VerticalRecoil / 100;
            databaseItems[weapon]._props.RecoilForceBack *= multipliers.HorizontalRecoil / 100;
            databaseItems[weapon]._props.Ergonomics = Math.round(
                databaseItems[weapon]._props.Ergonomics * (multipliers.Ergonomics / 100)
            );
        }
    }
}
