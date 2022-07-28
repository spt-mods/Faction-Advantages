import {DependencyContainer} from "tsyringe";
import {ConfigServer} from "@spt-aki/servers/ConfigServer";
import {IBotConfig} from "@spt-aki/models/spt/config/IBotConfig";

import botConfig = require("../config/bots.json");

export class Bots {
    private configServer: ConfigServer;

    constructor(container: DependencyContainer) {
        this.configServer = container.resolve<ConfigServer>("ConfigServer");
    }

    /**
     * Set the hostility chance of bots of the same faction to the value specified in the bots config.
     */
    setSameFactionHostileChance() {
        const pmcBotConfig = this.configServer.getConfigByString<IBotConfig>("aki-bot").pmc;
        pmcBotConfig.chanceSameSideIsHostilePercent = botConfig.SameFactionHostileChance;
    }
}
