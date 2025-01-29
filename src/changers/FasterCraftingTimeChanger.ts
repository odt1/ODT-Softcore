import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { FasterCraftingTime } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { IHideoutConfig } from "@spt/models/spt/config/IHideoutConfig"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { PrefixLogger } from "../util/PrefixLogger"

export class FasterCraftingTimeChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private hideoutConfig: IHideoutConfig

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.tables = databaseServer.getTables()
		this.hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
	}

	public apply(config: FasterCraftingTime) {
		if (!config.enabled) {
			return
		}

		try {
			this.doFasterProductionForAll(config.baseCraftingTimeMultiplier)
		} catch (error) {
			this.logger.warning("FasterCraftingTime: doFasterProductionForAll failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.hideoutSkillExpFix.enabled) {
				this.doHideoutSkillExpFix(config.hideoutSkillExpFix.hideoutSkillExpMultiplier)
			}
		} catch (error) {
			this.logger.warning("FasterCraftingTime: doHideoutSkillExpFix failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterMoonshineProduction.enabled) {
				this.doFasterProductionFor(ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE, config.fasterMoonshineProduction.baseCraftingTimeMultiplier)
			}
		} catch (error) {
			this.logger.warning(
				"FasterCraftingTime: doFasterProductionFor DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE failed gracefully. Send bug report. Continue safely."
			)
			console.warn(error)
		}

		try {
			if (config.fasterPurifiedWaterProduction.enabled) {
				this.doFasterProductionFor(ItemTpl.DRINK_CANISTER_WITH_PURIFIED_WATER, config.fasterPurifiedWaterProduction.baseCraftingTimeMultiplier)
			}
		} catch (error) {
			this.logger.warning("FasterCraftingTime: doFasterProductionFor DRINK_CANISTER_WITH_PURIFIED_WATER failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.fasterCultistCircle.enabled) {
				this.doFasterCultistCircle(config.fasterCultistCircle.baseCraftingTimeMultiplier)
			}
		} catch (error) {
			this.logger.warning("FasterCraftingTime: doFasterCultistCircle DRINK_CANISTER_WITH_PURIFIED_WATER failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doFasterProductionFor(itemTpl: ItemTpl, multiplier: number) {
		const hideout = this.tables.hideout
		if (!hideout) {
			this.logger.warning("FasterCraftingTime: doFasterProductionFor: hideout not found, skipping")
			return
		}

		const productionsForItem = hideout.production.recipes.filter((prod) => prod.endProduct === itemTpl)
		if (!productionsForItem) {
			this.logger.warning(`FasterCraftingTime: doFasterProduction: productions for item ${itemTpl} not found, skipping`)
			return
		}
		for (const production of productionsForItem) {
			production.productionTime = Math.round(production.productionTime / multiplier)
		}
	}

	private doFasterProductionForAll(multiplier: number) {
		const exclude = [
			ItemTpl.BARTER_PHYSICAL_BITCOIN,
			ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE,
			ItemTpl.DRINK_CANISTER_WITH_PURIFIED_WATER,
		] as string[]
		const hideout = this.tables.hideout

		for (const production of hideout!.production.recipes) {
			if (!exclude.includes(production.endProduct)) {
				production.productionTime = Math.round(production.productionTime / multiplier) + 1
			}
		}
	}

	private doHideoutSkillExpFix(multiplier: number) {
		this.hideoutConfig.hoursForSkillCrafting /= multiplier
	}

	private doFasterCultistCircle(multiplier: number) {
		this.hideoutConfig.cultistCircle.hideoutTaskRewardTimeSeconds = Math.round(this.hideoutConfig.cultistCircle.hideoutTaskRewardTimeSeconds / multiplier)

		for (const craft of this.hideoutConfig.cultistCircle.craftTimeThreshholds) {
			craft.craftTimeSeconds = Math.round(craft.craftTimeSeconds / multiplier)
		}

		for (const craft of this.hideoutConfig.cultistCircle.directRewards) {
			craft.craftTimeSeconds = Math.round(craft.craftTimeSeconds / multiplier)
			/*
			console.log(
				`${craft.repeatable ? "Repeatable " : ""}Reward: ${craft.reward.map(
					(x) => this.tables.locales?.global.en[`${x} Name`]
				)} <== Required Items: ${craft.requiredItems.map((x) => this.tables.locales?.global.en[`${x} Name`])}`
			)

			Reward: Secure container Gamma <== Required Items: Secure container Gamma
			Reward: Secure container Kappa <== Required Items: Secure container Theta
			Reward: Cultist figurine <== Required Items: Spooky skull mask
			Reward: Cultist knife <== Required Items: Spooky skull mask,Spooky skull mask,Spooky skull mask,Spooky skull mask,Spooky skull mask
			Reward: Maska-1SCh bulletproof helmet (Killa Edition) <== Required Items: Killa figurine
			Reward: Tagilla's welding mask "Gorilla",Tagilla's welding mask "UBEY" <== Required Items: Tagilla figurine
			Reward: TT-33 7.62x25 TT pistol (Golden) <== Required Items: Reshala figurine
			Reward: Baddie's red beard,Deadlyslob's beard oil <== Required Items: Den figurine
			Reward: Bottle of Tarkovskaya vodka,Bottle of Tarkovskaya vodka,Bottle of Tarkovskaya vodka <== Required Items: Politician Mutkevich figurine
			Reward: Scav Vest,Scav backpack <== Required Items: Scav figurine
			Reward: Obdolbos 2 cocktail injector,Pack of sugar <== Required Items: Ryzhy figurine
			Reward: Grizzly medical kit <== Required Items: BEAR operative figurine
			Reward: HighCom Trooper TFO body armor (MultiCam) <== Required Items: USEC operative figurine
			Repeatable Reward: Bottle of Fierce Hatchling moonshine <== Required Items: Relaxation room key
			Repeatable Reward: Axel parrot figurine <== Required Items: Dundukk sport sunglasses
			Repeatable Reward: Awl <== Required Items: Soap
			Repeatable Reward: Light bulb,Light bulb <== Required Items: Zarya stun grenade
			Repeatable Reward: GreenBat lithium battery,GreenBat lithium battery,Tetriz portable game console,Tetriz portable game console <== Required Items: Physical Bitcoin
			Repeatable Reward: TerraGroup "Blue Folders" materials <== Required Items: LEDX Skin Transilluminator 
			*/
		}
	}
}
