import { DependencyContainer } from "tsyringe"
import type { SecureContainerOptions } from "../types"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem"
import { Traders } from "@spt/models/enums/Traders"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { containerRecipes } from "../assets/recipes"
import { PrefixLogger } from "../util/PrefixLogger"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { IHideoutConfig } from "@spt/models/spt/config/IHideoutConfig"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"

export class SecureContainerOptionsChanger {
	private logger: PrefixLogger
	private tables: IDatabaseTables
	private items: Record<string, ITemplateItem> | undefined
	private hideoutConfig: IHideoutConfig

	constructor(container: DependencyContainer) {
		this.logger = PrefixLogger.getInstance()
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = databaseServer.getTables()
		this.items = this.tables.templates?.items
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		this.hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
	}

	public apply(config: SecureContainerOptions) {
		if (!config.enabled) {
			return
		}

		try {
			if (config.progressiveContainers.enabled) {
				this.doProgressiveContainers()
				try {
					if (config.progressiveContainers.collectorQuestRedone) {
						this.doCollectorQuestRedone()
					}
				} catch (error) {
					this.logger.warning("SecureContainerOptions: doCollectorQuestRedone markedKeys Traders.PRAPOR failed gracefully. Send bug report. Continue safely.")
					console.warn(error)
				}
			}
		} catch (error) {
			this.logger.warning("SecureContainerOptions: doProgressiveContainers markedKeys Traders.PRAPOR failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}

		try {
			if (config.biggerContainers) {
				this.doBiggerContainers()
			}
		} catch (error) {
			this.logger.warning("SecureContainerOptions: doBiggerContainers markedKeys Traders.PRAPOR failed gracefully. Send bug report. Continue safely.")
			console.warn(error)
		}
	}

	private doProgressiveContainers() {
		const profileTemplates = this.tables.templates?.profiles
		if (!profileTemplates) {
			this.logger.warning("SecureContainerOptions: doProgressiveContainers: profileTemplates not found")
			return
		}
		for (const profileName of Object.keys(profileTemplates)) {
			const profile = profileTemplates[profileName]
			const bearContainer = profile.bear.character.Inventory.items.find((x) => x.slotId === "SecuredContainer")
			if (bearContainer) {
				bearContainer._tpl = ItemTpl.SECURE_WAIST_POUCH
			}
			const usecContainer = profile.usec.character.Inventory.items.find((x) => x.slotId === "SecuredContainer")
			if (usecContainer) {
				usecContainer._tpl = ItemTpl.SECURE_WAIST_POUCH
			}
		}

		const peacekeeper = this.tables.traders?.[Traders.PEACEKEEPER]
		if (peacekeeper?.assort?.items) {
			// "Remove" Beta container from Peacekeeper. Never Delete items from Assorts. This can lead to issues.
			const betaAssortUpd = peacekeeper.assort.items.find((item) => item._tpl === ItemTpl.SECURE_CONTAINER_BETA)?.upd
			if (betaAssortUpd) {
				betaAssortUpd.UnlimitedCount = false
				betaAssortUpd.StackObjectsCount = 0
				betaAssortUpd.BuyRestrictionMax = 0
			}
		}

		// Block cultistCircle Kappa reward for SECURE_WAIST_POUCH
		// this.hideoutConfig.cultistCircle.directRewards.find((x) => x.requiredItems)
		const reward = this.hideoutConfig.cultistCircle.directRewards.find((reward) => reward.requiredItems.includes("5732ee6a24597719ae0c0281"))
		if (reward) {
			const index = reward.requiredItems.indexOf("5732ee6a24597719ae0c0281")
			if (index !== -1) {
				reward.requiredItems[index] = "5c093ca986f7740a1867ab12"
			}
		}

		// Custom Secure Container recipes
		if (this.tables.hideout?.production) {
			this.tables.hideout.production.recipes.push(...containerRecipes)
		}
	}

	private doCollectorQuestRedone() {
		const quests = this.tables.templates?.quests
		if (!quests) {
			this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: quests table not found")
			return
		}
		const collectorID = Object.keys(quests).find((key) => {
			return quests[key].QuestName === "Collector"
		})

		if (!collectorID) {
			this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: Collector questID")
			return
		}
		quests[collectorID].conditions.AvailableForFinish.push({
			conditionType: "HandoverItem",
			dogtagLevel: 0,
			id: "639135534b15ca31f76bc319",
			index: 69, // nice
			maxDurability: 100,
			minDurability: 0,
			parentId: "5448bf274bdc2dfc2f8b456a",
			isEncoded: false,
			onlyFoundInRaid: false,
			dynamicLocale: false,
			target: [ItemTpl.SECURE_CONTAINER_GAMMA],
			value: 2,
			visibilityConditions: [],
		})

		if (!this.tables.locales) {
			this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: locales not found")
			return
		}
		this.tables.locales.global.ru["639135534b15ca31f76bc319"] = "Передать носитель" // Тут нужен только фикс для русского, для всех остальных языков звучит как "Hand over the storage device"
		// Start condition
		quests[collectorID].conditions.AvailableForStart = [
			{
				id: "51d33b2d4fad9e61441772c0",
				compareMethod: ">=",
				conditionType: "Level",
				dynamicLocale: false,
				globalQuestCounterId: "",
				index: 0,
				parentId: "",
				value: 10,
				visibilityConditions: [],
			},
		]
	}

	private doBiggerContainers() {
		this.modifyContainer(ItemTpl.SECURE_WAIST_POUCH, 2, 4)
		this.modifyContainer(ItemTpl.SECURE_CONTAINER_ALPHA, 3, 3)
		this.modifyContainer(ItemTpl.SECURE_CONTAINER_BETA, 3, 4)
		this.modifyContainer(ItemTpl.SECURE_CONTAINER_EPSILON, 3, 5)
		this.modifyContainer(ItemTpl.SECURE_CONTAINER_GAMMA, 4, 5)
		this.modifyContainer(ItemTpl.SECURE_CONTAINER_KAPPA, 5, 5)
	}

	private modifyContainer(itemTpl: string, cellsV: number, cellsH: number) {
		if (!this.items) {
			this.logger.error("Softcore: SecureContainerOptions: items table not found")
			return
		}
		if (this.items[itemTpl]?._props.Grids?.[0]._props) {
			this.items[itemTpl]._props.Grids[0]._props.cellsV = cellsV
			this.items[itemTpl]._props.Grids[0]._props.cellsH = cellsH
		} else {
			this.logger.warning(`Softcore: modifyContainer: Failed to modify container with Tpl ${itemTpl}, skipping`)
		}
	}
}
