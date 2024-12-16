import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { HideoutOptions } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { StashOptionsChanger } from "./StashOptionsChanger";

export class HideoutOptionsChanger {
    private container: DependencyContainer;
    private logger: ILogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;
    private items: Record<string, ITemplateItem> | undefined;

    constructor(container: DependencyContainer) {
        this.container = container;
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
        this.items = this.tables.templates?.items;
    }

    public apply(config: HideoutOptions) {
        if (!config.enabled) {
            return;
        }
        if (config.stashOptions.enabled){
            new StashOptionsChanger(this.container).apply(config.stashOptions);
        }
    }
}
