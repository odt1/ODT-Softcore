import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { HideoutOptions } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { StashOptionsChanger } from "./StashOptionsChanger"
import { HideoutContainersChanger } from "./HideoutContainersChanger"
import { FasterBitcoinFarmingChanger } from "./FasterBitcoinFarmingChanger"
import { FasterCraftingTimeChanger } from "./FasterCraftingTimeChanger"
import { FasterHideoutConstructionChanger } from "./FasterHideoutConstructionChanger"
import { FuelConsumptionChanger } from "./FuelConsumptionChanger"
import { ScavCaseOptionsChanger } from "./ScavCaseOptionsChanger"
export class HideoutOptionsChanger {
	private container: DependencyContainer
	private logger: PrefixLogger
	private tables: IDatabaseTables

	constructor(container: DependencyContainer) {
		this.container = container
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = databaseServer.getTables()
	}

	public apply(config: HideoutOptions) {
		if (!config.enabled) {
			return
		}

		try {
			if (config.stashOptions.enabled) {
				new StashOptionsChanger(this.container).apply(config.stashOptions)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: StashOptionsChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.hideoutContainers.enabled) {
				new HideoutContainersChanger(this.container).apply(config.hideoutContainers)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: HideoutContainersChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterBitcoinFarming.enabled) {
				new FasterBitcoinFarmingChanger(this.container).apply(config.fasterBitcoinFarming)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: FasterBitcoinFarmingChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterCraftingTime.enabled) {
				new FasterCraftingTimeChanger(this.container).apply(config.fasterCraftingTime)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: FasterCraftingTimeChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterHideoutConstruction.enabled) {
				new FasterHideoutConstructionChanger(this.container).apply(config.fasterHideoutConstruction)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: FasterHideoutConstructionChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fuelConsumption.enabled) {
				new FuelConsumptionChanger(this.container).apply(config.fuelConsumption)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: FuelConsumptionChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.scavCaseOptions.enabled) {
				new ScavCaseOptionsChanger(this.container).apply(config.scavCaseOptions)
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: ScavCaseOptionsChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.allowGymTrainingWithMusclePain) {
				this.doAllowGymTrainingWithMusclePain()
			}
		} catch (error) {
			this.logger.warning("HideoutOptions: doAllowGymTrainingWithMusclePain failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doAllowGymTrainingWithMusclePain() {
		const globals = this.tables.globals

		globals.config.Health.Effects.SevereMusclePain.GymEffectivity = 0.75
	}
}
