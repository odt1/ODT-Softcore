import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { BarterEconomy } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig"
import { MinMax } from "@spt/models/common/MinMax"
import { fleaBarterRequestWhitelist, requestWhitelist, BSGblacklist } from "../assets/fleamarket"
import { IItemConfig } from "@spt/models/spt/config/IItemConfig"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { BaseClasses } from "@spt/models/enums/BaseClasses"
import { ItemHelper } from "@spt/helpers/ItemHelper"

export class BarterEconomyChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private ragfairConfig: IRagfairConfig
	private itemconfig: IItemConfig
	private itemHelper: ItemHelper

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.itemHelper = container.resolve<ItemHelper>("ItemHelper")
		this.tables = databaseServer.getTables()
		this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		this.itemconfig = configServer.getConfig<IItemConfig>(ConfigTypes.ITEM)
	}

	public apply(config: BarterEconomy) {
		if (!config.enabled) {
			return
		}

		try {
			this.doBarterEconomy()
		} catch (error) {
			this.logger.warning("\n BarterEconomy: doBarterEconomy failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			this.adjustCashOffers(config.cashOffersPercentage)
		} catch (error) {
			this.logger.warning("\n BarterEconomy: adjustCashOffers failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			this.adjustBarterPriceVariance(config.barterPriceVariance)
		} catch (error) {
			this.logger.warning("\n BarterEconomy: adjustBarterPriceVariance failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			this.adjustItemCountMax(config.itemCountMax)
		} catch (error) {
			this.logger.warning("\n BarterEconomy: adjustItemCountMax failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			this.adjustOfferItemCount(config.offerItemCount)
		} catch (error) {
			this.logger.warning("\n BarterEconomy: adjustOfferItemCount failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			this.adjustNonStackableAmount(config.nonStackableCount)
		} catch (error) {
			this.logger.warning("\n BarterEconomy: adjustNonStackableAmount failed gracefully. Send bug report. Continue safely.")
			console.log(error)
		}
	}

	private doBarterEconomy() {
		const locale = this.tables.locales?.global.en // debug

		const barterBlacklist = Object.values(BaseClasses).filter((baseClass) => !fleaBarterRequestWhitelist.includes(baseClass)) as string[]
		this.ragfairConfig.dynamic.barter.itemTypeBlacklist = barterBlacklist
		this.ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100

		// this.ragfairConfig.dynamic.barter.itemTypeBlacklist.forEach((x) => console.log(`"${x}", // ${locale[`${x} Name`]}`)) // log blacklisted for buying baseclasses

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("BarterEconomyChanger: doBarterEconomy: Handbook not found, skipping price adjust")
			return
		}

		const fleaPrices = this.tables.templates?.prices
		if (!fleaPrices) {
			this.logger.warning("BarterEconomyChanger: doBarterEconomy: tables.templates.prices not found")
			return
		}

		for (const item in items) {
			if (
				items[item]._type === "Item" &&
				!this.itemHelper.isOfBaseclasses(item, this.ragfairConfig.dynamic.barter.itemTypeBlacklist) &&
				items[item]._parent !== BaseClasses.MONEY
			) {
				if (items[item]._props.QuestItem === true) {
					// Block quest items from being requested on flea
					// console.log(`"${item}": ${fleaPrices[item]} // ${locale[`${item} Name`]}`)
					fleaPrices[item] = 0
				} else if (!items[item]._props.CanSellOnRagfair) {
					// Block every other shady item
					// console.log(`"${item}": ${fleaPrices[item]} // ${locale[`${item} Name`]}`)
					fleaPrices[item] = 0
					// console.log(`${item}, // ${locale[`${item} Name`]}, ${fleaPrices[item]}`)
				} else {
					if (BSGblacklist.includes(item) && items[item]._props.CanSellOnRagfair === true) {
						this.logger.warning(`\nItem ${locale?.[`${item} Name`]} can be bought on flea, don't use BSG blacklist unlockers with Barter Economy enabled!`)
					}

					// Log for whitelisted items for barter REQUESTS
					// console.log(`"${item}": ${fleaPrices[item]} // ${this.tables.locales?.global.en[`${item} Name`]}`)
				}
			}
		}

		for (const item in requestWhitelist) {
			// Unblock for requests otherwise blocked items from requestWhitelist
			fleaPrices[item] = requestWhitelist[item]
		}
	}

	private adjustCashOffers(cashOffersPercentage: number) {
		this.ragfairConfig.dynamic.barter.chancePercent = 100 - cashOffersPercentage
	}

	private adjustBarterPriceVariance(barterPriceVariance: number) {
		this.ragfairConfig.dynamic.barter.priceRangeVariancePercent = barterPriceVariance
	}

	private adjustItemCountMax(itemCountMax: number) {
		this.ragfairConfig.dynamic.barter.itemCountMax = itemCountMax
	}

	private adjustOfferItemCount(minMaxRecord: MinMax) {
		this.ragfairConfig.dynamic.offerItemCount = minMaxRecord
	}

	private adjustNonStackableAmount(minMaxRecord: MinMax) {
		this.ragfairConfig.dynamic.nonStackableCount = minMaxRecord
	}
}
