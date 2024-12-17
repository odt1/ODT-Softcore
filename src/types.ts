export interface Configuration {
    general: General;
    secureContainersOptions: SecureContainerOptions;
    hideoutOptions: HideoutOptions;
    economyOptions: EconomyOptions;
    traderChanges: TraderChanges;
    craftingChanges: CraftingChanges;
    insuranceChanges: InsuranceChanges;
    otherTweaks: OtherTweaks;
}

export interface General {
    enabled: boolean;
    debug: boolean;
}

export interface SecureContainerOptions {
    enabled: boolean;
    progressiveContainers: ProgressiveContainers;
    biggerContainers: boolean;
}

export interface ProgressiveContainers {
    enabled: boolean;
    collectorQuestRedone: boolean;
}

export interface HideoutOptions {
    enabled: boolean;
    stashOptions: StashOptions;
    hideoutContainers: HideoutContainers;
    fasterBitcoinFarming: FasterbitcoinFarming;
    fasterCraftingTime: FasterCraftingTime;
    fasterHideoutConstruction: FasterHideoutConstruction;
    fuelConsumption: FuelConsumption;
    scavCaseOptions: ScavCaseOptions;
    allowGymTrainingWithMusclePain: boolean;
}

export interface StashOptions {
    enabled: boolean;
    progressiveStash: boolean;
    biggerStash: boolean;
    lessCurrencyForConstruction: boolean;
    easierLoyalty: boolean;
}

export interface HideoutContainers{
    enabled: boolean;
    biggerHideoutContainers: boolean;
    siccCaseBuff: boolean;
}   

export interface FasterbitcoinFarming {
    enabled: boolean;
    revertBitcoinPriceToV012: boolean;
    baseBitcoinTimeMultiplier: number;
    gpuEfficiency: number;
}

export interface FasterCraftingTime {
    enabled: boolean;
    baseCraftingTimeMultiplier: number;
    hideoutSkillExpFix: HideoutSkillExpFix;
    fasterMoonshineAndPurifiedWaterProduction: FasterMoonshineAndPurifiedWaterProduction;
}

export interface FasterMoonshineAndPurifiedWaterProduction {
    enabled: boolean;
    baseMoonshineAndWaterTimeMultiplier: number;
}

export interface HideoutSkillExpFix {
    enabled: boolean;
    hideoutSkillExpMultiplier: number;
}

export interface FasterHideoutConstruction {
    enabled: boolean;
    hideoutConstructionTimeMultiplier: number;
}

export interface FuelConsumption {
    enabled: boolean;
    fuelConsumptionMultiplier: number;
}

export interface ScavCaseOptions {
    enabled: boolean;
    betterRewards: boolean;
    fasterScavcase: FasterScavcase;
    rebalance: boolean;
}

export interface FasterScavcase {
    enabled: boolean;
    speedMultiplier: number;
}
export interface EconomyOptions {
    enabled: boolean;
    disableFleaMarketCompletely: boolean;
    priceRebalance: PriceRebalance;
    pacifistFleaMarket: PacifistFleaMarket;
    barterEconomy: BarterEconomy;
    otherFleaMarketChanges: OtherFleaMarketChanges;
}

export interface PriceRebalance {
    enabled: boolean;
    itemFixes: boolean;
}

export interface PacifistFleaMarket {
    enabled: boolean;
    whitelist: boolean;
    questKeys: QuestKeys;
    markedKeys: MarkedKeys;
}

export interface QuestKeys {
    enabled: boolean;
    priceMultiplier: number;
}

export interface MarkedKeys {
    enabled: boolean;
    priceMultiplier: number;
}

export interface BarterEconomy {
    enabled: boolean;
    cashOffersPerentage: number;
    barterPriceVariance: number;
    offerItemCount: { min: number; max: number };
    nonStackableCount: { min: number; max: number };
    itemCountMax: number;
    unbanBitcoinsForBarters: boolean;
}

export interface OtherFleaMarketChanges {
    enabled: boolean;
    sellingOnFlea: boolean;
    fleaMarktOpenAtLevel: number;
    fleaPricesIncreased: number;
    fleaPristineItems: boolean;
    onlyFoundInRaidItemsAllowedForBarters: boolean;
}

export interface TraderChanges {
    enabled: boolean;
    betterSalesToTraders: boolean;
    alternativeCategories: boolean;
    pacifistFence: PacifistFence;
    reasonablyPricedCases: boolean;
    skierUsesEuros: boolean;
    biggerLimits: boolean;
}

export interface PacifistFence {
    enabled: boolean;
    numberOfFenceOffers: number;
}

export interface CraftingChanges {
    enabled: boolean;
    craftingRebalance: boolean;
    additionalCraftingRecipes: boolean;
}

export interface InsuranceChanges {
    enabled: boolean;
    praporInsuranceChanges: TraderInsuranceChanges;
    therapistInsuranceChanges: TraderInsuranceChanges;
}

export interface TraderInsuranceChanges {
    enabled: boolean;
    returnChance: number;
    returnTime: number;
    insuranceCostMultiplier: number;
}

export interface OtherTweaks {
    enabled: boolean;
    skillExpBuffs: boolean;
    signalPistolInSpecialSlots: boolean;
    unexaminedItemsAreBack: boolean;
    fasterExamineTime: boolean;
    removeBackpackRestrictions: boolean;
    removeDiscardLimit: boolean;
    reshalaAlwaysHasGoldenTT: boolean;
    biggerAmmoStacks: BiggerAmmoStacks;
    questChanges: boolean;
}

export interface BiggerAmmoStacks {
    enabled: boolean;
    stackMultiplier: number;
}


