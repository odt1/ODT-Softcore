import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { TraderChanges } from "src/types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { Traders } from "@spt/models/enums/Traders";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { fleaBarterRequestBlacklist } from "src/assets/fleamarket";

export class TraderChangesChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private traderConfig: ITraderConfig;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
    }

    public apply(config: TraderChanges) {
        if (!config.enabled) {
            return;
        }

        if (config.betterSalesToTraders) {
            this.doBetterSalesToTraders();
        }

        if (config.alternativeCategories) {
            this.doAlternativeCategories();
        }

        if (config.pacifistFence.enabled) {
            this.doPacifistFence(config.pacifistFence.numberOfFenceOffers);
        }

        if (config.reasonablyPricedCases) {
            this.doReasonablyPricedCases();
        }

        if (config.skierUsesEuros) {
            this.doSkierUsesEuros();
        }

        if (config.biggerLimits.enabled) {
            this.doBiggerLimits(config.biggerLimits.multiplier);
        }
    }

    private doBetterSalesToTraders() {
        const traderList = this.tables.traders;
        if (!traderList) {
            this.logger.warning("TraderChangesChanger: doBetterSalesToTraders: Trader list not found, skipping");
            return;
        }

        const buyPriceAdjustment = {
            [Traders.PEACEKEEPER]: 7,
            [Traders.SKIER]: 6,
            [Traders.PRAPOR]: 5,
            [Traders.MECHANIC]: 4,
            [Traders.JAEGER]: 3,
            [Traders.RAGMAN]: 2,
            [Traders.THERAPIST]: 1,
        };

        for (const [traderID, trader] of Object.entries(traderList)) {
            trader.base.loyaltyLevels[0].buy_price_coef = 35;
            trader.base.loyaltyLevels[1].buy_price_coef = 30;
            trader.base.loyaltyLevels[2].buy_price_coef = 25;
            trader.base.loyaltyLevels[3].buy_price_coef = 20;

            for (const loyaltyLevel of trader.base.loyaltyLevels) {
                loyaltyLevel.buy_price_coef += buyPriceAdjustment[traderID];
            }
        }
    }

    private doAlternativeCategories() {
        const traderList = this.tables.traders;
        if (!traderList) {
            this.logger.warning("TraderChangesChanger: doAlternativeCategories: Trader list not found, skipping");
            return;
        }
        traderList[Traders.THERAPIST].base.items_buy.category.push(
            ...[BaseClasses.MEDICAL_SUPPLIES, BaseClasses.HOUSEHOLD_GOODS],
        );
        traderList[Traders.THERAPIST].base.items_buy.category = traderList[
            Traders.THERAPIST
        ].base.items_buy.category.filter((baseclass) => baseclass !== BaseClasses.BARTER_ITEM);

        traderList[Traders.RAGMAN].base.items_buy.category.push(BaseClasses.JEWELRY);
        traderList[Traders.SKIER].base.items_buy.category.push(BaseClasses.INFO);
    }

    private doPacifistFence(numberOfFenceOffers: number) {
        const fenceConfig = this.traderConfig.fence;
        const fenceBlacklist = fenceConfig.blacklist;
        fenceBlacklist.push(...fleaBarterRequestBlacklist);

        fenceConfig.assortSize = numberOfFenceOffers;
        fenceConfig.blacklist = fenceBlacklist; //itemid or baseid
        fenceConfig.equipmentPresetMinMax.min = 0;
        fenceConfig.equipmentPresetMinMax.max = 0;
        fenceConfig.weaponPresetMinMax.min = 0;
        fenceConfig.weaponPresetMinMax.max = 0;
        fenceConfig.discountOptions.assortSize = numberOfFenceOffers * 2;
        fenceConfig.itemPriceMult = 1;
        fenceConfig.discountOptions.itemPriceMult = 0.82;
        fenceConfig.discountOptions.weaponPresetMinMax.min = 0;
        fenceConfig.discountOptions.weaponPresetMinMax.max = 0;
        fenceConfig.discountOptions.equipmentPresetMinMax.min = 0;
        fenceConfig.discountOptions.equipmentPresetMinMax.max = 0;
    }

    private doReasonablyPricedCases() {
        this.adjustTherapistBarters();
        this.adjustPeacekeeperBarters();
        this.adjustSkierBarters();
    }

    private adjustPeacekeeperBarters() {
        this.modifyTraderBarters(Traders.PEACEKEEPER, ItemTpl.CONTAINER_THICC_ITEM_CASE, {
            [ItemTpl.INFO_TERRAGROUP_BLUE_FOLDERS_MATERIALS]: (requirement) => {
                requirement.count = Math.round(requirement.count / 5) + 1;
            },
        });
    }

    private adjustSkierBarters() {
        this.modifyTraderBarters(Traders.SKIER, ItemTpl.CONTAINER_WEAPON_CASE, {
            [ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE]: (requirement) => {
                requirement.count = 4;
            },
        });
    }

    private adjustTherapistBarters() {
        this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_ITEM_CASE, {
            [ItemTpl.MONEY_EUROS]: (requirement) => {
                requirement.count = 7256; // Adjust price for Euros barter
            },
            [ItemTpl.BARTER_OPHTHALMOSCOPE]: (requirement) => {
                requirement.count = 8; // Adjust count for Ophthalmoscope barter
            },
            [ItemTpl.BARTER_DOGTAG_USEC]: (requirement) => {
                requirement.count = 20; // Adjust count for Dogtag barter
            },
        });

        this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_LUCKY_SCAV_JUNK_BOX, {
            [ItemTpl.MONEY_ROUBLES]: (requirement) => {
                requirement.count = 961138; // Adjust price for Roubles barter
            },
            [ItemTpl.BARTER_DOGTAG_USEC]: (requirement) => {
                requirement.count = 15; // Adjust count for Dogtag barter
            },
        });

        this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_MEDICINE_CASE, {
            [ItemTpl.MONEY_ROUBLES]: (requirement) => {
                requirement.count = 290610; // Adjust price for Medicine Case Roubles barter
            },
        });

        this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR, {
            [ItemTpl.MONEY_ROUBLES]: (requirement) => {
                requirement.count /= 10; // Scale down LEDX barter cost by 10
            },
        });
    }

    private modifyTraderBarters(
        trader: Traders,
        targetItemID: ItemTpl,
        adjustments: Record<string, (requirement) => void>,
    ) {
        const traderAssort = this.tables.traders?.[trader].assort;
        if (!traderAssort) {
            this.logger.warning(
                "TraderChangesChanger: modifyTraderBarters: Trader ${trader} assort not found, skipping",
            );
            return;
        }

        // Find barter IDs for the target template
        const barterIDs = Object.values(traderAssort.items).map((assortItem) => {
            if (assortItem._tpl === targetItemID) {
                return assortItem._id;
            }
        }) as string[];

        // Apply adjustments based on the requirement type
        for (const [adjustmentTpl, countAdjustment] of Object.entries(adjustments)) {
            for (const barterID of barterIDs) {
                const hasTargetTpl = traderAssort.barter_scheme[barterID].some((requirementSet) =>
                    requirementSet.some((req) => req._tpl === adjustmentTpl),
                );
                if (hasTargetTpl) {
                    // Adjust all requirements' counts in this barter
                    for (const requirement of traderAssort.barter_scheme[barterID][0]) {
                        countAdjustment(requirement);
                    }
                }
            }
        }
    }

    private doSkierUsesEuros() {
        const skier = this.tables.traders?.[Traders.SKIER];
        if (!skier) {
            this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Skier not found, skipping");
            return;
        }
        const handbookItems = this.tables.templates?.handbook.Items;
        if (!handbookItems) {
            this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Handbook not found, skipping");
            return;
        }
        const euroPrice = handbookItems.find((x) => x.Id === ItemTpl.MONEY_EUROS)?.Price;
        if (!euroPrice) {
            this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Euro price not found, skipping");
            return;
        }
        skier.base.currency = "EUR";
        skier.base.balance_eur = 700000;

        for (const loyaltyLevel of skier.base.loyaltyLevels) {
            loyaltyLevel.minSalesSum = Math.round(loyaltyLevel.minSalesSum / euroPrice);
        }

        const skierAssorts = skier.assort;
        if (!skierAssorts) {
            this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Skier assort not found, skipping");
            return;
        }
        for (const barter of Object.values(skierAssorts.barter_scheme)) {
            if (barter[0][0]._tpl === ItemTpl.MONEY_ROUBLES) {
                barter[0][0].count = Math.round(barter[0][0].count / euroPrice);
                barter[0][0]._tpl = ItemTpl.MONEY_EUROS;
            }
        }

        //Adjust SKier Quest Rewards
        const quests = this.tables.templates?.quests;
        if (!quests) {
            this.logger.warning("TraderChangesChanger: doSkierUsesEuros: Quests not found, skipping");
            return;
        }
        for (const quest of Object.values(quests)) {
            if (quest.traderId === Traders.SKIER) {
                const rewards = quest.rewards.Success;
                if (!rewards) {
                    this.logger.warning(
                        "TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} rewards not found, skipping",
                    );
                    continue;
                }
                for (const reward of rewards) {
                    if (reward.items) {
                        for (const item of reward.items) {
                            if (item._tpl === ItemTpl.MONEY_ROUBLES) {
                                item._tpl = ItemTpl.MONEY_EUROS;
                                const upd = item.upd;
                                if (!upd?.StackObjectsCount) {
                                    this.logger.warning(
                                        "TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} reward item: ${item._tpl} upd not found, skipping",
                                    );
                                    continue;
                                }
                                upd.StackObjectsCount = Math.round(upd.StackObjectsCount / euroPrice);
                            }
                        }
                    }
                }
            }
        }
    }

    private doBiggerLimits(multiplier: number) {
        for (const traderID of Object.values(Traders)) {
            const traderItems = this.tables.traders?.[traderID].assort?.items;
            if (!traderItems) {
                this.logger.warning("TraderChangesChanger: doBiggerLimits: traderItems not found, skipping");
                continue;
            }
            for(const item of traderItems){
                if(item.upd?.BuyRestrictionMax){
                    item.upd.BuyRestrictionMax *= multiplier;
                }
            }
        }
    }
}
