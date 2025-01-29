import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { EconomyOptions } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { PriceRebalanceChanger } from "./PriceRebalanceChanger"
import { PacifistFleaMarketChanger } from "./PacifistFleaMarketChanger"
import { BarterEconomyChanger } from "./BarterEconomyChanger"
import { OtherFleaMarketChangesChanger } from "./OtherFleaMarketChangesChanger"
export class EconomyOptionsChanger {
	private container: DependencyContainer
	private logger: PrefixLogger
	private tables: IDatabaseTables

	constructor(container: DependencyContainer) {
		this.container = container
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = databaseServer.getTables()
	}

	public apply(config: EconomyOptions) {
		if (!config.enabled) {
			return
		}

		try {
			if (config.disableFleaMarketCompletely) {
				this.doDisableFleaMarketCompletely()
				return
			}
		} catch (error) {
			this.logger.warning("EconomyOptions: doDisableFleaMarketCompletely failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.priceRebalance.enabled) {
				new PriceRebalanceChanger(this.container).apply(config.priceRebalance)
			}
		} catch (error) {
			this.logger.warning("EconomyOptions: PriceRebalanceChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.pacifistFleaMarket.enabled) {
				new PacifistFleaMarketChanger(this.container).apply(config.pacifistFleaMarket)
			}
		} catch (error) {
			this.logger.warning("EconomyOptions: PacifistFleaMarketChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.barterEconomy.enabled) {
				new BarterEconomyChanger(this.container).apply(config.barterEconomy)
			}
		} catch (error) {
			this.logger.warning("EconomyOptions: BarterEconomyChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.otherFleaMarketChanges.enabled) {
				new OtherFleaMarketChangesChanger(this.container).apply(config.otherFleaMarketChanges)
				this.updateRagfairMinUserLevel(config.otherFleaMarketChanges.fleaMarketOpenAtLevel)
			}
		} catch (error) {
			this.logger.warning("EconomyOptions: OtherFleaMarketChangesChanger failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doDisableFleaMarketCompletely() {
		this.updateRagfairMinUserLevel(99)
	}

	private updateRagfairMinUserLevel(level: number) {
		const globals = this.tables.globals
		globals!.config.RagFair.minUserLevel = level
	}
}
