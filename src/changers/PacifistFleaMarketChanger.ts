import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { PacifistFleaMarket } from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { markedKeys, questKeys } from "../assets/keys";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { whitelist } from "../assets/fleamarket";
import { fleaListingsWhitelist } from "../assets/fleamarket";
export class PacifistFleaMarketChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private ragfairConfig: IRagfairConfig

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
    }

    public apply(config: PacifistFleaMarket) {
        if (!config.enabled) {
            return;
        }
        if (config.whitelist) {
            this.enableWhitelist();
        }
        if (config.questKeys.enabled) {
            this.adjustKeys(questKeys, config.questKeys.priceMultiplier);
        }

        if (config.markedKeys.enabled) {
            this.adjustKeys(markedKeys, config.markedKeys.priceMultiplier);
        }
    }

    private enableWhitelist() {
        this.banEverythingOnFlea();

        const items = this.tables.templates?.items;
        if (!items) {
            this.logger.warning("PacifistFleaMarket: enableWhitelist: items table not found");
            return;
        }
       
        const fleaListingsWhitelistString = fleaListingsWhitelist as string[]
        const whitelistItemsbyParentID = Object.values(items).filter((item) => fleaListingsWhitelistString.includes(item._parent)).map(item => item._id)
        const whitelistArray = whitelist as string[]
        this.adjustSellableOnRagfair([...new Set(whitelistArray.concat(whitelistItemsbyParentID))]);
    }

    private banEverythingOnFlea(){
        const items = this.tables.templates?.items;
        if (!items) {
            this.logger.warning("PacifistFleaMarket: banEverythingOnFlea: items table not found");
            return;
        }
        this.ragfairConfig.dynamic.blacklist.custom = Object.values(items).map(item => item._id);
    }


    private adjustKeys(keys: string[], priceMultiplier: number) {
        const handbookItems = this.tables.templates?.handbook.Items;
        if (!handbookItems) {
            this.logger.warning("PacifistFleaMarket: adjustKeys: handbook or items not found");
            return;
        }
        for (const key of keys) {
            const itemHandbook = handbookItems.find((item) => item.Id === key);
            if (!itemHandbook) {
                this.logger.warning(`PacifistFleaMarket: adjustKeys: item ${key} not found, skipping`);
                continue;
            }
            itemHandbook.Price *= priceMultiplier;
        }
        this.adjustSellableOnRagfair(keys);
    }

    private adjustSellableOnRagfair(whitelist: string[]) {
        const items = this.tables.templates?.items;
        if (!items) {
            this.logger.warning("PacifistFleaMarket: adjustedSellableOnRagfair: items table not found");
            return;
        }
        for (const itemID of whitelist) {
            const item = items[itemID];
            if (!item) {
                this.logger.warning(`PacifistFleaMarket: adjustedSellableOnRagfair: item ${itemID} not found, skipping`);
                continue;
            }
            item._props.CanSellOnRagfair = true;
        }
        this.ragfairConfig.dynamic.blacklist.custom = this.ragfairConfig.dynamic.blacklist.custom.filter((itemID) => !whitelist.includes(itemID))
    }
}
