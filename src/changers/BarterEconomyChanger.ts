import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { BarterEconomy } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig"
import { MinMax } from "@spt/models/common/MinMax"
import { fleaBarterRequestWhitelist, fleaBarterRequestBlacklistItems } from "../assets/fleamarket"
import { IItemConfig } from "@spt/models/spt/config/IItemConfig"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { BaseClasses } from "@spt/models/enums/BaseClasses"

export class BarterEconomyChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private ragfairConfig: IRagfairConfig
	private itemconfig: IItemConfig

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.tables = databaseServer.getTables()
		this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		this.itemconfig = configServer.getConfig<IItemConfig>(ConfigTypes.ITEM)
	}

	public apply(config: BarterEconomy) {
		if (!config.enabled) {
			return
		}

		this.doBarterEconomy()
		this.adjustCashOffers(config.cashOffersPercentage)
		this.adjustBarterPriceVariance(config.barterPriceVariance)
		this.adjustItemCountMax(config.itemCountMax)
		this.adjustOfferItemCount(config.offerItemCount)
		this.adjustNonStackableAmount(config.nonStackableCount)

		if (config.unbanBitcoinsForBarters) {
			this.doUnbanBitcoinsForBarters()
		}
	}

	private doBarterEconomy() {
		// Can't blacklist items directly :( so Dogtags will appear in barters if BaseClasses.Other is in the whitelist. However this enables cigarettes etc to be used.
		const barterBlacklist = Object.values(BaseClasses).filter((baseClass) => !fleaBarterRequestWhitelist.includes(baseClass)) as string[]
		this.ragfairConfig.dynamic.barter.itemTypeBlacklist = barterBlacklist
		this.ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("BarterEconomyChanger: doBarterEconomy: Handbook not found, skipping price adjust")
			return
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

	private doUnbanBitcoinsForBarters() {
		this.itemconfig.blacklist = this.itemconfig.blacklist.filter((item) => item !== ItemTpl.BARTER_PHYSICAL_BITCOIN)
	}
}
