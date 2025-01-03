import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { InsuranceChanges, TraderInsuranceChanges } from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { Traders } from "@spt/models/enums/Traders";
import { IInsuranceConfig } from "@spt/models/spt/config/IInsuranceConfig";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";

export class InsuranceChangesChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private insuranceConfig: IInsuranceConfig;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.insuranceConfig = ConfigServer.getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE);
    }

    public apply(config: InsuranceChanges) {
        if (!config.enabled) {
            return;
        }
        if (config.praporInsuranceChanges.enabled) {
            this.doTraderInsuranceChanges(Traders.PRAPOR, config.praporInsuranceChanges);
        }
        if (config.therapistInsuranceChanges.enabled) {
            this.doTraderInsuranceChanges(Traders.THERAPIST, config.therapistInsuranceChanges);
        }
    }
    doTraderInsuranceChanges(traderID: Traders, insuranceChanges: TraderInsuranceChanges) {
        const trader = this.tables.traders?.[traderID];
        if (!trader) {
            this.logger.warning("InsuranceChangesChanger: doTraderInsuranceChanges: trader ${traderID} not found, skipping");
            return;
        }
        trader.base.insurance.min_return_hour = insuranceChanges.returnTime.min;
        trader.base.insurance.max_return_hour = insuranceChanges.returnTime.max;
        trader.base.insurance.max_storage_time = 720;
        this.insuranceConfig.returnChancePercent[traderID] = insuranceChanges.returnChance;
        for (const loyaltyLevel of trader.base.loyaltyLevels) {
            loyaltyLevel.insurance_price_coef = insuranceChanges.insuranceCostMultiplier;
        }
    }
}
