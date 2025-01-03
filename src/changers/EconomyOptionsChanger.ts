import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { EconomyOptions} from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { PriceRebalanceChanger } from "./PriceRebalanceChanger";
import { PacifistFleaMarketChanger } from "./PacifistFleaMarketChanger";
import { BarterEconomyChanger } from "./BarterEconomyChanger";
import { OtherFleaMarketChangesChanger } from "./OtherFleaMarketChangesChanger";
export class EconomyOptionsChanger {
    private container: DependencyContainer;
    private logger: PrefixLogger;
    private tables: IDatabaseTables;

    constructor(container: DependencyContainer) {
        this.container = container;
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = databaseServer.getTables();
    }

    public apply(config: EconomyOptions) {
        if (!config.enabled) {
            return;
        }

        if (config.disableFleaMarketCompletely){
            this.doDisableFleaMarketCompletely();
            return;
        }

        if (config.priceRebalance.enabled){
            new PriceRebalanceChanger(this.container).apply(config.priceRebalance);
        }

        if (config.pacifistFleaMarket.enabled) {
            new PacifistFleaMarketChanger(this.container).apply(config.pacifistFleaMarket);
        }

        if (config.barterEconomy.enabled){
            new BarterEconomyChanger(this.container).apply(config.barterEconomy);
        }

        if (config.otherFleaMarketChanges.enabled){
            new OtherFleaMarketChangesChanger(this.container).apply(config.otherFleaMarketChanges);
            this.updateRagfairMinUserLevel(config.otherFleaMarketChanges.fleaMarketOpenAtLevel);
        }
    }

    private doDisableFleaMarketCompletely() {
        this.updateRagfairMinUserLevel(99);
    }

    private updateRagfairMinUserLevel(level: number){
        const globals = this.tables.globals;
        if (!globals) {
            this.logger.warning("EconomyOptions: updateRagfairMinUserLevel: globals not found");
            return;
        }
        globals.config.RagFair.minUserLevel = level;
    }
}
