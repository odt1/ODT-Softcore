import { JSONSchemaType } from "ajv"
import { Configuration } from "../types"

const ConfigurationSchema: JSONSchemaType<Configuration> = {
    type: "object",
    properties: {
        general: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                debug: { type: "boolean" }
            },
            required: ["enabled", "debug"],
            additionalProperties: false
        },
        secureContainersOptions: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                progressiveContainers: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        collectorQuestRedone: { type: "boolean" }
                    },
                    required: ["enabled", "collectorQuestRedone"],
                    additionalProperties: false
                },
                biggerContainers: { type: "boolean" }
            },
            required: ["enabled", "progressiveContainers", "biggerContainers"],
            additionalProperties: false
        },
        hideoutOptions: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                stashOptions: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        progressiveStash: { type: "boolean" },
                        biggerStash: { type: "boolean" },
                        lessCurrencyForConstruction: { type: "boolean" },
                        easierLoyalty: { type: "boolean" }
                    },
                    required: ["enabled", "progressiveStash", "biggerStash", "lessCurrencyForConstruction", "easierLoyalty"],
                    additionalProperties: false
                },
                hideoutContainers: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        biggerHideoutContainers: { type: "boolean" },
                        siccCaseBuff: { type: "boolean" }
                    },
                    required: ["enabled", "biggerHideoutContainers", "siccCaseBuff"],
                    additionalProperties: false
                },
                fasterBitcoinFarming: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        setBitcoinPriceTo100k: { type: "boolean" },
                        baseBitcoinTimeMultiplier: { type: "number" },
                        gpuEfficiency: { type: "number" }
                    },
                    required: ["enabled", "setBitcoinPriceTo100k", "baseBitcoinTimeMultiplier", "gpuEfficiency"],
                    additionalProperties: false
                },
                fasterCraftingTime: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        baseCraftingTimeMultiplier: { type: "number" },
                        hideoutSkillExpFix: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                hideoutSkillExpMultiplier: { type: "number" }
                            },
                            required: ["enabled", "hideoutSkillExpMultiplier"],
                            additionalProperties: false
                        },
                        fasterMoonshineProduction: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                baseCraftingTimeMultiplier: { type: "number" }
                            },
                            required: ["enabled", "baseCraftingTimeMultiplier"],
                            additionalProperties: false
                        },
                        fasterPurifiedWaterProduction: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                baseCraftingTimeMultiplier: { type: "number" }
                            },
                            required: ["enabled", "baseCraftingTimeMultiplier"],
                            additionalProperties: false
                        }
                    },
                    required: ["enabled", "baseCraftingTimeMultiplier", "hideoutSkillExpFix", "fasterMoonshineProduction", "fasterPurifiedWaterProduction"],
                    additionalProperties: false
                },
                fasterHideoutConstruction: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        hideoutConstructionTimeMultiplier: { type: "number" }
                    },
                    required: ["enabled", "hideoutConstructionTimeMultiplier"],
                    additionalProperties: false
                },
                fuelConsumption: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        fuelConsumptionMultiplier: { type: "number" }
                    },
                    required: ["enabled", "fuelConsumptionMultiplier"],
                    additionalProperties: false
                },
                scavCaseOptions: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        betterRewards: { type: "boolean" },
                        fasterScavcase: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                speedMultiplier: { type: "number" }
                            },
                            required: ["enabled", "speedMultiplier"],
                            additionalProperties: false
                        },
                        rebalance: { type: "boolean" }
                    },
                    required: ["enabled", "betterRewards", "fasterScavcase", "rebalance"],
                    additionalProperties: false
                },
                allowGymTrainingWithMusclePain: { type: "boolean" }
            },
            required: [
                "enabled",
                "stashOptions",
                "hideoutContainers",
                "fasterBitcoinFarming",
                "fasterCraftingTime",
                "fasterHideoutConstruction",
                "fuelConsumption",
                "scavCaseOptions",
                "allowGymTrainingWithMusclePain"
            ],
            additionalProperties: false
        },
        economyOptions: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                disableFleaMarketCompletely: { type: "boolean" },
                priceRebalance: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        itemFixes: { type: "boolean" }
                    },
                    required: ["enabled", "itemFixes"],
                    additionalProperties: false
                },
                pacifistFleaMarket: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        whitelist: { type: "boolean" },
                        questKeys: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                priceMultiplier: { type: "number" }
                            },
                            required: ["enabled", "priceMultiplier"],
                            additionalProperties: false
                        },
                        markedKeys: {
                            type: "object",
                            properties: {
                                enabled: { type: "boolean" },
                                priceMultiplier: { type: "number" }
                            },
                            required: ["enabled", "priceMultiplier"],
                            additionalProperties: false
                        }
                    },
                    required: ["enabled", "whitelist", "questKeys", "markedKeys"],
                    additionalProperties: false
                },
                barterEconomy: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        cashOffersPerentage: { type: "number" },
                        barterPriceVariance: { type: "number" },
                        offerItemCount: {
                            type: "object",
                            properties: {
                                min: { type: "number" },
                                max: { type: "number" }
                            },
                            required: ["min", "max"],
                            additionalProperties: false
                        },
                        nonStackableCount: {
                            type: "object",
                            properties: {
                                min: { type: "number" },
                                max: { type: "number" }
                            },
                            required: ["min", "max"],
                            additionalProperties: false
                        },
                        itemCountMax: { type: "number" },
                        unbanBitcoinsForBarters: { type: "boolean" }
                    },
                    required: [
                        "enabled",
                        "cashOffersPerentage",
                        "barterPriceVariance",
                        "offerItemCount",
                        "nonStackableCount",
                        "itemCountMax",
                        "unbanBitcoinsForBarters"
                    ],
                    additionalProperties: false
                },
                otherFleaMarketChanges: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        sellingOnFlea: { type: "boolean" },
                        fleaMarketOpenAtLevel: { type: "number" },
                        fleaPricesIncreased: { type: "number" },
                        fleaPristineItems: { type: "boolean" },
                        onlyFoundInRaidItemsAllowedForBarters: { type: "boolean" }
                    },
                    required: [
                        "enabled",
                        "sellingOnFlea",
                        "fleaMarketOpenAtLevel",
                        "fleaPricesIncreased",
                        "fleaPristineItems",
                        "onlyFoundInRaidItemsAllowedForBarters"
                    ],
                    additionalProperties: false
                }
            },
            required: [
                "enabled",
                "disableFleaMarketCompletely",
                "priceRebalance",
                "pacifistFleaMarket",
                "barterEconomy",
                "otherFleaMarketChanges"
            ],
            additionalProperties: false
        },
        traderChanges: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                betterSalesToTraders: { type: "boolean" },
                alternativeCategories: { type: "boolean" },
                pacifistFence: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        numberOfFenceOffers: { type: "number" }
                    },
                    required: ["enabled", "numberOfFenceOffers"],
                    additionalProperties: false
                },
                reasonablyPricedCases: { type: "boolean" },
                skierUsesEuros: { type: "boolean" },
                biggerLimits: { type: "boolean" }
            },
            required: [
                "enabled",
                "betterSalesToTraders",
                "alternativeCategories",
                "pacifistFence",
                "reasonablyPricedCases",
                "skierUsesEuros",
                "biggerLimits"
            ],
            additionalProperties: false
        },
        craftingChanges: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                craftingRebalance: { type: "boolean" },
                additionalCraftingRecipes: { type: "boolean" }
            },
            required: ["enabled", "craftingRebalance", "additionalCraftingRecipes"],
            additionalProperties: false
        },
        insuranceChanges: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                praporInsuranceChanges: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        returnChance: { type: "number" },
                        returnTime: { type: "number" },
                        insuranceCostMultiplier: { type: "number" }
                    },
                    required: ["enabled", "returnChance", "returnTime", "insuranceCostMultiplier"],
                    additionalProperties: false
                },
                therapistInsuranceChanges: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        returnChance: { type: "number" },
                        returnTime: { type: "number" },
                        insuranceCostMultiplier: { type: "number" }
                    },
                    required: ["enabled", "returnChance", "returnTime", "insuranceCostMultiplier"],
                    additionalProperties: false
                }
            },
            required: ["enabled", "praporInsuranceChanges", "therapistInsuranceChanges"],
            additionalProperties: false
        },
        otherTweaks: {
            type: "object",
            properties: {
                enabled: { type: "boolean" },
                skillExpBuffs: { type: "boolean" },
                signalPistolInSpecialSlots: { type: "boolean" },
                unexaminedItemsAreBack: { type: "boolean" },
                fasterExamineTime: { type: "boolean" },
                removeBackpackRestrictions: { type: "boolean" },
                removeDiscardLimit: { type: "boolean" },
                reshalaAlwaysHasGoldenTT: { type: "boolean" },
                biggerAmmoStacks: {
                    type: "object",
                    properties: {
                        enabled: { type: "boolean" },
                        stackMultiplier: { type: "number" }
                    },
                    required: ["enabled", "stackMultiplier"],
                    additionalProperties: false
                },
                questChanges: { type: "boolean" }
            },
            required: [
                "enabled",
                "skillExpBuffs",
                "signalPistolInSpecialSlots",
                "unexaminedItemsAreBack",
                "fasterExamineTime",
                "removeBackpackRestrictions",
                "removeDiscardLimit",
                "reshalaAlwaysHasGoldenTT",
                "biggerAmmoStacks",
                "questChanges"
            ],
            additionalProperties: false
        }
    },
    required: [
        "general",
        "secureContainersOptions",
        "hideoutOptions",
        "economyOptions",
        "traderChanges",
        "craftingChanges",
        "insuranceChanges",
        "otherTweaks"
    ],
    additionalProperties: false
};

export default ConfigurationSchema;
