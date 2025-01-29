import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { HideoutContainers } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { PrefixLogger } from "../util/PrefixLogger"

export class HideoutContainersChanger {
	private logger: PrefixLogger
	private databaseServer: DatabaseServer
	private tables: IDatabaseTables
	private items: Record<string, ITemplateItem> | undefined

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = this.databaseServer.getTables()
		this.items = this.tables.templates?.items
	}

	public apply(config: HideoutContainers) {
		if (!config.enabled) {
			return
		}

		try {
			if (config.biggerHideoutContainers) {
				this.doBiggerHideoutContainers()
			}
		} catch (error) {
			this.logger.warning("HideoutContainers: doBiggerHideoutContainers failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.siccCaseBuff) {
				this.doSiccCaseBuff()
			}
		} catch (error) {
			this.logger.warning("HideoutContainers: doSiccCaseBuff failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doBiggerHideoutContainers() {
		const containersToModify = [
			{ tpl: ItemTpl.CONTAINER_MEDICINE_CASE, cellsH: 10, cellsV: 10 },
			{ tpl: ItemTpl.CONTAINER_MR_HOLODILNICK_THERMAL_BAG, cellsH: 10, cellsV: 10 },
			{ tpl: ItemTpl.CONTAINER_MAGAZINE_CASE, cellsH: 10, cellsV: 7 },
			{ tpl: ItemTpl.CONTAINER_ITEM_CASE, cellsH: 10, cellsV: 10 },
			{ tpl: ItemTpl.CONTAINER_WEAPON_CASE, cellsH: 6, cellsV: 15 },
			{ tpl: ItemTpl.CONTAINER_KEY_TOOL, cellsH: 5, cellsV: 5 },
			{ tpl: ItemTpl.CONTAINER_THICC_WEAPON_CASE, cellsH: 14, cellsV: 15 },
		]

		for (const container of containersToModify) {
			const item = this.items[container.tpl]
			if (item?._props?.Grids?.[0]?._props) {
				item._props.Grids[0]._props.cellsH = container.cellsH
				item._props.Grids[0]._props.cellsV = container.cellsV
			} else {
				this.logger.warning(`doBiggerHideoutContainers: ${container.tpl} not found.`)
			}
		}
	}

	private doSiccCaseBuff() {
		// Huge buff to SICC case to make it actually not shit and a direct upgrade to Docs. And while we are here, allow it to hold keytool. It's Softcore, who
		const docsFilter = this.items?.[ItemTpl.CONTAINER_DOCUMENTS_CASE]._props.Grids?.[0]._props.filters[0].Filter
		const siccFilter = this.items?.[ItemTpl.CONTAINER_SICC]._props.Grids?.[0]._props.filters[0].Filter
		if (!docsFilter || !siccFilter) {
			this.logger.warning("HideoutContainers: doSiccCaseBuff: docsFilter or siccFilter not found")
			return
		}
		const mergeFilters = [...new Set([...docsFilter, ...siccFilter, ItemTpl.CONTAINER_KEY_TOOL])]
		this.items[ItemTpl.CONTAINER_SICC]._props.Grids[0]._props.filters[0].Filter = mergeFilters
		// this.items[ItemTpl.CONTAINER_SICC]._props.Grids[0]._props.filters[0].Filter.forEach((x) => {
		// 	console.log(this.tables.locales?.global.en[`${x} Name`])
		// })
	}
}
