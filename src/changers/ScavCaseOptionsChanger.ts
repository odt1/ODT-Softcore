import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ScavCaseOptions } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IScavCaseConfig } from "@spt/models/spt/config/IScavCaseConfig";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { HandbookHelper } from "@spt/helpers/HandbookHelper";
import { ScavCaseRewardGenerator } from "@spt/generators/ScavCaseRewardGenerator";
import { scavcaseRewardItemValueRangeRubReworked, scavCaseRecipesReworked } from "src/assets/scavcase";

export class ScavCaseOptionsChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private scavCaseConfig: IScavCaseConfig;
    private handbookHelper: HandbookHelper;
    private scavCaseRewardGenerator: ScavCaseRewardGenerator;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.handbookHelper = container.resolve<HandbookHelper>("HandbookHelper");
        this.scavCaseRewardGenerator = container.resolve<ScavCaseRewardGenerator>("ScavCaseRewardGenerator");
        this.tables = databaseServer.getTables();
        this.scavCaseConfig = configServer.getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE);
    }

    public apply(config: ScavCaseOptions) {
        if (!config.enabled) {
            return;
        }

        if (config.betterRewards) {
            this.doBetterRewards();
        }

        if (config.fasterScavcase.enabled) {
            this.doFasterScavcase(config.fasterScavcase.speedMultiplier);
        }

        if (config.rebalance) {
            this.doRebalance();
        }
    }

    private doBetterRewards() {
        // Set of all buyable items
        const buyableitems = new Set();
        const traderlist = this.tables.traders;
        if (!traderlist) {
            this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: traderlist not found");
            return;
        }
        for (const [_, trader] of Object.entries(traderlist)) {
            const items = trader.assort?.items;
            if (!items) {
                this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: trader.assort.items not found");
                return;
            }
            items.filter((x) => buyableitems.add(x._tpl));
        }

        const potentialScavCaseRewards = this.ensureDBItemsCache();
        if (!potentialScavCaseRewards) {
            this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: potentialScavCaseRewards not found");
            return;
        }

        // Add items to a blacklist that are worth < 10000 and are buyable from traders. This already uses SPT blacklists for rewards, no need to add them twice.
        for (const item of potentialScavCaseRewards) {
            let value = this.handbookHelper.getTemplatePrice(item._id);
            if (item._parent === BaseClasses.AMMO_BOX) {
                // Ammo boxes price patch/fix, their data in handbook is always 1k, this makes them valued as ammo*count they contain.
                const count = item._props.StackSlots?.[0]._max_count;
                const ammoType = item._props.StackSlots?.[0]._props.filters[0].Filter[0];
                if (!count || !ammoType) {
                    this.logger.warning(
                        "ScavCaseOptionsChanger: doBetterRewards: ammoType or count not found for itemTPl ${item._id}, skipping",
                    );
                    continue;
                }
                const ammoPrice = this.handbookHelper.getTemplatePrice(ammoType);
                value = Math.round(ammoPrice * count);
            }

            if (value < 10000 || buyableitems.has(item._id)) {
                this.scavCaseConfig.rewardItemBlacklist.push(item._id);
            }
        }
        this.scavCaseConfig.rewardItemBlacklist = [...new Set(this.scavCaseConfig.rewardItemBlacklist)];
    }

    private ensureDBItemsCache() {
        // biome-ignore lint/complexity/useLiteralKeys: Trying to circumvent protected variable.
        if (!this.scavCaseRewardGenerator["dbItemsCache"]) {
            // biome-ignore lint/complexity/useLiteralKeys: Trying to circumvent protected method.
            this.scavCaseRewardGenerator["cacheDBItems"]();
        }
        // biome-ignore lint/complexity/useLiteralKeys: Trying to circumvent protected variable.
        const dbItemsCache = this.scavCaseRewardGenerator["dbItemsCache"];
        if (!dbItemsCache) {
            this.logger.warning("ScavCaseOptionsChanger: ensureDBItemsCache: dbItemsCache not found");
            return;
        }
        return dbItemsCache;
    }

    private doFasterScavcase(multiplier: number) {
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("ScavCaseOptionsChanger: doFasterScavcase: hideout not found");
            return;
        }
        for (const [_, recipe] of Object.entries(hideout.production.recipes)) {
            recipe.productionTime = Math.round(recipe.productionTime / multiplier);
        }
    }

    private doRebalance() {
        this.scavCaseConfig.rewardItemValueRangeRub = scavcaseRewardItemValueRangeRubReworked;
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("ScavCaseOptionsChanger: doRebalance: hideout not found");
            return;
        }
        hideout.production.scavRecipes = scavCaseRecipesReworked;
    }
}
