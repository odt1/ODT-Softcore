import path from "node:path";
import { DependencyContainer } from "tsyringe";

import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
//import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { IHideoutConfig } from "@spt/models/spt/config/IHideoutConfig";
import { IInsuranceConfig } from "@spt/models/spt/config/IInsuranceConfig";
import { IScavCaseConfig } from "@spt/models/spt/config/IScavCaseConfig";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";

import { itemBaseClasses } from "./itemBaseClasses";
import { BSGblacklist } from "./BSGblacklist";
import { scavcaseWhitelist, scavcaseItemBlacklist } from "./scavcaseLists";
import { containerRecipes, additionalCraftingRecipes } from "./recipes/recipes";
import { Configuration } from "./types";
import { ConfigServer } from "./servers/ConfigServer";
import { SecureContainerOptionsChanger } from "./changers/SecureContainerOptionsChanger";
import { HideoutOptionsChanger } from "./changers/HideoutOptionsChanger";

class Softcore implements IPostDBLoadMod, IPreSptLoadMod {
    private fleaListingsWhitelist = require("../config/fleaListingsWhitelist.ts");
    private fleaBarterRequestsWhitelist = require("../config/fleaBarterRequestsWhitelist.ts"); // why I can't use import in config directory? Anyway, is there any alternative to JSON data storage? THIS is the only way to save commented data?!
    private fleaItemsWhiteList = require("../config/fleaItemsWhitelist.ts");

    private logger: ILogger;
    private config: Configuration | null = null;
    private container: DependencyContainer;

    public preSptLoad(container: DependencyContainer): void {
        this.container = container;
        this.logger = container.resolve<ILogger>("WinstonLogger");

        try {
            this.config = new ConfigServer().loadConfig().validateConfig().getConfig();
        } catch (error) {
            this.config = null;
            this.logger.error("Softcore: ${error.message}");
        }

        // Can stop if config is either null or not initialized
        if (this.config == null) {
            return;
        }
        // Can stop if mod not enabled
        if (!this.config.general.enabled) {
            this.logger.info("Softcore: Mod disabled in the config file");
            this.config = null;
            return;
        }
    }

    public postDBLoad(container: DependencyContainer): void {
        // Only enters if config is invalid / not found or mod disabled. Logging for this happened in preSptLoad
        if (this.config === null){
            return;
        }
        // Initialize all the changes and apply them according to the config
        new SecureContainerOptionsChanger(container).apply(this.config.secureContainersOptions);
        new HideoutOptionsChanger(container).apply(this.config.hideoutOptions);
    }
}

export const mod = new Softcore();
