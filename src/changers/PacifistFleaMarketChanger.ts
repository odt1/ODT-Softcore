import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { PacifistFleaMarket } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { markedKeys, questKeys } from "../assets/keys"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig"
import { fleaListingsWhitelistHandBook, whitelist } from "../assets/fleamarket"
export class PacifistFleaMarketChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private ragfairConfig: IRagfairConfig

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.tables = databaseServer.getTables()
		this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
	}

	public apply(config: PacifistFleaMarket) {
		if (!config.enabled) {
			return
		} else {
			this.pacifistFleaMarket()
		}
		if (config.whitelist.enabled) {
			this.allowOnRagfair(whitelist, config.whitelist.priceMultiplier)
		}
		if (config.questKeys.enabled) {
			this.allowOnRagfair(questKeys, config.questKeys.priceMultiplier)
		}

		if (config.markedKeys.enabled) {
			this.allowOnRagfair(markedKeys, config.markedKeys.priceMultiplier)
		}
	}

	private pacifistFleaMarket() {
		const locale = this.tables.locales?.global.en // debug
		if (false) {
			// debug
			// Handbook Categories generator
			const handbookCategories = this.tables.templates?.handbook.Categories
			for (const handbookCategorie in handbookCategories) {
				// console.log(handbookCategories[handbookCategorie].Id)
				console.log(`"${handbookCategories[handbookCategorie].Id}", // ${locale[handbookCategories[handbookCategorie].Id]}`)
			}
		}

		const handbookItems = this.tables.templates?.handbook.Items
		if (!handbookItems) {
			this.logger.warning("PacifistFleaMarket: handbookItems table not found")
			return
		}

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("PacifistFleaMarket: enableWhitelist: items table not found")
			return
		}

		for (const handbookItem in handbookItems) {
			// For some mAgIcAl reason I can't even remember, this NEEDS to be done in handbookCategories and NOT in BASECLASSES.
			const itemInHandbook = handbookItems[handbookItem]
			const itemID = itemInHandbook.Id
			// const fleaBarterRequestBlacklistItemsString = fleaBarterRequestBlacklistItems as string[]
			if (
				!fleaListingsWhitelistHandBook.includes(itemInHandbook.ParentId) ||
				items[itemID]._props.QuestItem // ||
				// fleaBarterRequestBlacklistItemsString.includes(itemID)
			) {
				// Ban everything on flea except whitelist handbook categories.
				this.ragfairConfig.dynamic.blacklist.custom.push(itemID) // Better semantics then CanSellOnRagfair
			}
			// else if (items[itemID]._props.CanSellOnRagfair) {
			// 	// Not banned items THAT CAN BE BOUGHT debug
			// 	console.log(`"${itemID}", // ${locale[`${itemID} Name`]}`)
			// }
			//if (itemInHandbook.ParentId == "6564b96a189fe36f356d177c") {
			//	// debug (armor incerts HB category above)
			//	console.log(`${locale[`${itemID} Name`]}`)
			//}
		}
	}

	private allowOnRagfair(whitelist, priceMultiplier: number) {
		const whitelistItemIDs = whitelist as string[]

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("PacifistFleaMarket: adjustedSellableOnRagfair: items table not found")
			return
		}

		const prices = this.tables.templates?.prices
		if (!prices) {
			this.logger.warning("PacifistFleaMarket: prices table not found")
			return
		}

		for (const itemID of whitelistItemIDs) {
			const item = items[itemID]
			if (!item) {
				this.logger.warning(`PacifistFleaMarket: adjustedSellableOnRagfair: item ${itemID} not found, skipping`)
				continue
			}

			prices[itemID] = Math.round(prices[itemID] * priceMultiplier)
			item._props.CanSellOnRagfair = true
			this.ragfairConfig.dynamic.blacklist.custom = this.ragfairConfig.dynamic.blacklist.custom.filter((x) => x != itemID)
		}
	}
}
