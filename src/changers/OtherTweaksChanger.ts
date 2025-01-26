import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { OtherTweaks } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { PrefixLogger } from "../util/PrefixLogger"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { ItemType } from "@spt/models/eft/common/tables/ITemplateItem"
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem"
import { BaseClasses } from "@spt/models/enums/BaseClasses"

export class OtherTweaksChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private items: Record<string, ITemplateItem> | undefined

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = databaseServer.getTables()
		this.items = this.tables.templates?.items
	}

	public apply(config: OtherTweaks) {
		if (!config.enabled) {
			return
		}
		try {
			if (config.skillExpBuffs) {
				this.doSkillExpBuffs()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doSkillExpBuffs failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.signalPistolInSpecialSlots) {
				this.doSignalPistolInSpecialSlots()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doSignalPistolInSpecialSlots failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.unexaminedItemsAreBack) {
				this.doUnexaminedItemsAreBack()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doUnexaminedItemsAreBack failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterExamineTime) {
				this.doFasterExamineTime()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doFasterExamineTime failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.removeBackpackRestrictions) {
				this.doRemoveBackpackRestrictions()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doRemoveBackpackRestrictions failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.removeDiscardLimit) {
				this.doRemoveDiscardLimit()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doRemoveDiscardLimit failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.reshalaAlwaysHasGoldenTT) {
				this.doReshalaAlwaysHasGoldenTT()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doReshalaAlwaysHasGoldenTT failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.biggerAmmoStacks.enabled) {
				this.doBiggerAmmoStacks(config.biggerAmmoStacks.stackMultiplier)
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doBiggerAmmoStacks failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.questChanges) {
				this.doQuestChanges()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doQuestChanges failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.removeRaidItemLimits) {
				this.doRemoveRaidItemLimits()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doRemoveRaidItemLimits failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}		
		try {
			if (true) {
				this.doCurrencyStack()
			}
		} catch (error) {
			this.logger.warning("OtherTweaks: doCurrencyStack failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}
	private doSkillExpBuffs() {
		const globals = this.tables.globals
		if (!globals) {
			this.logger.warning("OtherTweaksChanger: adjustSkillExp: globals not found")
			return
		}
		globals.config.SkillsSettings.Vitality.DamageTakenAction *= 10
		globals.config.SkillsSettings.Sniper.WeaponShotAction *= 10
		globals.config.SkillsSettings.Surgery.SurgeryAction *= 10
		// biome-ignore lint/complexity/noForEach: Small array.
		Object.values(globals.config.SkillsSettings.MagDrills).forEach((x) => x * 10)
		globals.config.SkillsSettings.WeaponTreatment.SkillPointsPerRepair *= 100
	}

	doSignalPistolInSpecialSlots() {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doSignalPistolInSpecialSlots: items not found")
			return
		}
		// biome-ignore lint/complexity/noForEach: Makes it more readable.
		this.items[ItemTpl.POCKETS_1X4_SPECIAL]._props.Slots?.forEach((x) => x._props.filters[0].Filter.push(ItemTpl.SIGNALPISTOL_ZID_SP81_26X75_SIGNAL_PISTOL))
		this.items[ItemTpl.POCKETS_1X4_TUE]._props.Slots?.forEach((x) => x._props.filters[0].Filter.push(ItemTpl.SIGNALPISTOL_ZID_SP81_26X75_SIGNAL_PISTOL))
	}
	doUnexaminedItemsAreBack() {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doFasterExamineTime: items not found")
			return
		}
		for (const item of Object.values(this.items)) {
			if (
				item._parent === BaseClasses.BUILT_IN_INSERTS ||
				item._parent === BaseClasses.MAGAZINE ||
				item._parent === BaseClasses.CYLINDER_MAGAZINE ||
				item._parent === BaseClasses.ARMOR_PLATE
			) {
				continue
			}
			if (item._props.ExaminedByDefault) {
				item._props.ExaminedByDefault = false
			}
		}
	}
	doFasterExamineTime() {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doFasterExamineTime: items not found")
			return
		}
		for (const item of Object.values(this.items)) {
			if (item._props.ExamineTime) {
				item._props.ExamineTime = 0.2
			}
		}
	}
	doRemoveBackpackRestrictions() {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doBiggerAmmoStacks: items not found")
			return
		}
		for (const item of Object.values(this.items)) {
			if (item._type !== ItemType.ITEM) {
				continue
			}
			if (JSON.stringify(item).indexOf("ExcludedFilter") > -1) {
				const filtered = item._props?.Grids?.[0]?._props?.filters[0]?.ExcludedFilter
				if (filtered?.includes(ItemTpl.CONTAINER_AMMUNITION_CASE)) {
					if (item._props.Grids?.[0]._props.filters[0].ExcludedFilter) {
						item._props.Grids[0]._props.filters[0].ExcludedFilter = []
					}
				}
			}
		}
	}
	doRemoveDiscardLimit() {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doRemoveDiscardLimit: items not found")
			return
		}
		for (const item of Object.values(this.items)) {
			if (item._type === ItemType.ITEM) {
				item._props.DiscardLimit = -1
			}
		}
	}
	doReshalaAlwaysHasGoldenTT() {
		const reshala = this.tables.bots?.types.bossbully
		if (!reshala) {
			this.logger.warning("OtherTweaksChanger: doReshalaAlwaysHasGoldenTT: reshala not found")
			return
		}
		reshala.chances.equipment.Holster = 100
		reshala.inventory.equipment.Holster = { "5b3b713c5acfc4330140bd8d": 1 }
	}
	doBiggerAmmoStacks(stackMultiplier: number) {
		if (!this.items) {
			this.logger.warning("OtherTweaksChanger: doBiggerAmmoStacks: items not found")
			return
		}
		for (const item of Object.values(this.items)) {
			if (item._parent === BaseClasses.AMMO && item._props.StackMaxSize) {
				item._props.StackMaxSize *= stackMultiplier
			}
		}
	}
	doQuestChanges() {
		const crisis = this.tables.templates?.quests["60e71c48c1bfa3050473b8e5"]
		if (!crisis) {
			this.logger.warning("OtherTweaksChanger: doQuestChanges: Crisis not found")
			return
		}
		crisis.conditions.AvailableForStart[1].value = 30
	}
	doRemoveRaidItemLimits() {
		const globals = this.tables.globals
		if (!globals) {
			this.logger.warning("OtherTweaksChanger: doRemoveRaidItemLimits: globals not found")
			return
		}
		// globals.config.RestrictionsInRaid.forEach((x) => console.log(`${x.TemplateId}, // ${this.tables.locales?.global.en[`${x.TemplateId} Name`]}`))
		globals.config.RestrictionsInRaid = []
	}

	doCurrencyStack() {
		this.items["569668774bdc2da2298b4568"]._props.StackMaxSize = 100000
		this.items["5696686a4bdc2da3298b456a"]._props.StackMaxSize = 100000
		this.items["5d235b4d86f7742e017bc88a"]._props.StackMaxSize = 100
		this.items["5449016a4bdc2d6f028b456f"]._props.StackMaxSize = 1000000
	}
}
