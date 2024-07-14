import { IHideoutProduction } from "@spt/models/eft/hideout/IHideoutProduction"

export const alpha: IHideoutProduction = {
    _id: "63da4dbee8fa73e22500001a",
    areaType: 10,
    requirements: [
        { areaType: 10, requiredLevel: 1, type: "Area" },
        {
            templateId: "567143bf4bdc2d1a0f8b4567",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5783c43d2459774bbe137486",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5c093e3486f77430cb02e593",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "590c621186f774138d11ea29",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 5600,
    endProduct: "544a11ac4bdc2d470e8b456a",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: true,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const beta: IHideoutProduction = {
    _id: "63da4dbee8fa73e22500001b",
    areaType: 10,
    requirements: [
        { areaType: 10, requiredLevel: 1, type: "Area" },
        {
            templateId: "544a11ac4bdc2d470e8b456a",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5aafbde786f774389d0cbc0f",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "590c60fc86f77412b13fddcf",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "62a0a16d0b9d3c46de5b6e97",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 10800,
    endProduct: "5857a8b324597729ab0a0e7d",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: true,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const epsilon = {
    _id: "63da4dbee8fa73e22500001c",

    areaType: 10,
    requirements: [
        { areaType: 10, requiredLevel: 2, type: "Area" },
        {
            templateId: "5857a8b324597729ab0a0e7d",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5c127c4486f7745625356c13",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "59fafd4b86f7745ca07e1232",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "619cbf9e0a7c3a1a2731940a",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "61bf7c024770ee6f9c6b8b53",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 35000,
    endProduct: "59db794186f77448bc595262",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: true,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const gamma: IHideoutProduction = {
    _id: "63da4dbee8fa73e22500001d",

    areaType: 10,
    requirements: [
        { areaType: 10, requiredLevel: 3, type: "Area" },
        {
            templateId: "59db794186f77448bc595262",
            count: 2,
            isFunctional: false,
            type: "Item",
        },

        {
            templateId: "5e2af55f86f7746d4159f07c",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "59fb016586f7746d0d4b423a",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5d235bb686f77443f4331278",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "619cbf7d23893217ec30b689",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "6389c7750ef44505c87f5996",
            count: 2,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 61200,
    endProduct: "5857a8bc2459772bad15db29",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: true,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}

export const containerRecipes: IHideoutProduction[] = [alpha, beta, epsilon, gamma]

export const Ophthalmoscope: IHideoutProduction = {
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
    endProduct: "5af0534a86f7743b6f354284",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const Zagustin: IHideoutProduction = {
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
    endProduct: "5c0e533786f7747fa23f4d47",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 3,
    productionLimitCount: 0,
}
export const Obdolbos: IHideoutProduction = {
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
    endProduct: "5ed5166ad380ab312177c100",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 8,
    productionLimitCount: 0,
}
export const CALOK: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000004",

    areaType: 7,
    requirements: [
        { areaType: 7, requiredLevel: 2, type: "Area" },
        {
            templateId: "59e35abd86f7741778269d82", // Pack of sodium bicarbonate
            count: 1,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5755383e24597772cb798966", // Vaseline balm
            count: 1,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 48,
    endProduct: "5e8488fa988a8701445df1e4",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
    // Granular nature? Check.
    // Stops blood with magical properties of pain-relieving Tarkov Vaseline? Check.
    // Fun and economically balanced recipe that includes underused items? Triple check.
}
export const Adrenaline: IHideoutProduction = {
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
    endProduct: "5c10c8fd86f7743d7d706df3",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const ThreebTG: IHideoutProduction = {
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
    endProduct: "5ed515c8d380ab312177c0fa",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}
export const AHF1: IHideoutProduction = {
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
    endProduct: "5ed515f6915ec335206e4152",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const OLOLO: IHideoutProduction = {
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
    endProduct: "62a0a043cf4a99369e2624a5",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 3,
    productionLimitCount: 0,
}
export const L1: IHideoutProduction = {
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
    endProduct: "5ed515e03a40a50460332579",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 1,
    productionLimitCount: 0,
}
export const P22: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000010",

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
    endProduct: "5ed515c8d380ab312177c0fa",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}
export const Trimadol: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000011",

    areaType: 7,
    requirements: [
        { areaType: 7, requiredLevel: 3, type: "Area" },
        {
            templateId: "5ed515c8d380ab312177c0fa",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5ed515e03a40a50460332579",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 52,
    endProduct: "637b620db7afa97bfc3d7009",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}
export const Meldonin: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000012",

    areaType: 7,
    requirements: [
        { areaType: 7, requiredLevel: 3, type: "Area" },
        {
            templateId: "5ed515e03a40a50460332579",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5ed51652f6c34d2cc26336a1",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 39,
    endProduct: "5ed5160a87bb8443d10680b5",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}
export const PNB: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000013",

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
    endProduct: "5ed515c8d380ab312177c0fa",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}
export const Perfotran: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000014",

    areaType: 7,
    requirements: [
        { areaType: 7, requiredLevel: 3, type: "Area" },
        {
            templateId: "5c0e533786f7747fa23f4d47",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5fca138c2a7b221b2852a5c6",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
        {
            templateId: "5c0e530286f7747fa1419862",
            count: 1,
            isFunctional: false,
            type: "Item",
        },
    ],
    productionTime: 45,
    endProduct: "637b6251104668754b72f8f9",
    continuous: false,
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    count: 2,
    productionLimitCount: 0,
}
export const SJ9: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000015",

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
    endProduct: "5ed515c8d380ab312177c0fa",
    continuous: false,
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    count: 2,
    productionLimitCount: 0,
}
export const SJ12: IHideoutProduction = {
    _id: "63da4dbee8fa73e225000016",

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
    endProduct: "5ed515c8d380ab312177c0fa",
    isEncoded: false,
    locked: false,
    needFuelForAllProductionTime: false,
    continuous: false,
    count: 2,
    productionLimitCount: 0,
}

export const additionalCraftingRecipes : IHideoutProduction[] = [ThreebTG, Adrenaline, L1, AHF1, CALOK, Ophthalmoscope, Zagustin, Obdolbos, OLOLO, Perfotran, Trimadol, Meldonin]
