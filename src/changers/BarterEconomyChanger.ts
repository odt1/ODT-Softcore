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

		const fleaPrices = this.tables.templates?.prices
		if (!fleaPrices) {
			this.logger.warning("BarterEconomyChanger: doBarterEconomy: tables.templates.prices not found")
			return
		}

		for (const item in items) {
			if (items[item]._props.QuestItem == true) {
				fleaPrices[item] = 2
			}
		}

		fleaPrices["614451b71e5874611e2c7ae5"] = 2 // Bottle of Tarkovskaya vodka, 25000
		// fleaPrices["6389c92d52123d5dd17f8876"] = 2 // Advanced Electronic Materials textbook, 490000
		// fleaPrices["6389c8fb46b54c634724d847"] = 2 // Silicon Optoelectronic Integrated Circuits textbook, 500000
		// fleaPrices["64d0b40fbe2eed70e254e2d4"] = 2 // Sacred Amulet, 100000
		fleaPrices["6389c7f115805221fb410466"] = 2680970 // Far-forward GPS Signal Amplifier Unit, 120000
		fleaPrices["6389c85357baa773a825b356"] = 6648292 // Advanced current converter, 300000
		fleaPrices["5df8a77486f77412672a1e3f"] = 2 // Christmas tree ornament (Violet), 20000
		fleaPrices["6662e9f37fa79a6d83730fa0"] = 2 // Dogtag USEC, 600
		fleaPrices["6662ea05f6259762c56f3189"] = 2 // Dogtag USEC, 600
		fleaPrices["59f32c3b86f77472a31742f0"] = 2 // Dogtag USEC, 600
		fleaPrices["6389c7750ef44505c87f5996"] = 1566360 // Microcontroller board, 100000
		fleaPrices["5df8a72c86f77412640e2e83"] = 2 // Christmas tree ornament (Silver), 10000
		fleaPrices["5df8a6a186f77412640e2e80"] = 2 // Christmas tree ornament (Red), 7000
		fleaPrices["59f32bb586f774757e1e8442"] = 2 // Dogtag BEAR, 600
		fleaPrices["6662e9aca7e0b43baa3d5f74"] = 2 // Dogtag BEAR, 600
		fleaPrices["6662e9cda7e0b43baa3d5f76"] = 2 // Dogtag BEAR, 600
		fleaPrices["660bc341c38b837877075e4c"] = 2 // Documents with decrypted data
		fleaPrices["660bbc47c38b837877075e47"] = 2 // Encrypted flash drive
		fleaPrices["660bbc98c38b837877075e4a"] = 2 // Decrypted flash drive
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
