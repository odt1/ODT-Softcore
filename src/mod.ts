import { DependencyContainer } from "tsyringe"

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"
import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor"
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor"

// import { ObjectId } from "@spt-aki/utils/ObjectId" // [Debug]

// import * as fs from "fs" // [Debug] Used for file saving

import { itemBaseClasses } from "./itemBaseClasses"
import { BSGblacklist } from "./BSGblacklist"
import { scavcaseWhitelist, scavcaseItemBlacklist } from "./scavcaseLists"

import config from "../config/config.json"

const fleaListingsWhitelist = require("../config/fleaListingsWhitelist.ts") // this Node.js module/require shit is bullshit.
const fleaBarterRequestsWhitelist = require("../config/fleaBarterRequestsWhitelist.ts") // why I can't use import in config directory? Anyway, is there any alternative to JSON data storage? THIS is the only way to save commented data?!
const fleaItemsWhiteList = require("../config/fleaItemsWhitelist.ts")

const debug = false // [Debug] Debug!

class Mod implements IPostDBLoadMod {
	public postDBLoad(container: DependencyContainer): void {
		const logger = container.resolve<ILogger>("WinstonLogger")
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		// const ObjectId = container.resolve<ObjectId>("ObjectId") // [Debug]
		const tables = databaseServer.getTables()
		const locales = tables.locales.global
		const items = tables.templates.items
		const handbook = tables.templates.handbook
		const prices = tables.templates.prices
		const globals = tables.globals.config
		const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		const hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
		const insuranceConfig = configServer.getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE)
		const scavcaseConfig = configServer.getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE)
		const prapor = tables.traders["54cb50c76803fa8b248b4571"]
		const therapist = tables.traders["54cb57776803fa99248b456e"]
		const ragman = tables.traders["5ac3b934156ae10c4430e83c"]
		const jaeger = tables.traders["5c0647fdd443bc2504c2d371"]
		const mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"]
		const peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"]
		const skier = tables.traders["58330581ace78e27b8b10cee"]
		const traderlist = [prapor, therapist, ragman, jaeger, mechanic, peacekeeper, skier]

		// Noice.
		var fleaBarterRequestBlacklist = itemBaseClasses.filter((x) => !fleaBarterRequestsWhitelist.includes(x))

		if (debug) {
			// [Debug]
			for (const i in items) {
				const x = items[i]
				if (x._type != "Item") {
					// log(`"${x._id}", // ${locales["en"][`${x._id} Name`]}`)
					// log(`"${x._id}", // ${x._name}`)
				}
			}
		}

		if (config.ScavCaseOptions.enabled == true) {
			if (config.ScavCaseOptions.BetterRewards.enabled == true) {
				// buyableitems generator, to make sure rare unbuyable items always are in reward pool (eg anodised red gear)
				let buyableitems = new Set()
				for (const trader of traderlist) {
					try {
						trader.assort.items.filter((x) => buyableitems.add(x._tpl))
					} catch (error) {
						logger.warning(
							`trader.assort.items.filter for buyableitems function threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`
						)
						log(error)
					}
				}

				// Shitlist generator for scav case rewards. Filters A LOT of crap out, but very conservatevely. Blacklist included in ./docs folder check it out.
				// Always includes items in carefully curated whitelist. Always includes unbuyable and/or cheap items not included in whitelist (such as anodized red gear, but also some crap like scav only hats). Always includes items worth > 10000. Filters everything else out. Spent a lot of time thinking about this, really proud of myself. In the end, just makes sure you almost always get something of valuable or usable.
				let scavWhitelist = [] // [Debug] used for debug code below
				for (const i in items) {
					const item = items[i]
					if (item._type == "Item") {
						if (debug) {
							item._props.ExaminedByDefault = true // For my sanity
						}
						const itemInHandbook = getItemInHandbook(item._id)

						if (item._parent == "543be5cb4bdc2deb348b4568") {
							try {
								// Ammo boxes price patch/fix, their data in handbook is always 1k, this makes them valued as ammo*count they contain.
								let count = item._props.StackSlots[0]._max_count
								let ammo = item._props.StackSlots[0]._props.filters[0].Filter[0]

								let value = Math.round(getItemInHandbook(ammo).Price * count)

								handbook.Items.find((x) => x.Id == item._id).Price = value
							} catch (error) {
								logger.warning(
									`handbook.Items.find((x) => x.Id == item._id).Price = value function threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`
								)
								log(error)
							}
						}

						if (
							(itemInHandbook?.Price >= 10000 || scavcaseWhitelist.includes(item._parent) || !buyableitems.has(item._id)) &&
							!scavcaseItemBlacklist.includes(item._id) &&
							item._props.QuestItem != true &&
							itemInHandbook?.Price != undefined
							// && !scavcaseConfig.rewardItemParentBlacklist.includes(item._parent) // [Debug] not actually needed, used only for reference when generating black/whitelists. Ignore(? TODO: look into it) ammo and money here, they are a special case in SPI-AKI logic.
						) {
							// whitelist here, do nothing.
							if (debug) {
								scavWhitelist.push(item._id) // [Debug] used for debug code below
								// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
							}
						} else {
							scavcaseConfig.rewardItemBlacklist.push(item._id)
							// shitlist here.
							if (debug) {
								// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
							}
						}
					}
				}

				// Object.values(scavcaseConfig.ammoRewards.ammoRewardBlacklist).forEach(x => x.push(scavcaseItemBlacklist))
				// log(scavcaseConfig)
			}

			if (config.ScavCaseOptions.Rebalance.enabled == true) {
				scavcaseConfig.rewardItemValueRangeRub = {
					common: {
						// AVG 7941
						min: 1,
						max: 20000,
					},
					rare: {
						// AVG 36415
						min: 20001,
						max: 60000,
					},
					superrare: {
						// AVG 157978
						min: 60001,
						max: 1200000,
					},
				}

				const scavCaseRedone = [
					{
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "0",
								max: "0",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
						ProductionTime: 2500,
						Requirements: [
							{
								count: 1,
								isEncoded: false,
								isFunctional: false,
								templateId: "62a09f32621468534a797acb", // Pevko, T1 62a09f32621468534a797acb
								type: "Item",
							},
						],
						_id: "62710974e71632321e5afd5f",
					},
					{
						EndProducts: {
							Common: {
								min: "3",
								max: "4",
							},
							Rare: {
								min: "0",
								max: "1",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
						ProductionTime: 7700,
						Requirements: [
							{
								count: 1,
								isEncoded: false,
								isFunctional: false,
								templateId: "5d40407c86f774318526545a", // Vodka T2 5d40407c86f774318526545a
								type: "Item",
							},
						],
						_id: "62710a8c403346379e3de9be",
					},

					{
						EndProducts: {
							Common: {
								min: "4",
								max: "5",
							},
							Rare: {
								min: "1",
								max: "2",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
						ProductionTime: 8100,
						Requirements: [
							{
								count: 1,
								isEncoded: false,
								isFunctional: false,
								templateId: "5d403f9186f7743cac3f229b", // Whisky T3 5d403f9186f7743cac3f229b
								type: "Item",
							},
						],
						_id: "62710a69adfbd4354d79c58e",
					},
					{
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "0",
								max: "3",
							},
							Superrare: {
								min: "1",
								max: "2",
							},
						},
						ProductionTime: 16800,
						Requirements: [
							{
								count: 1,
								isEncoded: false,
								isFunctional: false,
								templateId: "5d1b376e86f774252519444e", // Moonshine 5d1b376e86f774252519444e
								type: "Item",
							},
						],
						_id: "6271093e621b0a76055cd61e",
					},
					{
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "3",
								max: "5",
							},
							Superrare: {
								min: "0",
								max: "1",
							},
						},
						ProductionTime: 19200,
						Requirements: [
							{
								count: 1,
								isEncoded: false,
								isFunctional: false,
								templateId: "5c12613b86f7743bbe2c3f76", // Intel, 5c12613b86f7743bbe2c3f76
								type: "Item",
							},
						],
						_id: "62710a0e436dcc0b9c55f4ec",
					},
				]

				tables.hideout.scavcase = scavCaseRedone // mi donta undestanda tem red wavy lines, tis bad? tis worka! tis gooda! donta cera wavy lines.
			}
			if (config.ScavCaseOptions.FasterScavcase.enabled == true) {
				tables.hideout.scavcase.forEach((x) => {
					if (debug) {
						x.ProductionTime = 1
					} else {
						x.ProductionTime /= config.ScavCaseOptions.FasterScavcase.SpeedMultiplier
					}
				})
			}
			if (debug) {
				// Random WIP testing code here, I like it, I saved it, ignore it, or use it for debug or your mods.
				//
				// [Debug] Master item list logger OR, optionally filters based on parent class
				// Object.values(items)
				// 	// .filter((x) => x._parent == "543be6564bdc2df4348b4568")
				// 	.map((x) => {
				// 		const price = getItemInHandbook(x._id)?.Price
				// 		log(getItemName(x._parent) + ": " + getItemName(x._id) + ", " + price + " // " + x._id)
				// 	})
				//
				// [Debug] WIP item list logger with file saving, itterates all base classes and filters stuff. Strong stuff, can't remember what it actually does now, was using it to to balance tiers lists.
				// let gg = []
				// for (let i = 0; i < baseClasses.length; i++) {
				// 	const baseclass = baseClasses[i]
				// 	if (scavcaseBlacklist.includes(baseclass)) {
				// 		Object.values(items)
				// 			.filter((x) => x._parent == baseclass)
				// 			.map((x) => {
				// 				const price = getItemInHandbook(x._id)?.Price
				// 				if (price > 10000) {
				// 					gg.push(getItemName(x._parent) + "	" + getItemName(x._id) + "	" + price + "\n")
				// 				}
				// 			})
				// 	}
				// 	if (i == baseClasses.length - 1) {
				// 		const ggs = gg.toString()
				// 		fs.writeFile("./test_b.txt", ggs, (err) => {
				// 			if (err) {
				// 				console.error(err)
				// 			}
				// 			log("OK!")
				// 		})
				// 	}
				// }
				//
				// [Debug] Scavcase tier lists generators, enable scavWhitelist above.
				// const commonItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.common.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.common.max
				// )
				// const rareItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.rare.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.rare.max
				// )
				// const superrareItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.superrare.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.superrare.max
				// )
				// [Debug] Tier lists loggers
				// commonItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				// rareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				// superrareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				//
				// [Debug] AVG sum for tier calc
				//		let sum = 0
				//		for (let i = 0; i < superrareItems.length; i++) {
				//			const item = superrareItems[i]
				//
				//			sum += getItemInHandbook(item).Price
				//		}
				//		log(sum / superrareItems.length)
				//
				// [Debug] Comment generator with filter for ALL items, for white/black lists, shows item names
				// Object.values(items)
				// .filter((x) => x._props.CanSellOnRagfair == false && x._type == "Item")
				// .map((x) => log(`"${x._id}", // ${getItemName(x._id)}`));
				//
				// [Debug] Comment generator for white/black lists, shows item names, universally usefull for different arrays
				// itemWhitelist.map((x) => log(`"${x}", // ${getItemName(x)}`));
				//
				// [Debug] Stale code, filters and logs ALL items
				//	Object.values(items)
				//		.filter((x) => {
				//			const price = getItemInHandbook(x._id)?.Price
				//			return price >= 10000 && price <= 20000
				//		})
				//		.map((x) => {
				//			const price = getItemInHandbook(x._id)?.Price
				//			log(getItemName(x._id) + ": " + price)
				//		})
			}
		}

		if (config.HideoutOptions.enabled == true) {
			// 100x Faster hideout production, 10x superwater and moonshine production, bitcoins
			for (let prod in tables.hideout.production) {
				const endProduct = tables.hideout.production[prod].endProduct
				let productionTime = tables.hideout.production[prod].productionTime
				if (
					(endProduct == "5d1b376e86f774252519444e" || endProduct == "5d1b33a686f7742523398398") &&
					config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.enabled
				) {
					// superwater and moonshine
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.Base_Moonshine_And_Water_Time_Multiplier
					)
				} else if (endProduct == "59faff1d86f7746c51718c9c" && config.HideoutOptions.Faster_Bitcoin_Farming.enabled == true) {
					// bitcoins
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Bitcoin_Farming.Base_Bitcoin_Time_Multiplier
					)
					if (config.HideoutOptions.Faster_Bitcoin_Farming.Revert_Bitcoin_Price_To_v012 == true) {
						tables.templates.handbook.Items.find((x) => x.Id == "59faff1d86f7746c51718c9c").Price = 100000
					}
				} else if (config.HideoutOptions.Faster_Crafting_Time.enabled) {
					// all other crafts
					tables.hideout.production[prod].productionTime = Math.round(productionTime / config.HideoutOptions.Faster_Crafting_Time.Base_Crafting_Time_Multiplier)
				}
			}

			if (config.HideoutOptions.Faster_Crafting_Time.enabled && config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.enabled) {
				// Buff to hideout exp rate, more testing needed
				hideoutConfig.hoursForSkillCrafting /= config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.Hideout_Skill_Exp_Multiplier
			}

			if (config.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
				// Instead of modifing base farming time try this:
				tables.hideout.settings.gpuBoostRate = config.HideoutOptions.Faster_Bitcoin_Farming.GPU_Efficiency

				// TODO: replace getBTCSlots() in HideoutHelper to add bonus slots per farm level. lv2 - 4 slots, lv3 - 5, elite - 7

				// Vanilla: Base time (x1): 40h 17min (2417 min), GPU Boost (0.041225): x1, each GPU has only ~4.12% efficiency
				// 2× GPU: 38h 41min x1.04
				// 10× GPU: 29h 23min x1.37
				// 25× GPU: 20h 15min x1.99
				// 50× GPU: 13h 20min x3.02

				// Softcore v0.1: Base time (x10): 4h 2min, GPU Boost (0.041225): x1
				// 2× GPU: 3h 52min x1.04
				// 10× GPU: 2h 56min x1.37
				// 25× GPU: 2h 1min x1.99
				// 50× GPU: 1h 20min x3.02

				// Softcore v0.2: Base time (x2): 20h 8min, GPU Boost(0.5): x12.13, each GPU has ~50% efficiency
				// 2× GPU: 13h 26min x1.5
				// 10× GPU: 3h 40min x5.5
				// 25× GPU: 1h 33min x13
				// 50× GPU: 0h 47min x25.5

				// Linear: Base time (x1): 40h 17min, GPU Boost (1): x24.26, each GPU is 100% efficient
				// 2× GPU: 20h 8min x2
				// 10× GPU: 4h 2min x10
				// 25× GPU: 1h 37min x25
				// 50× GPU: 0h 48min x50
			}

			if (config.HideoutOptions.Faster_Hideout_Construction.enabled) {
				// 100x Faster hideout construction
				for (const area in tables.hideout.areas) {
					for (const stage in tables.hideout.areas[area].stages) {
						tables.hideout.areas[area].stages[stage].constructionTime = Math.round(
							tables.hideout.areas[area].stages[stage].constructionTime / config.HideoutOptions.Faster_Hideout_Construction.Hideout_Construction_Time_Multiplier
						)
					}
				}
			}

			if (config.HideoutOptions.Increased_Fuel_Consumption.enabled) {
				// 10x faster fuel draw
				tables.hideout.settings.generatorFuelFlowRate *= config.HideoutOptions.Increased_Fuel_Consumption.Fuel_Consumption_Multiplier
			}
		}

		if (config.OtherTweaks.enabled == true) {
			if (config.OtherTweaks.Skill_Exp_Buffs.enabled) {
				// Buff Vitality, Sniper and Surgery skill leveling
				globals.SkillsSettings.Vitality.DamageTakenAction *= 10
				globals.SkillsSettings.Sniper.WeaponShotAction *= 10
				globals.SkillsSettings.Surgery.SurgeryAction *= 10
				Object.values(globals.SkillsSettings.Immunity).forEach((x) => x * 10)
				Object.values(globals.SkillsSettings.StressResistance).forEach((x) => x * 10)
			}

			if (config.OtherTweaks.Faster_Examine_Time.enabled) {
				// Faster ExamineTime
				try {
					Object.values(items)
						.filter((x) => x?._props?.ExamineTime != undefined)
						.forEach((x) => (x._props.ExamineTime /= 5))
				} catch (error) {
					logger.warning(`OtherTweaks.Faster_Examine_Time threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`)
					log(error)
				}
			}

			if (config.OtherTweaks.Remove_Backpack_Restrictions.enabled) {
				// Remove backpack restrictions (for containers [ammo, med, etc] mostly).
				// Never again I'll see an unlootable medcase in 314...
				for (const itemID in items) {
					const item = items[itemID]
					if (item._type == "Item") {
						if (JSON.stringify(item).indexOf("ExcludedFilter") > -1) {
							// JS safety tricks strike again.
							// console.log("Key Found");
							// log(getItemName(item._id))
							let filtered
							try {
								// Safety level 2
								filtered = item._props?.Grids[0]?._props?.filters[0]?.ExcludedFilter
							} catch (error) {
								logger.warning(
									`config.OtherTweaks.Remove_Backpack_Restrictions threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`
								)
								log(error)
							}
							if (filtered.includes("5aafbcd986f7745e590fff23")) {
								// log(getItemName(item._id))
								item._props.Grids[0]._props.filters[0].ExcludedFilter = []
							}
						}
					}
				}
			}

			if (config.OtherTweaks.Keytool_Buff.enabled) {
				// Other opinionated tweaks:
				// keytool buff to make it 5x5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsH = 5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsV = 5
			}

			if (config.OtherTweaks.SICC_Case_Buff.enabled) {
				// Huge buff to SICC case to make it actually not shit and a direct upgrade to Docs. And while we are here, allow it to hold keytool. It's Softcore, who cares.
				let mergeFilters = [
					...new Set([
						...tables.templates.items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter, // Docs
						...tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter, // SICC
						"59fafd4b86f7745ca07e1232", // keytool
					]),
				]
				tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter = mergeFilters
				// log(mergeFilters.map((x) => getItemName(x)))
			}

			if (config.OtherTweaks.Reshala_Always_Has_GoldenTT.enabled) {
				// Reshala always has his Golden TT
				tables.bots.types.bossbully.chances.equipment.Holster = 100
				tables.bots.types.bossbully.inventory.equipment.Holster = { "5b3b713c5acfc4330140bd8d": 1 }
			}
		}

		if (config.InsuranceChanges.enabled == true) {
			// Redo insurance. Prapor in an instant return with 50% chance, costs 10% of item value, Therapist has 2 hour return with 80% chance, costs 20%.
			prapor.base.insurance.min_return_hour = 0
			prapor.base.insurance.max_return_hour = 0
			prapor.base.insurance.max_storage_time = 720
			therapist.base.insurance.min_return_hour = 2
			therapist.base.insurance.max_return_hour = 2
			therapist.base.insurance.max_storage_time = 720
			insuranceConfig.insuranceMultiplier["54cb50c76803fa8b248b4571"] = 0.1
			insuranceConfig.insuranceMultiplier["54cb57776803fa99248b456e"] = 0.2
			insuranceConfig.returnChancePercent["54cb50c76803fa8b248b4571"] = 50
			insuranceConfig.returnChancePercent["54cb57776803fa99248b456e"] = 80
		}

		if (config.EconomyOptions.enabled == true) {
			// Ragfair changes:

			if (config.EconomyOptions.Disable_Flea_Market_Completely.disable == true) {
				globals.RagFair.minUserLevel = 99
			} else {
				globals.RagFair.minUserLevel = config.EconomyOptions.Fleamarket_Opened_at_Level.value

				for (let handbookItem in tables.templates.handbook.Items) {
					const itemInHandbook = tables.templates.handbook.Items[handbookItem]
					const itemID = itemInHandbook.Id

					if (prices[itemID] != undefined && config.EconomyOptions.Price_Rebalance.enabled == true) {
						// Change all Flea prices to handbook prices.
						prices[itemID] = itemInHandbook.Price
					}

					if (!fleaListingsWhitelist.includes(itemInHandbook.ParentId) && config.EconomyOptions.Pacifist_FleaMarket.enabled == true) {
						// Ban everything on flea except whitelist handbook categories above.
						ragfairConfig.dynamic.blacklist.custom.push(itemID) // Better semantics then CanSellOnRagfair
						// items[itemID]._props.CanSellOnRagfair = false
					}
				}

				if (config.EconomyOptions.Price_Rebalance.enabled == true) {
					// Hardcode fix for important or unbalanced items. Too low prices can't convert to barters.
					prices["5aa2b923e5b5b000137b7589"] *= 5 // Round frame sunglasses
					prices["5656eb674bdc2d35148b457c"] *= 5 // 40mm VOG-25 grenade
					prices["59e770b986f7742cbd762754"] *= 2 // Anti-fragmentation glasses
					prices["5f5e45cc5021ce62144be7aa"] *= 2 // LolKek 3F Transfer tourist backpack
					prices["5751487e245977207e26a315"] = 1500 // Emelya
					prices["57347d3d245977448f7b7f61"] = 2000 // Croutons
				}

				// Unban random spawn only quest keys from flea, make them 2x expensive
				if (config.EconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys.enabled == true) {
					for (const questKey of fleaItemsWhiteList.questKeys) {
						prices[questKey] *= config.EconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys.PriceMultiplier
						ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[questKey]._id) // Better semantics then CanSellOnRagfair
						// items[questKey]._props.CanSellOnRagfair = true
					}
				}

				if (config.EconomyOptions.Pacifist_FleaMarket.Enable_Whitelist.enabled) {
					// Unban whitelist
					for (const item of fleaItemsWhiteList.itemWhitelist) {
						ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[item]._id) // Better semantics then CanSellOnRagfair
						// items[item]._props.CanSellOnRagfair = true
					}
				}
				if (config.EconomyOptions.Pacifist_FleaMarket.Enable_Marked_Keys.enabled) {
					// Unban whitelist
					for (const markedKey of fleaItemsWhiteList.markedKeys) {
						prices[markedKey] *= config.EconomyOptions.Pacifist_FleaMarket.Enable_Marked_Keys.PriceMultiplier
						ragfairConfig.dynamic.blacklist.custom = ragfairConfig.dynamic.blacklist.custom.filter((x) => x != items[markedKey]._id) // Better semantics then CanSellOnRagfair
						// items[item]._props.CanSellOnRagfair = true
					}
				}
				if (config.EconomyOptions.Disable_Selling_on_Flea.sellingDisabled == true) {
					ragfairConfig.sell.chance.base = 0
					ragfairConfig.sell.chance.overpriced = 0
					ragfairConfig.sell.chance.underpriced = 0
					// ragfairConfig.sell.time.base = 20
					// ragfairConfig.sell.time.min = 10
					// ragfairConfig.sell.time.max = 30
				} else {
					ragfairConfig.sell.reputation.gain *= 10
					ragfairConfig.sell.reputation.loss *= 10
				}

				// Sligtly increase flea prices, but with bigger variance, you still get a lot of great trades. Hustle.
				ragfairConfig.dynamic.price.min *= config.EconomyOptions.Flea_Prices_Increased.multiplier // 0.8 -> 1.04
				ragfairConfig.dynamic.price.max *= config.EconomyOptions.Flea_Prices_Increased.multiplier // 1.2 -> 1.56

				if (config.EconomyOptions.Flea_Pristine_Items.enabled == true) {
					// Only pristine items are offered on flea.
					Object.values(ragfairConfig.dynamic.condition).forEach((x) => (x.min = 1)) // ._.
				}

				if (config.EconomyOptions.Only_Found_In_Raid_Items_Allowed_For_Barters.enabled == true) {
					//Allow FIR only items for barters. This is default, so just in case. To make a point.
					globals.RagFair.isOnlyFoundInRaidAllowed = true
				} else {
					globals.RagFair.isOnlyFoundInRaidAllowed = false
				}

				if (config.EconomyOptions.Barter_Economy.enabled == true) {
					// Can only barter from items not in the blacklist. Only allows base classes, and not itemIDs =(
					// To diable barter requests for individual item, its flea price should be set to 2, like in the code below.
					ragfairConfig.dynamic.barter.itemTypeBlacklist = fleaBarterRequestBlacklist

					ragfairConfig.dynamic.barter.chancePercent = 100 - config.EconomyOptions.Barter_Economy.Cash_Offers_Percentage.value // Allow 10% of listings for cash
					ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100 // Barters only for items that cost > 100
					ragfairConfig.dynamic.barter.priceRangeVariancePercent = config.EconomyOptions.Barter_Economy.Barter_Price_Variance.value // more variance for flea barters, seems actually fun!

					// Max 2 for 1 barters.
					ragfairConfig.dynamic.barter.itemCountMax = config.EconomyOptions.Barter_Economy.itemCountMax.value

					BSGblacklist.filter((x) => {
						// dirty hack to block BSG blacklisted items (dogtags, bitcoins, ornaments and others) from barters, since you can't buy them on flea anyway, so it should not matter.
						if (x == "59faff1d86f7746c51718c9c" && config.EconomyOptions.Barter_Economy.Unban_Bitcoins_For_Barters.enabled == true) {
							// do nothing
						} else if (!fleaBarterRequestBlacklist.includes(items[x]._parent)) {
							// Only mod items in categories ALLOWED on flea request list
							// Actually, I could have just hardcoded this lol. By default it's just Cristmass ornaments, dogtags and bitcoins.
							// 2 is used to pass getFleaPriceForItem check and not trigger generateStaticPrices
							prices[x] = 2
							// if (items[x]._props.CanSellOnRagfair == true) {
							// 	log(`Item ${getItemName(x)} can be bought on flea for free, you dirty cheater!`)
							// }
						}
					})

					// Max 20 offers. Too low of a number breaks AKI server for some reason, with constant client errors on completed trades.
					// More random trades variance anyway, this is fun.
					ragfairConfig.dynamic.offerItemCount.min = config.EconomyOptions.Barter_Economy.offerItemCount.min
					ragfairConfig.dynamic.offerItemCount.max = config.EconomyOptions.Barter_Economy.offerItemCount.max

					// Max 2 items per offer. Feels nice. Loot more shit, it might come in handy.
					ragfairConfig.dynamic.nonStackableCount.min = config.EconomyOptions.Barter_Economy.nonStackableCount.min
					ragfairConfig.dynamic.nonStackableCount.max = config.EconomyOptions.Barter_Economy.nonStackableCount.max
				}
			}

			if (config.EconomyOptions.Pacifist_Fence.enabled == true) {
				// Add BSGblacklist and mod custom blacklist to Fence blacklists
				let fenceBlacklist = []

				// In addition to other blacklists, no medikits, medical items and drugs for Fence, because he sells them not in pristine condition.
				fenceBlacklist.push(...BSGblacklist, ...fleaBarterRequestBlacklist, "5448f39d4bdc2d0a728b4568", "5448f3ac4bdc2dce718b4569", "5448f3a14bdc2d27728b4569")

				// Instead, allow him to sell stims!
				fenceBlacklist = fenceBlacklist.filter((x) => x != "5448f3a64bdc2d60728b456a")

				// Fence sells only items that are not in the flea blacklist
				traderConfig.fence.assortSize = config.EconomyOptions.Pacifist_Fence.Number_Of_Fence_Offers
				traderConfig.fence.blacklist = fenceBlacklist //itemid or baseid
				traderConfig.fence.maxPresetsPercent = 0
				traderConfig.fence.discountOptions.assortSize = config.EconomyOptions.Pacifist_Fence.Number_Of_Fence_Offers // doesnt seem to work properly
				traderConfig.fence.itemPriceMult = 0.8 // at 6 Fence karma you buy items almost at a price Therapist buys from you. Go grind.
			}

			if (config.EconomyOptions.Reasonably_Priced_Cases.enabled == true) {
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0352"][0].forEach((x) => (x.count = 5)) // THICC case (LEDX)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f036e"][0].forEach((x) => (x.count = 10)) // THICC case (Moonshine)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0334"][0].forEach((x) => (x.count = 5941)) // Item case (Euro)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f034a"][0].forEach((x) => (x.count = 8)) // Item case (OScope)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0380"][0].forEach((x) => (x.count = 20)) // Item case (Dogtags)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0382"][0].forEach((x) => (x.count = 15)) // Lucky Scav Junk box (Dogtags)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0350"][0].forEach((x) => (x.count = 806138)) // Lucky Scav Junk box (Rubles)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f033c"][0].forEach((x) => (x.count = 248610)) // Medcase (Rubles)
				therapist.assort.barter_scheme["63d385d7b3eba6c95d0f0384"][0].forEach((x) => (x.count /= 10)) // LEDX (Dogtags) // Really BSG? 160 kills for a non-FIR item? REALLY?!
				peacekeeper.assort.barter_scheme["63d385cab3eba6c95d0eff5f"][0].forEach((x) => (x.count = x.count / 5 + 1)) // THICC case (SMT+Bluefolder)

				skier.assort.barter_scheme["63d385b7b3eba6c95d0eef5c"][0].forEach((x) => (x.count = 4)) // Weapon case (Moonshine)

				mechanic.assort.barter_scheme["63d385bfb3eba6c95d0ef4d1"][0].forEach((x) => (x.count = 5)) // Weapon case (Bitcoins)
				mechanic.assort.barter_scheme["63d385c0b3eba6c95d0ef5d8"][0].forEach((x) => (x.count = 10)) // THICC Weapon case (Bitcoins)
			}
		}

		if (config.CraftingRebalance.enabled == true) {
			// Crafts:
			// This here, is some dumb stuff, I should've created some special class, controller, pushed the data out of the code or some other OOP bullcrap, but I'm not a programmer, so this will have to suffice. Sorry, not sorry.

			// 2x Clin production buff
			getCraft("59e358a886f7741776641ac3").count = 2

			// 2x Paracord production buff
			getCraft("5c12688486f77426843c7d32").count = 2

			// Water filter < 2 airfilter craft buff
			getCraft("5d1b385e86f774252167b98a").requirements.find((x) => x.templateId == "590c595c86f7747884343ad7").count = 2

			// Toilet paper production nerf lol. Who would have thought this craft would be OP, huh?
			getCraft("5c13cef886f774072e618e82").count = 1

			// EWR buff
			getCraft("60098b1705871270cd5352a1").count = 3

			// Buff MULE
			getCraft("5ed51652f6c34d2cc26336a1").count = 2

			// AFAK buff
			getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "590c678286f77426c9660122").count = 1
			getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "5751a25924597722c463c472").templateId = "5e8488fa988a8701445df1e4"

			// Portable defibrillator big nerf (Portable Powerbank 1 -> 4). Lore-friendly and still profitable, just not as ridiculous.
			getCraft("5c052e6986f7746b207bc3c9").requirements.find((x) => x.templateId == "5af0561e86f7745f5f3ad6ac").count = 4

			// LEDX buff (Huge buff, 1 of each component only). Now it is actually only sometimes bother to craft it.
			getCraft("5c0530ee86f774697952d952").requirements.forEach((x) => {
				if (x.count) {
					x.count = 1
				}
			})

			// Virtex buff (Military circuit board 2 -> 1)
			getCraft("5c05308086f7746b2101e90b").requirements.find((x) => x.templateId == "5d0376a486f7747d8050965c").count = 1

			// Military circuit board buff (1 -> 2)
			getCraft("5d0376a486f7747d8050965c").count = 2

			// Military flash drive lore-based change (2 Secure Flash drive -> 1 VPX, and Topographic survey maps 2 -> 1).
			// Not "profitable", but will change Intel folder craft to compensate, and allow it to be crafted on level 2.
			getCraft("62a0a16d0b9d3c46de5b6e97").requirements.forEach((x) => {
				if (x.count) {
					x.count = 1
				}
			})
			getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.type == "Area").requiredLevel = 2

			getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.templateId == "590c621186f774138d11ea29").templateId = "5c05300686f7746dce784e5d"

			// Intelligence folder buff (Military flash drive 2 -> 1)
			getCraft("5c12613b86f7743bbe2c3f76").requirements.find((x) => x.templateId == "62a0a16d0b9d3c46de5b6e97").count = 1

			// VPX buff (RAM and Broken GPhone smartphone 3 -> 2)
			getCraft("5c05300686f7746dce784e5d").requirements.forEach((x) => {
				if (x.count) {
					x.count = 2
				}
			})

			// FLIR huge buff (everything is 1, plus change SAS drive (wtf?!) to Armasight Vulcan MG 3.5x Bravo night vision scope)
			getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.forEach((x) => {
				if (x.count) {
					x.count = 1
				}
			})
			getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.find((x) => x.templateId == "590c37d286f77443be3d7827").templateId = "5b3b6e495acfc4330140bd88"

			// CMS nerf (Medical tools 1 -> 2)
			getCraft("5d02778e86f774203e7dedbe").requirements.find((x) => x.templateId == "619cc01e0a7c3a1a2731940c").count = 2

			// GRIzZLY nerf (1 -> 2)
			getCraft("590c657e86f77412b013051d").count = 1

			// coffee buff (2 -> 3)
			getCraft("5af0484c86f7740f02001f7f").count = 3

			// MPPV buff (KEKTAPE duct tape 2 -> 1)
			getCraft("5df8a42886f77412640e2e75").requirements.find((x) => x.templateId == "5e2af29386f7746d4159f077").count = 1

			// bottled water buff water (8 -> 16)
			getCraft("5448fee04bdc2dbc018b4567").count = 16

			// Topographic survey maps buff (1 -> 2)
			getCraft("62a0a124de7ac81993580542").count = 2

			// Aquamari buff (3 -> 5)
			getCraft("5c0fa877d174af02a012e1cf").count = 5

			// SJ6 buff (2 -> 3)
			getCraft("5c0e531d86f7747fa23f4d42").count = 3

			// GPU buff (3 VPX -> 1 Virtex, 10 PCB -> 1, 10 CPU -> 1)
			getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").count = 1
			getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").templateId = "5c05308086f7746b2101e90b"
			getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "573477e124597737dd42e191").count = 1
			getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "590a3b0486f7743954552bdb").count = 1

			// UHF RFID Reader huge buff (only Broken GPhone X smartphone + Signal Jammer)
			getCraft("5c052fb986f7746b2101e909").requirements = [
				{
					areaType: 11,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: "5c1265fc86f7743f896a21c2",
					count: 1,
					isFunctional: false,
					type: "Item",
				},
				{
					templateId: "5ac78a9b86f7741cca0bbd8d",
					count: 1,
					isFunctional: false,
					type: "Item",
				},
				{
					templateId: "5d4042a986f7743185265463",
					type: "Tool",
				},
				{
					templateId: "5d63d33b86f7746ea9275524",
					type: "Tool",
				},
			]
			// */
		}

		if (config.AdditionalCraftingRecipes.enabled == true) {
			// 63da4dbee8fa73e225000001
			// 63da4dbee8fa73e225000002
			// 63da4dbee8fa73e225000003
			// 63da4dbee8fa73e225000004
			// 63da4dbee8fa73e225000005
			// 63da4dbee8fa73e225000006
			// 63da4dbee8fa73e225000007
			// 63da4dbee8fa73e225000008
			// 63da4dbee8fa73e225000009
			// 63da4dbee8fa73e22500000a

			const Ophthalmoscope = {
				_id: "63da4dbee8fa73e225000001",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 3, type: "Area" },
					{
						templateId: "5e2aedd986f7746d404f3aa4",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "619cc01e0a7c3a1a2731940c",
						count: 2,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "57d17c5e2459775a5c57d17d",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5b4391a586f7745321235ab2",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "57347c1124597737fb1379e3",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 105,
				boosters: null,
				endProduct: "5af0534a86f7743b6f354284",
				continuous: false,
				count: 1,
				productionLimitCount: 0,
			}
			const Zagustin = {
				_id: "63da4dbee8fa73e225000002",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 3, type: "Area" },
					{
						templateId: "5c0e530286f7747fa1419862",
						count: 2,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5e8488fa988a8701445df1e4",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5ed515f6915ec335206e4152",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 105,
				boosters: null,
				endProduct: "5c0e533786f7747fa23f4d47",
				continuous: false,
				count: 3,
				productionLimitCount: 0,
			}
			const Obdolbos = {
				// Did you always want to run your own meth lab in Tarkov? Now you can.
				_id: "63da4dbee8fa73e225000003",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 3, type: "Area" },
					{
						templateId: "5c0e531286f7747fa54205c2",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5b43575a86f77424f443fe62",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5e2af00086f7746d3f3c33f7",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "62a09f32621468534a797acb",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d40407c86f774318526545a",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d403f9186f7743cac3f229b",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d1b376e86f774252519444e",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d1b2f3f86f774252167a52c",
						type: "Tool",
					},
				],
				productionTime: 564,
				boosters: null,
				endProduct: "5ed5166ad380ab312177c100",
				continuous: false,
				count: 8,
				productionLimitCount: 0,
			}
			const CALOK = {
				_id: "63da4dbee8fa73e225000004",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 2, type: "Area" },
					{
						templateId: "5751a25924597722c463c472",
						count: 2,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5755383e24597772cb798966",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 48,
				boosters: null,
				endProduct: "5e8488fa988a8701445df1e4",
				continuous: false,
				count: 2,
				productionLimitCount: 0,
			}
			const Adrenaline = {
				_id: "63da4dbee8fa73e225000005",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 2, type: "Area" },
					{
						templateId: "5751496424597720a27126da",
						count: 3,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5755356824597772cb798962",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 23,
				boosters: null,
				endProduct: "5c10c8fd86f7743d7d706df3",
				continuous: false,
				count: 1,
				productionLimitCount: 0,
			}
			const ThreebTG = {
				_id: "63da4dbee8fa73e225000006",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 3, type: "Area" },
					{
						templateId: "5c10c8fd86f7743d7d706df3",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "59e361e886f774176c10a2a5",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "57505f6224597709a92585a9",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 31,
				boosters: null,
				endProduct: "5ed515c8d380ab312177c0fa",
				continuous: false,
				count: 2,
				productionLimitCount: 0,
			}
			const AHF1 = {
				_id: "63da4dbee8fa73e225000007",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 2, type: "Area" },
					{
						templateId: "590c695186f7741e566b64a2",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "544fb3f34bdc2d03748b456a",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 47,
				boosters: null,
				endProduct: "5ed515f6915ec335206e4152",
				continuous: false,
				count: 1,
				productionLimitCount: 0,
			}
			const OLOLO = {
				_id: "63da4dbee8fa73e225000008",

				areaType: 8,
				requirements: [
					{ areaType: 8, requiredLevel: 3, type: "Area" },
					{
						templateId: "57513f9324597720a7128161",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "57513fcc24597720a31c09a6",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "57513f07245977207e26a311",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "575062b524597720a31c09a1",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "544fb62a4bdc2dfb738b4568",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "544fb37f4bdc2dee738b4567",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5d1b385e86f774252167b98a",
						type: "Tool",
					},
					{
						templateId: "590de71386f774347051a052",
						type: "Tool",
					},
				],
				productionTime: 71,
				boosters: null,
				endProduct: "62a0a043cf4a99369e2624a5",
				continuous: false,
				count: 3,
				productionLimitCount: 0,
			}
			const L1 = {
				_id: "63da4dbee8fa73e225000009",

				areaType: 7,
				requirements: [
					{ areaType: 7, requiredLevel: 3, type: "Area" },
					{
						templateId: "5c10c8fd86f7743d7d706df3",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
					{
						templateId: "5c0e531d86f7747fa23f4d42",
						count: 1,
						isFunctional: false,
						type: "Item",
					},
				],
				productionTime: 71,
				boosters: null,
				endProduct: "5ed515e03a40a50460332579",
				continuous: false,
				count: 1,
				productionLimitCount: 0,
			}

			tables.hideout.production.push(ThreebTG, Adrenaline, L1, AHF1, CALOK, Ophthalmoscope, Zagustin, Obdolbos, OLOLO)
		}

		const cases = [
			"5aafbde786f774389d0cbc0f", // Ammunition case
			"5e2af55f86f7746d4159f07c", // Grenade case
			"5c0a840b86f7742ffa4f2482", // T H I C C item case
			"5b7c710788a4506dec015957", // Lucky Scav Junk box
			"5c127c4486f7745625356c13", // Magazine case
			"5aafbcd986f7745e590fff23", // Medicine case
			"59fb016586f7746d0d4b423a", // Money case
			"5c093e3486f77430cb02e593", // Dogtag case
			"59fb042886f7746c5005a7b2", // Item case
			"59fb023c86f7746d0d4b423c", // Weapon case
			"5b6d9ce188a4501afc1b2b25", // T H I C C Weapon case
			"5c093db286f7740a1b2617e3", // Mr. Holodilnick thermal bag
			"60b0f6c058e0b0481a09ad11", // WZ Wallet
			"619cbf9e0a7c3a1a2731940a", // Keycard holder case
			"619cbf7d23893217ec30b689", // Injector case
			"59fafd4b86f7745ca07e1232", // Key tool
			"62a09d3bcf4a99369e262447", // Gingy keychain
			"5d235bb686f77443f4331278", // S I C C organizational pouch
			"590c60fc86f77412b13fddcf", // Documents case
		]

		// if (config.OtherTweaks.CollectorQuestEarlyStart.enabled == true) {
		// WIP, waiting for SPT to update
		// 	// Object.values()
		// 	tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForFinish.push(
		// 		tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForStart[0]
		// 	)
		// 	tables.templates.quests["5c51aac186f77432ea65c552"].conditions.AvailableForStart = [
		// 		{
		// 			_parent: "Level",
		// 			_props: {
		// 				id: "51d33b2d4fad9e61441772c0",
		// 				index: 1,
		// 				parentId: "",
		// 				dynamicLocale: false,
		// 				value: 1,
		// 				compareMethod: ">=",
		// 				visibilityConditions: [],
		// 			},
		// 			dynamicLocale: false,
		// 		},
		// 	]
		// }

		function getCraft(endProductID) {
			try {
				return tables.hideout.production.find((x) => x.endProduct == endProductID && x.areaType != 21)
			} catch (error) {
				logger.warning(`getCraft function threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`)
				log(endProductID)
				log(error)
			}
		}

		function getItemInHandbook(itemID) {
			try {
				return handbook.Items.find((i) => i.Id === itemID) // Outs: @Id, @ParentId, @Price
			} catch (error) {
				logger.warning(`getItemInHandbook function threw an error bacause of the other mod. Ignore this error safely and continue. Send bug report.`)
				log(itemID)
				log(error)
			}
		}

		function getItemName(itemID, locale = "en") {
			if (locales[locale][`${itemID} Name`] != undefined) {
				// return items[itemID]._name
				return locales[locale][`${itemID} Name`]
			} else {
				return items[itemID]?._name
			}
		}

		function sort(a, b) {
			if (a > b) {
				return 1
			}
			if (a < b) {
				return -1
			}
			return 0
		}
	}
}

const log = (i: any) => {
	console.log(i)
}

module.exports = { mod: new Mod() }
