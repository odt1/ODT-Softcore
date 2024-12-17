import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { HideoutOptions } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { StashOptionsChanger } from "./StashOptionsChanger";
import { HideoutContainersChanger } from "./HideoutContainersChanger";
import { PrefixLogger } from "../util/PrefixLogger";
export class HideoutOptionsChanger {
    private container: DependencyContainer;
    private logger: PrefixLogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;
    private items: Record<string, ITemplateItem> | undefined;

    constructor(container: DependencyContainer) {
        this.container = container;
        this.logger = PrefixLogger.getInstance();
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
        this.items = this.tables.templates?.items;
    }

    public apply(config: HideoutOptions) {
        if (!config.enabled) {
            return;
        }
        if (config.stashOptions.enabled) {
            new StashOptionsChanger(this.container).apply(config.stashOptions);
        }
        if (config.hideoutContainers.enabled) {
            new HideoutContainersChanger(this.container).apply(config.hideoutContainers);
        }
        if (config.fasterBitcoinFarming.enabled) {
            new FasterbitcoinFarmingChanger(this.container).apply(config.fasterBitcoinFarming);
        }
    }
}
