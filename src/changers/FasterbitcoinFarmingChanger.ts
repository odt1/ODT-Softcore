import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { FasterbitcoinFarming } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { PrefixLogger } from "src/util/PrefixLogger";

export class FasterbitcoinFarmingChanger {
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

    public apply(config: FasterbitcoinFarming) {
        if (!config.enabled) {
            return;
        }
        
    }
}
