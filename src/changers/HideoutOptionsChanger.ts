import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { HideoutOptions } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { StashOptionsChanger } from "./StashOptionsChanger";
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
            this.doHideoutContainers();
        }
    }

    private doHideoutContainers() {
        if (!this.items) {
            this.logger.warning("HideoutOptions: doHideoutContainers: items table not found");
            return;
        }

        const containersToModify = [
            { tpl: ItemTpl.CONTAINER_MEDICINE_CASE, cellsH: 10, cellsV: 10 },
            { tpl: ItemTpl.CONTAINER_MR_HOLODILNICK_THERMAL_BAG, cellsH: 10, cellsV: 10 },
            { tpl: ItemTpl.CONTAINER_MAGAZINE_CASE, cellsH: 10, cellsV: 7 },
            { tpl: ItemTpl.CONTAINER_ITEM_CASE, cellsH: 10, cellsV: 10 },
            { tpl: ItemTpl.CONTAINER_WEAPON_CASE, cellsH: 6, cellsV: 10 },
        ];

        for (const container of containersToModify) {
            const item = this.items[container.tpl];
            if (item?._props?.Grids?.[0]?._props) {
                item._props.Grids[0]._props.cellsH = container.cellsH;
                item._props.Grids[0]._props.cellsV = container.cellsV;
            } else {
                this.logger.warning(`HideoutContainers: ${container.tpl} not found.`);
            }
        }
    }
}
