import { DependencyContainer } from "tsyringe"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { StashOptions } from "../types"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { HideoutAreas } from "@spt/models/enums/HideoutAreas"
import { Money } from "@spt/models/enums/Money"
import { IProfileSides } from "@spt/models/eft/common/tables/IProfileTemplate"
import { PrefixLogger } from "../util/PrefixLogger"

export class StashOptionsChanger {
	private logger: PrefixLogger
	private databaseServer: DatabaseServer
	private tables: IDatabaseTables
	private items: Record<string, ITemplateItem> | undefined

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = this.databaseServer.getTables()
		this.items = this.tables.templates?.items
	}

	public apply(config: StashOptions) {
		if (!config.enabled) {
			return
		}
		if (config.progressiveStash) {
			this.doProgressiveStash()
		}
		if (config.biggerStash) {
			this.doBiggerStash()
		}
		if (config.lessCurrencyForConstruction) {
			this.doLessCurrencyForConstruction()
		}
		if (config.easierLoyalty) {
			this.doEasierLoyalty()
		}
	}

	private doProgressiveStash() {
		const profileTemplates = this.tables.templates?.profiles
		if (!profileTemplates) {
			this.logger.warning("SecureContainerOptions: doProgressiveStash: profileTemplates not found")
			return
		}
		const basicStashBonuses = [
			{
				id: "64f5b9e5fa34f11b380756c0",
				templateId: ItemTpl.STASH_STANDARD_STASH_10X30,
				type: "StashSize",
			},
		]
		const startingStashes = [
			ItemTpl.STASH_STANDARD_STASH_10X30,
			ItemTpl.STASH_LEFT_BEHIND_STASH_10X40,
			ItemTpl.STASH_PREPARE_FOR_ESCAPE_STASH_10X50,
			ItemTpl.STASH_EDGE_OF_DARKNESS_STASH_10X68,
			ItemTpl.STASH_THE_UNHEARD_EDITION_STASH_10X72,
		]

		for (const [profile, _] of Object.entries(profileTemplates)) {
			for (const sidekey of Object.keys(_) as (keyof IProfileSides)[]) {
				if (sidekey === "descriptionLocaleKey") {
					continue
				}
				const side = profileTemplates[profile][sidekey]
				const hideoutArea = side.character.Hideout?.Areas.find((area) => area.type === HideoutAreas.STASH)
				if (!hideoutArea) {
					this.logger.warning(`HideoutOptionsChanger: doProgressiveStash: hideoutArea for profile ${_} not found`)
					continue
				}
				hideoutArea.level = 1

				const startingStashItems = side.character.Inventory.items.filter((item) => startingStashes.includes(item._tpl))
				for (const item of startingStashItems) {
					item._tpl = ItemTpl.STASH_STANDARD_STASH_10X30
				}

				side.character.Bonuses = basicStashBonuses
			}
		}
	}

	private doBiggerStash() {
		if (!this.items) {
			this.logger.warning("HideoutOptions: doBiggerStash: items table not found")
			return
		}
		const stashUpdates: Record<string, number> = {
			[ItemTpl.STASH_STANDARD_STASH_10X30]: 50,
			[ItemTpl.STASH_LEFT_BEHIND_STASH_10X40]: 100,
			[ItemTpl.STASH_PREPARE_FOR_ESCAPE_STASH_10X50]: 150,
			[ItemTpl.STASH_EDGE_OF_DARKNESS_STASH_10X68]: 200,
			[ItemTpl.STASH_THE_UNHEARD_EDITION_STASH_10X72]: 250,
		}

		for (const [itemTpl, stashSize] of Object.entries(stashUpdates)) {
			const stashItem = this.items[itemTpl]
			if (stashItem?._props?.Grids?.[0]?._props) {
				stashItem._props.Grids[0]._props.cellsV = stashSize
			} else {
				this.logger.warning(`HideoutOptions: doBiggerStash: Failed to modify stash with Tpl ${itemTpl}, skipping`)
			}
		}
	}

	private doLessCurrencyForConstruction() {
		const hideoutStashStages = this.tables.hideout?.areas.find((area) => area.type === HideoutAreas.STASH)?.stages
		if (!hideoutStashStages) {
			this.logger.warning("HideoutOptions: doLessCurrencyForConstruction: hideoutStashStages not found")
			return
		}
		for (const [_, stage] of Object.entries(hideoutStashStages)) {
			const currencyRequirements = stage.requirements.filter((req) => req.templateId === Money.ROUBLES || req.templateId === Money.EUROS)
			for (const currencyRequirement of currencyRequirements) {
				if (currencyRequirement.count) {
					currencyRequirement.count /= 10
				}
			}
		}
	}

	private doEasierLoyalty() {
		const hideoutStashStages = this.tables.hideout?.areas.find((area) => area.type === HideoutAreas.STASH)?.stages
		if (!hideoutStashStages) {
			this.logger.warning("HideoutOptions: doEasierLoyalty: hideoutStashStages not found")
			return
		}
		for (const [_, stage] of Object.entries(hideoutStashStages)) {
			const loyaltylevels = stage.requirements.filter((req) => req.loyaltyLevel !== undefined)
			for (const loyaltyLevel of loyaltylevels) {
				if (loyaltyLevel.loyaltyLevel !== undefined) {
					loyaltyLevel.loyaltyLevel -= 1
				}
			}
		}
	}
}
