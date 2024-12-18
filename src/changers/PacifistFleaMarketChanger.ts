import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { PacifistFleaMarket } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";
import { ItemTpl } from "@spt/models/enums/ItemTpl";

export class PacifistFleaMarketChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = databaseServer.getTables();
    }

    public apply(config: PacifistFleaMarket) {
        if (!config.enabled) {
            return;
        }
        if (config.whitelist) {
            this.enableWhitelist();
        }
        if (config.questKeys.enabled) {
            this.adjustKeys(config.questKeys.priceMultiplier);
        }

        if (config.markedKeys.enabled) {
            this.adjustKeys(config.markedKeys.priceMultiplier);
        }
    }
}
