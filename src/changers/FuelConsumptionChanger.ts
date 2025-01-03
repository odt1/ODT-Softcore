import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { FuelConsumption } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"

export class FuelConsumptionChanger {
	private logger: PrefixLogger
	private databaseServer: DatabaseServer
	private tables: IDatabaseTables

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = this.databaseServer.getTables()
	}

	public apply(config: FuelConsumption) {
		if (!config.enabled) {
			return
		}
		this.doChangeFuelConsumption(config.fuelConsumptionMultiplier)
	}

	private doChangeFuelConsumption(multiplier: number) {
		const hideout = this.tables.hideout
		if (!hideout) {
			this.logger.warning("FuelConsumptionChanger: doChangeFuelConsumption: hideout not found")
			return
		}
		hideout.settings.generatorFuelFlowRate *= multiplier
	}
}
