import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { PriceRebalance } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";

export class PriceRebalanceChanger {
    private logger: PrefixLogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
    }

    public apply(config: PriceRebalance) {
        if (!config.enabled) {
            return;
        }
        
    }
}
