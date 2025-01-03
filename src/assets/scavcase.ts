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
		endProducts: {
			Common: {
				min: 2,
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
		productionTime: 2500,
		requirements: [
			{
				count: 1,
				isEncoded: false,
				isFunctional: false,
				templateId: ItemTpl.DRINK_BOTTLE_OF_PEVKO_LIGHT_BEER, // Pevko, T1
				type: "Item",
			},
		],
		_id: "62710974e71632321e5afd5f",
	},
	{
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
		productionTime: 7700,
		requirements: [
			{
				count: 1,
				isEncoded: false,
				isFunctional: false,
				templateId: ItemTpl.DRINK_BOTTLE_OF_TARKOVSKAYA_VODKA, // Vodka T2
				type: "Item",
			},
		],
		_id: "62710a8c403346379e3de9be",
	},

	{
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
		productionTime: 8100,
		requirements: [
			{
				count: 1,
				isEncoded: false,
				isFunctional: false,
				templateId: ItemTpl.DRINK_BOTTLE_OF_DAN_JACKIEL_WHISKEY, // Whisky T3
				type: "Item",
			},
		],
		_id: "62710a69adfbd4354d79c58e",
	},
	{
		endProducts: {
			Common: {
				min: 2,
				max: 3,
			},
			Rare: {
				min: 0,
				max: 3,
			},
			Superrare: {
				min: 1,
				max: 2,
			},
		},
		productionTime: 16800,
		requirements: [
			{
				count: 1,
				isEncoded: false,
				isFunctional: false,
				templateId: ItemTpl.DRINK_BOTTLE_OF_FIERCE_HATCHLING_MOONSHINE, // Moonshine
				type: "Item",
			},
		],
		_id: "6271093e621b0a76055cd61e",
	},
	{
		endProducts: {
			Common: {
				min: 2,
				max: 3,
			},
			Rare: {
				min: 3,
				max: 5,
			},
			Superrare: {
				min: 0,
				max: 1,
			},
		},
		productionTime: 19200,
		requirements: [
			{
				count: 1,
				isEncoded: false,
				isFunctional: false,
				templateId: ItemTpl.INFO_INTELLIGENCE_FOLDER, // Intel
				type: "Item",
			},
		],
		_id: "62710a0e436dcc0b9c55f4ec",
	},
]
