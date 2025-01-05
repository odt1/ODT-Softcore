import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { ScavCaseOptions } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { IScavCaseConfig } from "@spt/models/spt/config/IScavCaseConfig"
import { BaseClasses } from "@spt/models/enums/BaseClasses"
import { HandbookHelper } from "@spt/helpers/HandbookHelper"
import { ScavCaseRewardGenerator } from "@spt/generators/ScavCaseRewardGenerator"
import { scavcaseRewardItemValueRangeRubReworked, scavCaseRecipesReworked, scavcaseWhitelist, scavcaseItemBlacklist } from "../assets/scavcase"
import { Traders } from "@spt/models/enums/Traders"
import { ItemFilterService } from "@spt/services/ItemFilterService"
import { SeasonalEventService } from "@spt/services/SeasonalEventService"
import { ItemHelper } from "@spt/helpers/ItemHelper"

import { ItemTpl } from "@spt/models/enums/ItemTpl"

export class ScavCaseOptionsChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private scavCaseConfig: IScavCaseConfig
	private handbookHelper: HandbookHelper
	private itemFilterService: ItemFilterService
	private seasonalEventService: SeasonalEventService
	private itemHelper: ItemHelper

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.handbookHelper = container.resolve<HandbookHelper>("HandbookHelper")
		this.itemFilterService = container.resolve<ItemFilterService>("ItemFilterService")
		this.seasonalEventService = container.resolve<SeasonalEventService>("SeasonalEventService")
		this.itemHelper = container.resolve<ItemHelper>("ItemHelper")
		this.tables = databaseServer.getTables()
		this.scavCaseConfig = configServer.getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE)
	}

	public apply(config: ScavCaseOptions) {
		if (!config.enabled) {
			return
		}

		if (config.betterRewards) {
			this.doBetterRewards()
		}

		if (config.rebalance) {
			this.doRebalance()
		}

		if (config.fasterScavcase.enabled) {
			this.doFasterScavcase(config.fasterScavcase.speedMultiplier)
		}

		// this.debug()
	}

	private doBetterRewards() {
		// Set of all buyable items
		const buyableitems = new Set()
		const traderlist = this.tables.traders
		if (!traderlist) {
			this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: traderlist not found")
			return
		}

		const items = this.tables.templates?.items
		if (!items) {
			this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: this.tables.templates.items not found")
			return
		}

		const handbook = this.tables.templates?.handbook
		if (!handbook) {
			this.logger.warning("ScavCaseOptionsChanger: doBetterRewards: this.tables.templates?.handbook not found")
			return
		}

		for (const [_, trader] of Object.entries(traderlist)) {
			if (_ === Traders.LIGHTHOUSEKEEPER) {
				continue
			}
			const items = trader.assort?.items
			if (!items) {
				this.logger.warning(`ScavCaseOptionsChanger: doBetterRewards: trader.assort.items for trader ${_} not found`)
				return
			}
			items.filter((x) => this.tables.templates?.items[x._tpl]?._parent != "65649eb40bf0ed77b8044453").map((x) => buyableitems.add(x._tpl)) // ignore armor incerts
		}
		// Shitlist generator for scav case rewards. Filters A LOT of crap out, but very conservatevely. Blacklist included in ./docs folder check it out.
		// Always includes items in carefully curated whitelist. Always includes unbuyable and/or cheap items not included in whitelist (such as anodized red gear, but also some crap like scav only hats). Always includes items worth > 10000. Filters everything else out. Spent a lot of time thinking about this, really proud of myself. In the end, just makes sure you almost always get something of valuable or usable.

		// this.scavCaseConfig.rewardItemParentBlacklist.forEach((x) => console.log(`"${x}", // ${this.tables.locales?.global.en[`${x} Name`]}`))
		this.scavCaseConfig.rewardItemParentBlacklist = [
			// stock:
			"5485a8684bdc2da71d8b4567", // Ammo
			"543be5dd4bdc2deb348b4569", // Money
			// "55802f4a4bdc2ddb688b4569", // Essential mod
			"5448bf274bdc2dfc2f8b456a", // Port. container
			"5d52cc5ba4b9367408500062", // AGS-30 30x29mm automatic grenade launcher
			"62f109593b54472778797866", // RandomLootContainer
			"65649eb40bf0ed77b8044453", // BuiltInInserts
		]

		for (const i in items) {
			const item = items[i]
			if (item._type == "Item") {
				//	if (debug) {
				//		item._props.ExaminedByDefault = true // For my sanity
				//	}
				let handbookPrice = this.handbookHelper.getTemplatePrice(item._id)

				if (item._parent == "543be5cb4bdc2deb348b4568") {
					try {
						// Ammo boxes price patch/fix, their data in handbook is always 1k, this makes them valued as ammo*count they contain.
						const count = item._props?.StackSlots[0]?._max_count
						const ammo = item._props?.StackSlots[0]?._props?.filters[0].Filter[0]

						const value = Math.round(this.handbookHelper.getTemplatePrice(ammo) * count)

						const ammobox = handbook.Items.find((x) => x.Id == item._id)
						ammobox.Price = value
						// console.log(`${item._id}, // ${this.tables.locales?.global.en[`${item._id} Name`]}: ${handbook.Items.find((x) => x.Id == item._id)!.Price}`)
					} catch (error) {
						this.logger.warning(
							"handbook.Items.find((x) => x.Id == item._id).Price = value function failed. Ignore this error safely and continue. Send bug report."
						)
						this.logger.warning(error)
					}
				}

				if (
					this.scavCaseItemFilter(item._id) &&
					(!buyableitems.has(item._id) || handbookPrice >= 10000 || scavcaseWhitelist.includes(item._parent))
					// && !scavcaseConfig.rewardItemParentBlacklist.includes(item._parent) // [Debug] not actually needed, used only for reference when generating black/whitelists. Ignore(? TODO: look into it) ammo and money here, they are a special case in SPI-AKI logic.
				) {
					// whitelist here, do nothing.
					//	if (debug) {
					//		// scavWhitelist.push(item._id) // [Debug] used for debug code below
					//		console.log(
					//			`"${item._parent}", // ${items[item._parent]._name} --- "${item._id}", // ${
					//				this.tables.locales?.global.en[`${item._id} Name`]
					//			}: ${this.handbookHelper.getTemplatePrice(item._id)}, `
					//		)
					//	}
				} else {
					this.scavCaseConfig.rewardItemBlacklist.push(item._id)
					// shitlist here.
					//	if (debug) {
					//		console.log(
					//			`"${item._parent}", // ${items[item._parent]._name} --- "${item._id}", // ${
					//				this.tables.locales?.global.en[`${item._id} Name`]
					//			}: ${this.handbookHelper.getTemplatePrice(item._id)}, `
					//		)
					//	}
				}
			}
		}
	}

	private scavCaseItemFilter(itemID) {
		const items = this.tables.templates?.items
		const item = items![itemID]

		if (item._parent === "") {
			return false
		}

		if (item._type === "Node") {
			return false
		}

		if (item._props.QuestItem == true) {
			return false
		}

		if (scavcaseItemBlacklist.includes(itemID)) {
			return false
		}

		if (this.itemFilterService.isItemBlacklisted(itemID)) {
			return false
		}

		if (this.itemFilterService.isBossItem(itemID)) {
			return false
		}

		if (this.itemFilterService.isItemRewardBlacklisted(itemID)) {
			return false
		}

		if (this.seasonalEventService.itemIsSeasonalRelated(itemID)) {
			return false
		}

		if (this.handbookHelper.getTemplatePrice(itemID) < 2) {
			return false
		}

		//	if (this.itemHelper.isOfBaseclasses(itemID, this.scavCaseConfig.rewardItemParentBlacklist)) {
		// // if enabled, this pushes all AMMO to scavCaseConfig.rewardItemBlacklist and it breaks SPT rewards ammogenerator. this was done as a failsafe, so should be ok to disable this check.
		//		return false
		//	}
		//		if (
		//			item._parent == BaseClasses.POCKETS ||
		//			item._parent == BaseClasses.HIDEOUT_AREA_CONTAINER ||
		//			item._parent == BaseClasses.LOOT_CONTAINER ||
		//			item._parent == BaseClasses.POCKETS ||
		//			item._parent == BaseClasses.STASH ||
		//			item._parent == "6672e40ebb23210ae87d39eb" ||
		//			item._parent == BaseClasses.OTHER
		//		) {
		//			console.log(
		//				`"${item._parent}", // ${items[item._parent]._name} --- "${item._id}", // ${
		//					this.tables.locales?.global.en[`${item._id} Name`]
		//				}: ${this.handbookHelper.getTemplatePrice(item._id)}, `
		//			)
		//		}
		return true
	}

	private doFasterScavcase(multiplier: number) {
		for (const [_, recipe] of Object.entries(this.tables.hideout!.production.scavRecipes)) {
			recipe.productionTime = Math.round(recipe.productionTime / multiplier)
		}
	}

	private doRebalance() {
		this.scavCaseConfig.rewardItemValueRangeRub = scavcaseRewardItemValueRangeRubReworked
		this.tables.hideout!.production.scavRecipes = scavCaseRecipesReworked
	}

	private debug() {
		for (const [_, recipe] of Object.entries(this.tables.hideout!.production.scavRecipes)) {
			// console.log(recipe)
			recipe.requirements[0].templateId = ItemTpl.MONEY_ROUBLES
			recipe.productionTime = 3 // doesn't work for DEV account, SPT has forced check "this.profileHelper.isDeveloperAccount(sessionID) ? 40 : modifiedScavCaseTime". Need to manually modify profile edition string after creation.
		}
	}
}
