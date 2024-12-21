import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { HideoutOptions } from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { StashOptionsChanger } from "./StashOptionsChanger";
import { HideoutContainersChanger } from "./HideoutContainersChanger";
import { FasterBitcoinFarmingChanger } from "./FasterBitcoinFarmingChanger";
import { FasterCraftingTimeChanger } from "./FasterCraftingTimeChanger";
import { FasterHideoutConstructionChanger } from "./FasterHideoutConstructionChanger";
import { FuelConsumptionChanger } from "./FuelConsumptionChanger";
import { ScavCaseOptionsChanger } from "./ScavCaseOptionsChanger";
export class HideoutOptionsChanger {
    private container: DependencyContainer;
    private logger: PrefixLogger;
    private tables: IDatabaseTables;

    constructor(container: DependencyContainer) {
        this.container = container;
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = databaseServer.getTables();
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
            new FasterBitcoinFarmingChanger(this.container).apply(config.fasterBitcoinFarming);
        }

        if (config.fasterCraftingTime.enabled) {
            new FasterCraftingTimeChanger(this.container).apply(config.fasterCraftingTime);
        }

        if (config.fasterHideoutConstruction.enabled) {
            new FasterHideoutConstructionChanger(this.container).apply(config.fasterHideoutConstruction);
        }

        if (config.fuelConsumption.enabled) {
            new FuelConsumptionChanger(this.container).apply(config.fuelConsumption);
        }

        if (config.scavCaseOptions.enabled) {
            new ScavCaseOptionsChanger(this.container).apply(config.scavCaseOptions);
        }

        if (config.allowGymTrainingWithMusclePain) {
            this.doAllowGymTrainingWithMusclePain();
        }
    }

    private doAllowGymTrainingWithMusclePain() {
        const globals =  this.tables.globals;
        if (!globals) {
            this.logger.warning("HideoutOptions: doAllowGymTrainingWithMusclePain: globals not found");
            return;
        }
        globals.config.Health.Effects.SevereMusclePain.GymEffectivity = 0.75;
    }
}
