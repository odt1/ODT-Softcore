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
		try {
			this.doChangeFuelConsumption(config.fuelConsumptionMultiplier)
		} catch (error) {
			this.logger.warning("FuelConsumption: doChangeFuelConsumption failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doChangeFuelConsumption(multiplier: number) {
		const hideout = this.tables.hideout
		hideout!.settings.generatorFuelFlowRate *= multiplier // сука. 33 строчки чтобы изменить одну переменную.
	}
}
