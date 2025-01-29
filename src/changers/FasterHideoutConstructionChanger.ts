import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { FasterHideoutConstruction } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"

export class FasterHideoutConstructionChanger {
	private logger: PrefixLogger
	private databaseServer: DatabaseServer
	private tables: IDatabaseTables

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = this.databaseServer.getTables()
	}

	public apply(config: FasterHideoutConstruction) {
		if (!config.enabled) {
			return
		}
		try {
			this.doFasterHideoutConstruction(config.hideoutConstructionTimeMultiplier)
		} catch (error) {
			this.logger.warning("FasterHideoutConstruction: doFasterHideoutConstruction failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doFasterHideoutConstruction(multiplier: number) {
		const hideout = this.tables.hideout

		for (const area of hideout.areas) {
			for (const [_, stage] of Object.entries(area.stages)) {
				stage.constructionTime = Math.round(stage.constructionTime / multiplier)
			}
		}
	}
}
