import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { TraderChanges } from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { Traders } from "@spt/models/enums/Traders";
import { BaseClasses } from "@spt/models/enums/BaseClasses";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { BSGblacklist, fleaBarterRequestWhitelist } from "../assets/fleamarket";
import { FenceService } from "@spt/services/FenceService";
import { FenceBaseAssortGenerator } from "@spt/generators/FenceBaseAssortGenerator";
export class TraderChangesChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private traderConfig: ITraderConfig;
    private fenceService: FenceService;
    private fenceBaseAssortGenerator: FenceBaseAssortGenerator;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        this.fenceService = container.resolve<FenceService>("FenceService");
        this.fenceBaseAssortGenerator = container.resolve<FenceBaseAssortGenerator>("FenceBaseAssortGenerator");
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
            let buyPriceCoef = 35;
            if(!Object.keys(buyPriceAdjustment).includes(traderID)){
                continue;
            }
            for (const loyaltyLevel of trader.base.loyaltyLevels) {
                loyaltyLevel.buy_price_coef = buyPriceCoef;
                loyaltyLevel.buy_price_coef += buyPriceAdjustment[traderID];
                buyPriceCoef -= 5
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
        // Fence uses multiple blacklists to generate items he can sell in SPT, these are: itemConfig.blacklist, itemconfig.rewardItemBlacklist, not a quest item, and the basetype is not blacklisted on traderconfig.fence.blacklist
        const fenceBlacklist = Object.values(BaseClasses).filter((baseClass) => !fleaBarterRequestWhitelist.includes(baseClass));

        this.traderConfig.fence.assortSize = numberOfFenceOffers;
        this.traderConfig.fence.blacklist = fenceBlacklist; //Only baseIDs
        this.traderConfig.fence.equipmentPresetMinMax.min = 0;
        this.traderConfig.fence.equipmentPresetMinMax.max = 0;
        this.traderConfig.fence.weaponPresetMinMax.min = 0;
        this.traderConfig.fence.weaponPresetMinMax.max = 0;
        this.traderConfig.fence.discountOptions.assortSize = numberOfFenceOffers * 2;
        this.traderConfig.fence.itemPriceMult = 1;
        this.traderConfig.fence.discountOptions.itemPriceMult = 0.82;
        this.traderConfig.fence.discountOptions.weaponPresetMinMax.min = 0;
        this.traderConfig.fence.discountOptions.weaponPresetMinMax.max = 0;
        this.traderConfig.fence.discountOptions.equipmentPresetMinMax.min = 0;
        this.traderConfig.fence.discountOptions.equipmentPresetMinMax.max = 0;
        this.fenceBaseAssortGenerator.generateFenceBaseAssorts();
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

        this.modifyTraderBarters(Traders.THERAPIST, ItemTpl.CONTAINER_THICC_ITEM_CASE, {
            [ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR]: (requirement) => {
                requirement.count = 5; // Scale down LEDX barter cost by 10
            },
            [ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE]: (requirement) => {
                requirement.count = 10; // Scale down LEDX barter cost by 10
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
                const hasTargetTpl = traderAssort.barter_scheme?.[barterID]?.some((requirementSet) =>
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
                barter[0][0].count = Math.ceil(barter[0][0].count / euroPrice);
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
                                if (!item.upd?.StackObjectsCount) {
                                    this.logger.warning(
                                        `TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} reward item: ${item._tpl} upd not found, skipping`,
                                    );
                                    continue;
                                }
                                item.upd.StackObjectsCount = Math.ceil(item.upd.StackObjectsCount / euroPrice);
                                if(!reward.value){
                                    this.logger.warning(
                                        `TraderChangesChanger: doSkierUsesEuros: Quest: ${quest._id} reward value not found, skipping`,
                                    );
                                    continue;
                                }
                                reward.value = Math.ceil(reward.value as number / euroPrice);
                            }
                        }
                    }
                }
            }
        }
    }

    private doBiggerLimits(multiplier: number) {
        for (const traderID of Object.values(Traders)) {
            if(traderID === Traders.LIGHTHOUSEKEEPER){
                continue;
            }
            const traderItems = this.tables.traders?.[traderID].assort?.items;
            if (!traderItems) {
                this.logger.warning(`TraderChangesChanger: doBiggerLimits: traderItems for trader ${traderID} not found, skipping`);
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
