import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PrefixLogger } from "./util/PrefixLogger";
import { Configuration } from "./types";
import { ConfigServer } from "./servers/ConfigServer";
import { SecureContainerOptionsChanger } from "./changers/SecureContainerOptionsChanger";
import { HideoutOptionsChanger } from "./changers/HideoutOptionsChanger";
import { EconomyOptionsChanger } from "./changers/EconomyOptionsChanger";

class Softcore implements IPostDBLoadMod, IPreSptLoadMod {
    private fleaListingsWhitelist = require("../config/fleaListingsWhitelist.ts");
    private fleaBarterRequestsWhitelist = require("../config/fleaBarterRequestsWhitelist.ts"); // why I can't use import in config directory? Anyway, is there any alternative to JSON data storage? THIS is the only way to save commented data?!
    private fleaItemsWhiteList = require("../config/fleaItemsWhitelist.ts");

    private logger: PrefixLogger | null = null;
    private config: Configuration | null = null;
    private container: DependencyContainer;

    public preSptLoad(container: DependencyContainer): void {
        this.container = container;
        try{
            this.logger = PrefixLogger.getInstance(container);
        } catch (error) {
            const logger = container.resolve<ILogger>("WinstonLogger");
            logger.error("[Softcore]: ${error.message}, stopping mod");
            return;
        }
        
        try {
            this.config = new ConfigServer().loadConfig().validateConfig().getConfig();
        } catch (error) {
            this.config = null;
            this.logger.error("ConfigServer: ${error.message}");
        }

        // Can stop if config is either null or not initialized
        if (this.config == null) {
            return;
        }
        // Can stop if mod not enabled
        if (!this.config.general.enabled) {
            this.logger.info("Config: Mod disabled in the config file");
            this.config = null;
            return;
        }
    }

    public postDBLoad(container: DependencyContainer): void {
        // Only enters if config is invalid / not found or mod disabled. Logging for this happened in preSptLoad
        if (this.config === null || this.logger === null){
            return;
        }
        this.logger.setDebug(this.config.general.debug);
        // Initialize all the changes and apply them according to the config
        new SecureContainerOptionsChanger(container).apply(this.config.secureContainersOptions);
        new HideoutOptionsChanger(container).apply(this.config.hideoutOptions);
        new EconomyOptionsChanger(container).apply(this.config.economyOptions);
    }
}

export const mod = new Softcore();
