import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { TraderChanges } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { Traders } from "@spt/models/enums/Traders"
import { BaseClasses } from "@spt/models/enums/BaseClasses"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { BSGblacklist, pacifistFenceItemBaseWhitelist } from "../assets/fleamarket"
import { itemBaseClasses } from "../assets/itemBaseClasses"
import { FenceService } from "@spt/services/FenceService"
import { FenceBaseAssortGenerator } from "@spt/generators/FenceBaseAssortGenerator"
export class TraderChangesChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private traderConfig: ITraderConfig
	private fenceService: FenceService
	private fenceBaseAssortGenerator: FenceBaseAssortGenerator
	private stacticTraderList

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.tables = databaseServer.getTables()
		this.traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		this.fenceService = container.resolve<FenceService>("FenceService")
		this.fenceBaseAssortGenerator = container.resolve<FenceBaseAssortGenerator>("FenceBaseAssortGenerator")

		this.stacticTraderList = {
			// To ignore custom traders
			PRAPOR: "54cb50c76803fa8b248b4571",
			THERAPIST: "54cb57776803fa99248b456e",
			FENCE: "579dc571d53a0658a154fbec",
			SKIER: "58330581ace78e27b8b10cee",
			PEACEKEEPER: "5935c25fb3acc3127c3d8cd9",
			MECHANIC: "5a7c2eca46aef81a7ca2145d",
			RAGMAN: "5ac3b934156ae10c4430e83c",
			JAEGER: "5c0647fdd443bc2504c2d371",
			REF: "6617beeaa9cfa777ca915b7c",
		}
	}

	public apply(config: TraderChanges) {
		if (!config.enabled) {
			return
		}

		try {
			if (config.betterSalesToTraders) {
				this.doBetterSalesToTraders()
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doBetterSalesToTraders failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.alternativeCategories) {
				this.doAlternativeCategories()
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doAlternativeCategories failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.pacifistFence.enabled) {
				this.doPacifistFence(config.pacifistFence.numberOfFenceOffers)
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doPacifistFence failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.reasonablyPricedCases) {
				this.doReasonablyPricedCases()
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doReasonablyPricedCases failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.skierUsesEuros) {
				this.doSkierUsesEuros()
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doSkierUsesEuros failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.biggerLimits.enabled) {
				this.doBiggerLimits(config.biggerLimits.multiplier)
			}
		} catch (error) {
			this.logger.warning("TraderChanges: doBiggerLimits failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doBetterSalesToTraders() {
		const buyPriceAdjustment = {
			[Traders.PEACEKEEPER]: 7,
			[Traders.SKIER]: 6,
			[Traders.PRAPOR]: 5,
			[Traders.MECHANIC]: 4,
			[Traders.JAEGER]: 3,
			[Traders.RAGMAN]: 2,
			[Traders.THERAPIST]: 1,
		}

		for (const [trader, traderID] of Object.entries(this.stacticTraderList)) {
			let buyPriceCoef = 35
			if (!Object.keys(buyPriceAdjustment).includes(traderID)) {
				continue
			}
			for (const loyaltyLevel of this.tables.traders![traderID].base.loyaltyLevels) {
				loyaltyLevel.buy_price_coef = buyPriceCoef
				loyaltyLevel.buy_price_coef += buyPriceAdjustment[traderID]
				buyPriceCoef -= 5
			}
		}
	}

	private doAlternativeCategories() {
		const traderList = this.tables.traders

		traderList![Traders.THERAPIST].base.items_buy.category.push(...[BaseClasses.MEDICAL_SUPPLIES, BaseClasses.HOUSEHOLD_GOODS])
		traderList![Traders.THERAPIST].base.items_buy.category = traderList![Traders.THERAPIST].base.items_buy.category.filter(
			(baseclass) => baseclass !== BaseClasses.BARTER_ITEM
		)

		traderList![Traders.RAGMAN].base.items_buy.category.push(BaseClasses.JEWELRY)
		traderList![Traders.SKIER].base.items_buy.category.push(BaseClasses.INFO)
	}

	private doPacifistFence(numberOfFenceOffers: number) {
		// Fence uses multiple blacklists to generate items he can sell in SPT, these are: itemConfig.blacklist, itemconfig.rewardItemBlacklist, not a quest item, and the basetype is not blacklisted on traderconfig.fence.blacklist
		const fenceWhitelist = pacifistFenceItemBaseWhitelist as string[]
		const fenceBlacklist = itemBaseClasses.filter((x) => !fenceWhitelist.includes(x))
		this.traderConfig.fence.itemTypeLimits = Object.fromEntries(Object.values(itemBaseClasses).map((key) => [key.replaceAll(" ", ""), numberOfFenceOffers])) // replaceAll is for SPT typo in BaseClasses enums. But anyway, if all BaseClasses used intead of pure (excluding Notes) manual listed itemBaseClasses, Fence breaks.

		// SPT GITM BUG PART 1 WITH MedicalSupplies, wasted 3 hours on this. MedicalSupplies in itemTypeLimits OR preventDuplicateOffersOfCategory break Fence, GG
		// biome-ignore lint/performance/noDelete: <explanation>
		delete this.traderConfig.fence.itemTypeLimits["57864c8c245977548867e7f1"]

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("PacifistFleaMarket: enableWhitelist: items table not found")
			return
		}

		// biome-ignore lint/correctness/noConstantCondition: <explanation>
		if (false) {
			// Pure base classes generator, excludes Nodes, Nodes break Fence and possibly other instances
			let iii = []
			for (const item in items) {
				if (items![item]._type === "Item") {
					iii.push(items[item]._parent)
				}
				if (items[item]._parent === "5448f3ac4bdc2dce718b4569" && !items[item]._props.QuestItem) {
					// console.log(`"${item}", // ${items[item]._name}`) // MedicalSupplies in itemTypeLimits OR preventDuplicateOffersOfCategory break Fence, GG
				}
			}
			iii = new Set(iii)
			iii.forEach((x) => console.log(`"${x}", // ${items[x]._name}`))
		}

		const questItemIDs = Object.values(items)
			.filter((item) => item._props.QuestItem)
			.map((item) => item._id)

		// this.traderConfig.fence.blacklist = [...new Set(...BSGblacklist, ...questItemIDs)] // I'll just leave it as a testament to stupidity. This, this what that code was producing: ['5', '4', 'a', '1','c', 'b', 'd', '2','7', '0', 'e', '8','6']
		this.traderConfig.fence.blacklist = Array.from(
			new Set([...this.traderConfig.fence.blacklist, ...questItemIDs, ...BSGblacklist, ...fenceBlacklist, ItemTpl.INFO_ENCRYPTED_FLASH_DRIVE])
		)
		// this.traderConfig.fence.blacklist.forEach((x) => console.log(`"${x}", // ${items[x]._name}`)) // debug

		// SPT GITM BUG PART 2 WITH MedicalSupplies, wasted 3 hours on this. MedicalSupplies in itemTypeLimits OR preventDuplicateOffersOfCategory break Fence, GG
		this.traderConfig.fence.preventDuplicateOffersOfCategory = fenceWhitelist.filter((x) => x !== "57864c8c245977548867e7f1")
		this.traderConfig.fence.assortSize = numberOfFenceOffers
		this.traderConfig.fence.equipmentPresetMinMax.min = 0
		this.traderConfig.fence.equipmentPresetMinMax.max = 0
		this.traderConfig.fence.weaponPresetMinMax.min = 0
		this.traderConfig.fence.weaponPresetMinMax.max = 0
		this.traderConfig.fence.itemPriceMult = 1
		this.traderConfig.fence.discountOptions.assortSize = numberOfFenceOffers * 2
		this.traderConfig.fence.discountOptions.itemPriceMult = 0.82
		this.traderConfig.fence.discountOptions.weaponPresetMinMax.min = 0
		this.traderConfig.fence.discountOptions.weaponPresetMinMax.max = 0
		this.traderConfig.fence.discountOptions.equipmentPresetMinMax.min = 0
		this.traderConfig.fence.discountOptions.equipmentPresetMinMax.max = 0
	}

	private doReasonablyPricedCases() {
		this.adjustTherapistBarters()
		this.adjustPeacekeeperBarters()
		this.adjustSkierBarters()
	}

	private adjustPeacekeeperBarters() {
		this.modifyTraderBarters(Traders.PEACEKEEPER, ItemTpl.CONTAINER_THICC_ITEM_CASE, {
			[ItemTpl.INFO_TERRAGROUP_BLUE_FOLDERS_MATERIALS]: (requirement) => {
				requirement.count = Math.round(requirement.count / 5) + 1
			},
		})
	}

	private adjustSkierBarters() {
		this.modifyTraderBarters(Traders.SKIER, ItemTpl.CONTAINER_WEAPON_CASE, {
			[ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE]: (requirement) => {
				requirement.count = 4
			},
		})
	}

	private adjustTherapistBarters() {
		this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_ITEM_CASE, {
			[ItemTpl.MONEY_EUROS]: (requirement) => {
				requirement.count = 7256 // Adjust price for Euros barter
			},
			[ItemTpl.BARTER_OPHTHALMOSCOPE]: (requirement) => {
				requirement.count = 8 // Adjust count for Ophthalmoscope barter
			},
			[ItemTpl.BARTER_DOGTAG_USEC]: (requirement) => {
				requirement.count = 20 // Adjust count for Dogtag barter
			},
		})

		this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_LUCKY_SCAV_JUNK_BOX, {
			[ItemTpl.MONEY_ROUBLES]: (requirement) => {
				requirement.count = 961138 // Adjust price for Roubles barter
			},
			[ItemTpl.BARTER_DOGTAG_USEC]: (requirement) => {
				requirement.count = 15 // Adjust count for Dogtag barter
			},
		})

		this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_MEDICINE_CASE, {
			[ItemTpl.MONEY_ROUBLES]: (requirement) => {
				requirement.count = 290610 // Adjust price for Medicine Case Roubles barter
			},
		})

		this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR, {
			[ItemTpl.BARTER_DOGTAG_USEC]: (requirement) => {
				requirement.count /= 10 // Scale down LEDX barter cost by 10
			},
		})

		this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_THICC_ITEM_CASE, {
			[ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR]: (requirement) => {
				requirement.count = 5 // Scale down LEDX barter cost by 10
			},
			[ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE]: (requirement) => {
				requirement.count = 10 // Scale down LEDX barter cost by 10
			},
		})
	}

	private modifyTraderBarters(trader: Traders, targetItemID: ItemTpl, adjustments: Record<string, (requirement) => void>) {
		const traderAssort = this.tables.traders![trader].assort
		if (!traderAssort) {
			this.logger.error(`traderAssort of trader ${trader} not found`)
			return
		}

		// Find barter IDs for the target template
		const barterIDs = Object.values(traderAssort.items).map((assortItem) => {
			if (assortItem._tpl === targetItemID) {
				return assortItem._id
			}
		}) as string[]

		// Apply adjustments based on the requirement type
		for (const [adjustmentTpl, countAdjustment] of Object.entries(adjustments)) {
			for (const barterID of barterIDs) {
				const hasTargetTpl = traderAssort.barter_scheme?.[barterID]?.some((requirementSet) => requirementSet.some((req) => req._tpl === adjustmentTpl))
				if (hasTargetTpl) {
					// Adjust all requirements' counts in this barter
					for (const requirement of traderAssort.barter_scheme[barterID][0]) {
						countAdjustment(requirement)
					}
				}
			}
		}
	}

	private doSkierUsesEuros() {
		const skier = this.tables.traders![Traders.SKIER]
		const handbookItems = this.tables.templates!.handbook.Items
		const euroPrice = handbookItems.find((x) => x.Id === ItemTpl.MONEY_EUROS)!.Price

		skier.base.currency = "EUR"
		skier.base.balance_eur = 700000

		for (const loyaltyLevel of skier.base.loyaltyLevels) {
			loyaltyLevel.minSalesSum = Math.round(loyaltyLevel.minSalesSum / euroPrice)
		}

		const skierAssorts = skier.assort
		const eurBarterID = skierAssorts!.items.find((item) => item._tpl === ItemTpl.MONEY_EUROS)!._id

		for (const [ID, barter] of Object.entries(skierAssorts!.barter_scheme)) {
			if (ID === eurBarterID) {
				continue
			}

			if (barter[0][0]._tpl === ItemTpl.MONEY_ROUBLES) {
				barter[0][0].count = Math.round((barter[0][0].count / euroPrice) * 100) / 100
				barter[0][0]._tpl = ItemTpl.MONEY_EUROS
			}
		}

		//Adjust SKier Quest Rewards
		const quests = this.tables.templates!.quests

		for (const quest of Object.values(quests)) {
			if (quest.traderId === Traders.SKIER) {
				const rewards = quest.rewards.Success
				if (!rewards) {
					this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} rewards not found, skipping")
					continue
				}
				for (const reward of rewards) {
					if (reward.items) {
						for (const item of reward.items) {
							if (item._tpl === ItemTpl.MONEY_ROUBLES) {
								item._tpl = ItemTpl.MONEY_EUROS
								if (!item.upd?.StackObjectsCount) {
									this.logger.warning(`TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} reward item: ${item._tpl} upd not found, skipping`)
									continue
								}
								item.upd.StackObjectsCount = Math.ceil(item.upd.StackObjectsCount / euroPrice)
								if (!reward.value) {
									this.logger.warning(`TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} reward value not found, skipping`)
									continue
								}
								reward.value = Math.ceil((reward.value as number) / euroPrice)
							}
						}
					}
				}
			}
		}
	}

	private doBiggerLimits(multiplier: number) {
		for (const traderID of Object.values(this.stacticTraderList)) {
			const traderItems = this.tables.traders![traderID].assort.items
			if (!traderItems) {
				this.logger.warning(`TraderChangesChanger: doBiggerLimits: traderItems for trader ${traderID} not found, skipping`)
				continue
			}
			for (const item of traderItems) {
				if (item.upd?.BuyRestrictionMax) {
					item.upd.BuyRestrictionMax = Math.round(item.upd.BuyRestrictionMax * multiplier)
				}
			}
		}
	}
}
