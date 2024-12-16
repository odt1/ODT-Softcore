import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DependencyContainer } from "tsyringe";
import type { SecureContainerOptions } from "../types";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { Traders } from "@spt/models/enums/Traders";
import { AssortHelper } from "@spt/helpers/AssortHelper";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { containerRecipes } from "src/recipes/recipes";

export class SecureContainerOptionsChanger {
    private container: DependencyContainer;
    private logger: ILogger;
    private databaseServer: DatabaseServer;
    private tables: IDatabaseTables;
    private items: Record<string, ITemplateItem> | undefined;

    constructor(container: DependencyContainer) {
        this.container = container;
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.tables = this.databaseServer.getTables();
        this.items = this.tables.templates?.items;
    }

    public apply(config: SecureContainerOptions) {
        if (!config.enabled) {
            return;
        }
        if (config.progressiveContainers.enabled) {
            this.doProgressiveContainers();
            if (config.progressiveContainers.collectorQuestRedone) {
                this.doCollectorQuestRedone();
            }
        }
        if (config.biggerContainers) {
            this.doBiggerContainers();
        }
    }

    private doProgressiveContainers() {
        const profileTemplates = this.tables.templates?.profiles;
        if (!profileTemplates) {
            this.logger.warning("SecureContainerOptions: doProgressiveContainers: profileTemplates not found");
            return;
        }
        for (const profileName of Object.keys(profileTemplates)) {
            const profile = profileTemplates[profileName];
            const bearContainer = profile.bear.character.Inventory.items.find((x) => x.slotId === "SecuredContainer");
            if (bearContainer) {
                bearContainer._tpl = ItemTpl.SECURE_WAIST_POUCH;
            }
            const usecContainer = profile.usec.character.Inventory.items.find((x) => x.slotId === "SecuredContainer");
            if (usecContainer) {
                usecContainer._tpl = ItemTpl.SECURE_WAIST_POUCH;
            }
        }

        const peacekeeper = this.tables.traders?.[Traders.PEACEKEEPER];
        if (peacekeeper?.assort?.barter_scheme) {
            // Remove Beta container from Peacekeeper
            const assortHelper = this.container.resolve<AssortHelper>("AssortHelper");
            assortHelper.removeItemFromAssort(peacekeeper.assort, ItemTpl.SECURE_CONTAINER_BETA);
        }

        // Custom Secure Container recipes
        if (this.tables.hideout?.production) {
            this.tables.hideout.production.recipes.push(...containerRecipes);
        }
    }

    private doCollectorQuestRedone() {
        const quests = this.tables.templates?.quests;
        if (!quests) {
            this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: quests table not found");
            return;
        }
        const collectorID = Object.keys(quests).find((key) => {
            return quests[key].QuestName === "Collector";
        });

        if (!collectorID) {
            this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: Collector questID");
            return;
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
        });

        if (!this.tables.locales) {
            this.logger.warning("SecureContainerOptions: doCollectorQuestRedone: locales not found");
            return;
        }
        this.tables.locales.global.ru["639135534b15ca31f76bc319"] = "Передать носитель"; // Тут нужен только фикс для русского, для всех остальных языков звучит как "Hand over the storage device"
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
        ];
    }

    private doBiggerContainers() {
        this.modifyContainer(ItemTpl.SECURE_WAIST_POUCH, 2, 4);
        this.modifyContainer(ItemTpl.SECURE_CONTAINER_ALPHA, 3, 3);
        this.modifyContainer(ItemTpl.SECURE_CONTAINER_BETA, 3, 4);
        this.modifyContainer(ItemTpl.SECURE_CONTAINER_EPSILON, 3, 5);
        this.modifyContainer(ItemTpl.SECURE_CONTAINER_GAMMA, 4, 5);
        this.modifyContainer(ItemTpl.SECURE_CONTAINER_KAPPA, 5, 5);
    }

    private modifyContainer(itemTpl: string, cellsV: number, cellsH: number) {
        if (!this.items) {
            this.logger.error("Softcore: SecureContainerOptions: items table not found");
            return;
        }
        if (this.items[itemTpl]?._props.Grids?.[0]._props) {
            this.items[itemTpl]._props.Grids[0]._props.cellsV = cellsV;
            this.items[itemTpl]._props.Grids[0]._props.cellsH = cellsH;
        } else {
            this.logger.warning(`Softcore: modifyContainer: Failed to modify container with Tpl ${itemTpl}, skipping`);
        }
    }
}
