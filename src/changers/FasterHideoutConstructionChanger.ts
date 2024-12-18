import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { FasterHideoutConstruction } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";

export class FasterHideoutConstructionChanger {
    private logger: PrefixLogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
    }

    public apply(config: FasterHideoutConstruction) {
        if (!config.enabled) {
            return;
        }
        this.doFasterHideoutConstruction(config.hideoutConstructionTimeMultiplier);
    }

    private doFasterHideoutConstruction(multiplier: number) {
        const hideout = this.tables.hideout;
        if (!hideout) {
            this.logger.warning("FasterHideoutConstruction: doFasterHideoutConstruction: hideout not found");
            return;
        }
        for (const area of hideout.areas){
            for (const [_, stage] of Object.entries(area.stages)) {
                stage.constructionTime = Math.round(stage.constructionTime / multiplier);
            }
        }
    }
}
