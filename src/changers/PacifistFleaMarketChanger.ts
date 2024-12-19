import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { PacifistFleaMarket } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";
import { markedKeys, questKeys } from "src/assets/keys";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { whitelist } from "src/assets/fleamarket";
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
            this.logger.warning("PriceRebalance: enableWhitelist: items table not found");
            return;
        }
        const questItems = Object.values(items).filter((item) => item._props.QuestItem).map(item => item._id)
        const whitelistArray = whitelist as string[]
        this.adjustSellableOnRagfair(whitelistArray.concat(questItems));
    }

    private banEverythingOnFlea(){
        const items = this.tables.templates?.items;
        if (!items) {
            this.logger.warning("PriceRebalance: banEverythingOnFlea: items table not found");
            return;
        }
        this.ragfairConfig.dynamic.blacklist.custom = Object.values(items).map(item => item._id);
    }


    private adjustKeys(keys: string[], priceMultiplier: number) {
        const handbookItems = this.tables.templates?.handbook.Items;
        if (!handbookItems) {
            this.logger.warning("PriceRebalance: doItemFixes: handbook or items not found");
            return;
        }
        for (const key of keys) {
            const itemHandbook = handbookItems.find((item) => item.Id === key);
            if (!itemHandbook) {
                this.logger.warning(`PriceRebalance: doItemFixes: item ${key} not found, skipping`);
                continue;
            }
            itemHandbook.Price *= priceMultiplier;
        }
        this.adjustSellableOnRagfair(keys);
    }

    //Unsure if we really need to do this, all of the whitelisted items / keys are already sellable on Fleamarket.
    private adjustSellableOnRagfair(whitelist: string[]) {
        const items = this.tables.templates?.items;
        if (!items) {
            this.logger.warning("PriceRebalance: doItemFixes: items table not found");
            return;
        }
        for (const itemID of whitelist) {
            const item = items.itemID;
            if (!item) {
                this.logger.warning(`PriceRebalance: doItemFixes: item ${itemID} not found, skipping`);
                continue;
            }
            item._props.CanSellOnRagfair = true;
        }
        this.ragfairConfig.dynamic.blacklist.custom = this.ragfairConfig.dynamic.blacklist.custom.filter((itemID) => !whitelist.includes(itemID))
    }
}
