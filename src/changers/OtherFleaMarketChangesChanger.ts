import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { OtherFleaMarketChanges} from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "src/util/PrefixLogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { Condition, IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { IItemConfig } from "@spt/models/spt/config/IItemConfig";

export class OtherFleaMarketChangesChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private ragfairConfig: IRagfairConfig;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
    }

    public apply(config: OtherFleaMarketChanges) {
        if (!config.enabled) {
            return;
        }
        if (config.sellingOnFlea){
            this.doSellingOnFlea();
        }
        
        if (config.onlyFoundInRaidItemsAllowedForBarters){
            this.adjustOnlyFIRforBarters();
        }

        if (config.fleaPristineItems){
            this.adjustPristineItems();
        }

        this.increaseFleaPrices(config.fleaPricesIncreased);
    }

    private doSellingOnFlea(){
        this.ragfairConfig.sell.chance.base = 0;
    }

    private adjustOnlyFIRforBarters(){
        const globals = this.tables.globals;
        if(!globals){
            this.logger.warning("OtherFleamarketChanges: adjustOnlyFIRforBarters: globals not found. Skipping.")
            return;
        }
        globals.config.RagFair.isOnlyFoundInRaidAllowed = true
    }

    private adjustPristineItems(){
        //This should disable randomised item condition.
        for (const condition of Object.values(this.ragfairConfig.dynamic.condition)) {
            condition.conditionChance = 0;
        }
    }

    private increaseFleaPrices(priceMultiplier: number){
        this.ragfairConfig.dynamic.priceRanges.default.max *= priceMultiplier;
        this.ragfairConfig.dynamic.priceRanges.default.min *= priceMultiplier;
    }
}
