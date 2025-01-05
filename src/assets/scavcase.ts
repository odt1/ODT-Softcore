import { IScavRecipe } from "@spt/models/eft/hideout/IHideoutProduction"
import { ItemTpl } from "@spt/models/enums/ItemTpl"

export const scavcaseRewardItemValueRangeRubReworked = {
	common: {
		// AVG 7941
		min: 1,
		max: 20000,
	},
	rare: {
		// AVG 36415
		min: 20001,
		max: 60000,
	},
	superrare: {
		// AVG 157978
		min: 60001,
		max: 1200000,
	},
}

export const scavCaseRecipesReworked: IScavRecipe[] = [
	{
		_id: "62710974e71632321e5afd5f",
		requirements: [
			{
				templateId: ItemTpl.DRINK_BOTTLE_OF_PEVKO_LIGHT_BEER,
				count: 1,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			},
		],
		productionTime: 2500,
		endProducts: {
			Common: {
				min: 3,
				max: 3,
			},
			Rare: {
				min: 0,
				max: 0,
			},
			Superrare: {
				min: 0,
				max: 0,
			},
		},
	},
	{
		_id: "62710a8c403346379e3de9be",
		requirements: [
			{
				templateId: ItemTpl.DRINK_BOTTLE_OF_TARKOVSKAYA_VODKA,
				count: 1,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			},
		],
		productionTime: 7700,
		endProducts: {
			Common: {
				min: 3,
				max: 4,
			},
			Rare: {
				min: 0,
				max: 1,
			},
			Superrare: {
				min: 0,
				max: 0,
			},
		},
	},
	{
		_id: "62710a69adfbd4354d79c58e",
		requirements: [
			{
				templateId: ItemTpl.DRINK_BOTTLE_OF_DAN_JACKIEL_WHISKEY,
				count: 1,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			},
		],
		productionTime: 8100,
		endProducts: {
			Common: {
				min: 4,
				max: 5,
			},
			Rare: {
				min: 1,
				max: 2,
			},
			Superrare: {
				min: 0,
				max: 0,
			},
		},
	},
	{
		_id: "6271093e621b0a76055cd61e",
		requirements: [
			{
				templateId: ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE,
				count: 1,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			},
		],
		productionTime: 16800,
		endProducts: {
			Common: {
				min: 1,
				max: 3,
			},
			Rare: {
				min: 0,
				max: 3,
			},
			Superrare: {
				min: 0,
				max: 2,
			},
		},
	},
	{
		_id: "62710a0e436dcc0b9c55f4ec",
		requirements: [
			{
				templateId: ItemTpl.INFO_INTELLIGENCE_FOLDER,
				count: 1,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			},
		],
		productionTime: 19200,
		endProducts: {
			Common: {
				min: 3,
				max: 3,
			},
			Rare: {
				min: 3,
				max: 5,
			},
			Superrare: {
				min: 1,
				max: 1,
			},
		},
	},
]

export const scavcaseWhitelist = [
	"5447b5f14bdc2d61278b4567", // AssaultRifle
	"543be5cb4bdc2deb348b4568", // AmmoBox
	"5c99f98d86f7745c314214b3", // KeyMechanical
	"5447b5cf4bdc2d65278b4567", // Pistol
	"543be6564bdc2df4348b4568", // ThrowWeap
	// "5448bc234bdc2d3c308b4569", // Magazine
	"5448e8d64bdc2dce718b4568", // Drink
	"5448e8d04bdc2ddf718b4569", // Food
	"543be5dd4bdc2deb348b4569", // Money
	// "55818b164bdc2ddc698b456c", // TacticalCombo
	// "550aa4cd4bdc2dd8348b456c", // Silencer
	"5447e1d04bdc2dff2f8b4567", // Knife
	"5447b6094bdc2dc3278b4567", // Shotgun
	// "5448bf274bdc2dfc2f8b456a", // MobContainer
	// "550aa4bf4bdc2dd6348b456b", // FlashHider
	// "55818add4bdc2d5b648b456f", // AssaultScope
	// "55818ae44bdc2dde698b456c", // OpticScope
	"5448e5284bdc2dcb718b4567", // Vest
	"5448e53e4bdc2d60728b4567", // Backpack
	"5448f3ac4bdc2dce718b4569", // Medical
	"5448f3a14bdc2d27728b4569", // Drugs
	"5448f39d4bdc2d0a728b4568", // MedKit
	"66abb0743f4d8b145b1612c1", // Multitools
	"5485a8684bdc2da71d8b4567", // Ammo
	"5448e54d4bdc2dcc718b4568", // Armor
	// "5448e5724bdc2ddf718b4568", // Visors
	// "557596e64bdc2dc2118b4571", // Pockets
	// "555ef6e44bdc2de9068b457e", // Barrel
	"5447b6254bdc2dc3278b4568", // SniperRifle
	// "55818ad54bdc2ddc698b4569", // Collimator
	// "550aa4dd4bdc2dc9348b4569", // MuzzleCombo
	// "55818a684bdc2ddd698b456d", // PistolGrip
	// "55818af64bdc2d5b648b4570", // Foregrip
	// "55818a304bdc2db5418b457d", // Receiver
	// "55818a6f4bdc2db9688b456b", // Charge
	// "55818a104bdc2db9688b4569", // Handguard
	// "55818b224bdc2dde698b456f", // Mount
	// "55818a594bdc2db9688b456a", // Stock
	// "55818ac54bdc2d5b648b456e", // IronSight
	// "55d720f24bdc2d88028b456d", // Inventory
	// "5a74651486f7744e73386dd1", // AuxiliaryMod
	// "5a341c4086f77401f2541505", // Headwear
	"5645bcb74bdc2ded0b8b4578", // Headphones
	"55818b014bdc2ddc698b456b", // Launcher
	// "566abbb64bdc2d144c8b457d", // Stash
	// "5671435f4bdc2d96058b4569", // LockableContainer
	"57864ee62459775490116fc1", // Battery
	"57864a66245977548f04a81f", // Electronics
	"57864e4c24597754843f8723", // Lubricant
	// "55818afb4bdc2dde698b456d", // Bipod
	// "56ea9461d2720b67698b456f", // Gasblock
	"5a2c3a9486f774688b05e574", // NightVision
	// "5a341c4686f77469e155819e", // FaceCover
	"57864a3d24597754843f8721", // Jewelry
	// "590c745b86f7743cc433c5f2", // Other
	"57864ada245977548638de91", // BuildingMaterial
	"57864c322459775490116fbf", // HouseholdGoods
	"5447b5fc4bdc2d87278b4567", // AssaultCarbine
	// "567849dd4bdc2d150f8b456e", // Map
	// "55818acf4bdc2dde698b456b", // CompactCollimator
	"5447b6194bdc2d67278b4567", // MarksmanRifle
	"5795f317245977243854e041", // SimpleContainer
	// "566965d44bdc2d814c8b4571", // LootContainer
	"5447b5e04bdc2d62278b4567", // Smg
	// "55818b084bdc2d5b648b4571", // Flashlight
	"57864bb7245977548b3b66c2", // Tool
	"5448ecbe4bdc2d60728b4568", // Info
	"616eb7aea207f41933308f46", // RepairKits
	// "5447e0e74bdc2d3c308b4567", // SpecItem
	"57864c8c245977548867e7f1", // MedicalSupplies
	"57bef4c42459772e8d35a53b", // ArmoredEquipment
	"55818aeb4bdc2ddc698b456a", // SpecialScope
	// "5b3f15d486f77432d0509248", // ArmBand
	"5447bed64bdc2d97278b4568", // MachineGun
	"5448f3a64bdc2d60728b456a", // Stimulator
	"5d21f59b6dbe99052b54ef83", // ThermalVision
	"5c164d2286f774194c5e69fa", // Keycard
	"5d650c3e815116009f6201d2", // Fuel
	"5447bedf4bdc2d87278b4568", // GrenadeLauncher
	// "5f4fbaaca5573a5ac31db429", // Compass
	// "6050cac987d3f925bf016837", // SortingTable
	"617f1ef5e8b54b0998387733", // Revolver
	// "610720f290b75a49ff2e5e25", // CylinderMagazine
	// "61605ddea09d851a0a0c1bbc", // PortableRangeFinder
	// "627a137bf21bc425b06ab944", // SpringDrivenCylinder
	// "62e9103049c018f425059f38", // RadioTransmitter
	// "62f109593b54472778797866", // RandomLootContainer
	// "63da6da4784a55176c018dba", // HideoutAreaContainer
	// "65649eb40bf0ed77b8044453", // BuiltInInserts
	"644120aa86ffbe10ee032b6f", // ArmorPlate
	// "64b69b0c8f3be32ed22682f8", // CultistAmulet
	// "65ddcc7aef36f6413d0829b9", // MarkOfUnknown
	// "6672e40ebb23210ae87d39eb", // PlantingKits
]
export const scavcaseItemBlacklist = [
	// Blacklist (itemIDs) to always exclude items from reward list
	"660bbc47c38b837877075e47", // Encrypted flash drive: 10000
	"6389c7750ef44505c87f5996", // Microcontroller board
	"6389c7f115805221fb410466", // Far-forward GPS Signal Amplifier Unit
	"6389c85357baa773a825b356", // Advanced current converter
	"6389c8fb46b54c634724d847", // Silicon Optoelectronic Integrated Circuits textbook
	"6389c92d52123d5dd17f8876", // Advanced Electronic Materials textbook
	"6398fd8ad3de3849057f5128", // Backup hideout key
	"63a0b2eabea67a6d93009e52", // Radio repeater
	"63a39e1d234195315d4020bd", // Primorsky 46-48 skybridge key
	"64d0b40fbe2eed70e254e2d4", // Sacred Amulet
	"64d4b23dc1b37504b41ac2b6", // Rusted bloody key
	"65ddcc9cfa85b9f17d0dfb07", // Mark of The Unheard
	"660312cc4d6cdfa6f500c703", // Armband of The Unheard
	"660bbc98c38b837877075e4a", // Decrypted flash drive
	"660bc341c38b837877075e4c", // Documents with decrypted data
	"664a5480bfcc521bad3192ca", // Armband (ARENA)
	"619bc61e86e01e16f839a999", // Armband (Alpha)
	"619bddc6c9546643a67df6ee", // Armband (DEADSKUL)
	"619bddffc9546643a67df6f0", // Armband (Train Hard)
	"619bde3dc9546643a67df6f2", // Armband (Kiba Arms)
	"619bdeb986e01e16f839a99e", // Armband (RFARMY)
	"619bdf9cc9546643a67df6f8", // Armband (UNTAR)
	"664d3db6db5dea2bad286955", // Shatun's hideout key
	"664d3dd590294949fe2d81b7", // Grumpy's hideout key
	"664d3ddfdda2e85aca370d75", // Voron's hideout key
	"664d3de85f2355673b09aed5", // Leon's hideout key
	"6655e35b6bc645cb7b059912", // "The Eye" mortar strike signaling device
	"66571bf06a723f7f005a0619", // Locked equipment crate (Rare)
	"66572b3f6a723f7f005a066c", // Locked weapon crate (Rare)
	"66572b88ac60f009f270d1dc", // Locked supply crate (Rare)
	"66572bb3ac60f009f270d1df", // Locked valuables crate (Rare)
	"665730fa4de4820934746c48", // Unlocked equipment crate (Rare)
	"665732e7ac60f009f270d1ef", // Unlocked weapon crate (Rare)
	"665732f4464c4b4ba4670fa9", // Unlocked supply crate (Rare)
	"66573310a1657263d816a139", // Unlocked valuables crate (Rare)
	"6662e9aca7e0b43baa3d5f74", // Dogtag BEAR
	"6662e9cda7e0b43baa3d5f76", // Dogtag BEAR
	"6662e9f37fa79a6d83730fa0", // Dogtag USEC
	"6662ea05f6259762c56f3189", // Dogtag USEC
	"666b11055a706400b717cfa5", // Tripwire installation kit
	"66bc98a01a47be227a5e956e", // Streamer item case
	"66d9f1abb16d9aacf5068468", // RSP-30 reactive signal cartridge (Special Yellow)
	"66d9f7256916142b3b02276e", // Radar station spare parts
	"66d9f7e7099cf6adcc07a369", // KOSA UAV electronic jamming device
	"66d9f8744827a77e870ecaf1", // GARY ZONT portable electronic warfare device
	"674078c4a9c9adf0450d59f9", // Opened case
	"67408903268737ef6908d432", // Contraband box
	"67409848d0b2f8eb9b034db9", // Sealed box
	"674098588466ebb03408b210", // Opened box
	"6740987b89d5e1ddc603f4f0", // Locked case
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red): 7000,
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver): 10000,
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet): 20000,
]
