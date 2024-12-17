import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { FasterBitcoinFarming } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { PrefixLogger } from "src/util/PrefixLogger";
import { IHideoutProduction } from "@spt/models/eft/hideout/IHideoutProduction";

export class FasterBitcoinFarmingChanger {
    private logger: PrefixLogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;
    private items: Record<string, ITemplateItem> | undefined;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
        this.items = this.tables.templates?.items;
    }

    public apply(config: FasterBitcoinFarming) {
        if (!config.enabled) {
            return;
        }

        this.doFasterBitcoinFarming(config.baseBitcoinTimeMultiplier, config.gpuEfficiency);

        if(config.setBitcoinPriceTo100k) {
            this.setBitcoinPriceTo100k();
        }
    }

    private doFasterBitcoinFarming(baseBitcoinTimeMultiplier: number, gpuEfficiency: number) {
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("FasterbitcoinFarming: doFasterbitcoinFarming: hideout not found");
            return;
        }

        const bitcoinProductions = hideout.production.recipes.filter((production) => production.endProduct === ItemTpl.BARTER_PHYSICAL_BITCOIN);
        if (!bitcoinProductions) {
            this.logger.warning("FasterbitcoinFarming: doFasterbitcoinFarming: bitcoinProductions not found");
            return;
        }
        for (const prod of bitcoinProductions) {
            prod.productionTime = Math.round(prod.productionTime / baseBitcoinTimeMultiplier);
        }

        hideout.settings.gpuBoostRate = gpuEfficiency;
    }

    private setBitcoinPriceTo100k() {
        const bitcoinHandbook = this.tables.templates?.handbook.Items.find((x) => x.Id === ItemTpl.BARTER_PHYSICAL_BITCOIN);
        if (!bitcoinHandbook) {
            this.logger.warning("FasterbitcoinFarming: doRevertBitcoinPriceToV012: bitcoinHandbook not found");
            return;
        }
        bitcoinHandbook.Price = 100000;
    }
}
