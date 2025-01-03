import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { PriceRebalance } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { ItemTpl } from "@spt/models/enums/ItemTpl"

export class PriceRebalanceChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = databaseServer.getTables()
	}

	public apply(config: PriceRebalance) {
		if (!config.enabled) {
			return
		}

		if (config.itemFixes) {
			this.doItemFixes()
		}

		this.doPriceRebalance()
	}

	private doItemFixes() {
		const itemsToFix: Record<string, number> = {
			[ItemTpl.VISORS_ROUND_FRAME_SUNGLASSES]: 3084 * 5,
			[ItemTpl.AMMO_40MMRU_VOG25]: 6750 * 5,
			[ItemTpl.VISORS_ANTIFRAGMENTATION_GLASSES]: 2181 * 2,
			[ItemTpl.BACKPACK_LOLKEK_3F_TRANSFER_TOURIST]: 18000 * 2,
			[ItemTpl.FOOD_EMELYA_RYE_CROUTONS]: 1500,
			[ItemTpl.FOOD_RYE_CROUTONS]: 2000,
			[ItemTpl.INFO_INTELLIGENCE_FOLDER]: 588000,
			[ItemTpl.INFO_MILITARY_FLASH_DRIVE]: 224400,
		}

		const handbookItems = this.tables.templates?.handbook.Items
		if (!handbookItems) {
			this.logger.warning("PriceRebalance: doItemFixes: handbook not found")
			return
		}

		for (const [itemTpl, price] of Object.entries(itemsToFix)) {
			const item = handbookItems.find((item) => item.Id === itemTpl)
			if (!item) {
				this.logger.warning(`PriceRebalance: doItemFixes: item ${itemTpl} not found, skipping`)
				continue
			}
			item.Price = price
		}
	}

	private doPriceRebalance() {
		const handbookItems = this.tables.templates?.handbook.Items
		if (!handbookItems) {
			this.logger.warning("PriceRebalance: doPriceRebalance: handbook not found")
			return
		}
		const fleaPrices = this.tables.templates?.prices
		if (!fleaPrices) {
			this.logger.warning("PriceRebalance: doPriceRebalance: fleaprices not found")
			return
		}
		for (const item of handbookItems) {
			fleaPrices[item.Id] = item.Price
		}
	}
}
