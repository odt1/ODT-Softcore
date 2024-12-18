import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { FasterCraftingTime } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { IHideoutConfig } from "@spt/models/spt/config/IHideoutConfig";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { PrefixLogger } from "src/util/PrefixLogger";

export class FasterCraftingTimeChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private hideoutConfig: IHideoutConfig;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT);
    }

    public apply(config: FasterCraftingTime) {
        if (!config.enabled) {
            return;
        }
        this.doFasterProductionForAll(config.baseCraftingTimeMultiplier);

        if (config.hideoutSkillExpFix.enabled) {
            this.doHideoutSkillExpFix(config.hideoutSkillExpFix.hideoutSkillExpMultiplier);
        }

        if (config.fasterMoonshineProduction.enabled) {
            this.doFasterProductionFor(
                ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE,
                config.fasterMoonshineProduction.baseCraftingTimeMultiplier,
            );
        }

        if (config.fasterPurifiedWaterProduction.enabled) {
            this.doFasterProductionFor(
                ItemTpl.DRINK_CANISTER_WITH_PURIFIED_WATER,
                config.fasterPurifiedWaterProduction.baseCraftingTimeMultiplier,
            );
        }
    }

    private doFasterProductionFor(itemTpl: ItemTpl, multiplier: number) {
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("FasterCraftingTime: doFasterProductionFor: hideout not found, skipping");
            return;
        }

        const productionsForItem = hideout.production.recipes.filter((prod) => prod.endProduct === itemTpl);
        if (!productionsForItem) {
            this.logger.warning(`FasterCraftingTime: doFasterProduction: productions for item ${itemTpl} not found, skipping`);
            return;
        }
        for (const production of productionsForItem) {
            production.productionTime = Math.round(production.productionTime / multiplier);
        }
    }

    private doFasterProductionForAll(multiplier: number) {
        const exclude = [
            ItemTpl.BARTER_PHYSICAL_BITCOIN,
            ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE,
            ItemTpl.DRINK_CANISTER_WITH_PURIFIED_WATER,
        ] as string[];
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("FasterCraftingTime: doFasterProductionForAll: hideout not found, skipping");
            return;
        }
        for (const production of hideout.production.recipes) {
            if (!exclude.includes(production.endProduct)) {
                production.productionTime = Math.round(production.productionTime / multiplier) + 1;
            }
        }
    }

    private doHideoutSkillExpFix(multiplier: number) {
        this.hideoutConfig.hoursForSkillCrafting /= multiplier;
    }
}
