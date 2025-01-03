import { IHideoutProduction } from "@spt/models/eft/hideout/IHideoutProduction"
import { ItemTpl } from "@spt/models/enums/ItemTpl"
export const craftingAdjustments = [
	{
		id: ItemTpl.BARTER_TOILET_PAPER,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 1
		},
	},
	{
		id: ItemTpl.BARTER_CLIN_WINDOW_CLEANER,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
		},
	},
	{
		id: ItemTpl.BARTER_PARACORD,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
		},
	},
	{
		id: ItemTpl.BARTER_CORRUGATED_HOSE,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
			craft.count = 1
		},
	},
	{
		id: ItemTpl.BARTER_WATER_FILTER,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_GAS_MASK_AIR_FILTER)
			if (!requirement) {
				return
			}
			requirement.count = 2
		},
	},
	{
		id: ItemTpl.DRINK_EMERGENCY_WATER_RATION,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 3
		},
	},
	{
		id: ItemTpl.BARTER_CAN_OF_MAJAICA_COFFEE_BEANS,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 3
		},
	},
	{
		id: ItemTpl.DRINK_BOTTLE_OF_WATER_06L,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 16
		},
	},
	{
		id: ItemTpl.STIM_MULE_STIMULANT_INJECTOR,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
		},
	},
	{
		id: ItemTpl.STIM_ETGCHANGE_REGENERATIVE_STIMULANT_INJECTOR,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.MEDICAL_CALOKB_HEMOSTATIC_APPLICATOR)
			if (!requirement) {
				return
			}
			requirement.count = 2
		},
	},
	{
		id: ItemTpl.MEDKIT_AFAK_TACTICAL_INDIVIDUAL_FIRST_AID_KIT,
		adjust: (craft: IHideoutProduction) => {
			let requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.MEDKIT_IFAK_INDIVIDUAL_FIRST_AID_KIT)
			if (!requirement) {
				return
			}
			requirement.count = 1
			requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.MEDICAL_ARMY_BANDAGE)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.MEDICAL_CALOKB_HEMOSTATIC_APPLICATOR
		},
	},
	{
		id: ItemTpl.BARTER_PORTABLE_DEFIBRILLATOR,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_PORTABLE_POWERBANK)
			if (!requirement) {
				return
			}
			requirement.count = 4
		},
	},
	{
		id: ItemTpl.BARTER_LEDX_SKIN_TRANSILLUMINATOR,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
		},
	},
	{
		id: ItemTpl.MEDICAL_CMS_SURGICAL_KIT,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_MEDICAL_TOOLS)
			if (!requirement) {
				return
			}
			requirement.count = 2
		},
	},
	{
		id: ItemTpl.MEDKIT_GRIZZLY_MEDICAL_KIT,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 1
		},
	},
	{
		id: ItemTpl.STIM_SJ6_TGLABS_COMBAT_STIMULANT_INJECTOR,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 3
		},
	},
	{
		id: ItemTpl.INFO_TOPOGRAPHIC_SURVEY_MAPS,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
		},
	},
	{
		id: ItemTpl.INFO_MILITARY_FLASH_DRIVE,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 1
			let requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.INFO_SECURE_FLASH_DRIVE)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.BARTER_VPX_FLASH_STORAGE_MODULE
			requirement = craft.requirements.find((requirement) => requirement.type === "Area")
			if (!requirement) {
				return
			}
			requirement.requiredLevel = 2
		},
	},
	{
		id: ItemTpl.INFO_INTELLIGENCE_FOLDER,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.INFO_MILITARY_FLASH_DRIVE)
			if (!requirement) {
				return
			}
			requirement.count = 1
		},
	},
	{
		id: ItemTpl.BARTER_VPX_FLASH_STORAGE_MODULE,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 2
				}
			}
		},
	},
	{
		id: ItemTpl.BARTER_VIRTEX_PROGRAMMABLE_PROCESSOR,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_MILITARY_CIRCUIT_BOARD)
			if (!requirement) {
				return
			}
			requirement.count = 1
		},
	},
	{
		id: ItemTpl.BARTER_GRAPHICS_CARD,
		adjust: (craft: IHideoutProduction) => {
			let requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_VPX_FLASH_STORAGE_MODULE)
			if (!requirement) {
				return
			}
			requirement.count = 1
			requirement.templateId = ItemTpl.BARTER_VIRTEX_PROGRAMMABLE_PROCESSOR
			requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_PC_CPU)
			if (!requirement) {
				return
			}
			requirement.count = 1
			requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_PRINTED_CIRCUIT_BOARD)
			if (!requirement) {
				return
			}
			requirement.count = 1
		},
	},
	{
		id: ItemTpl.BARTER_MILITARY_CIRCUIT_BOARD,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
		},
	},
	{
		id: ItemTpl.SPECIALSCOPE_FLIR_RS32_2259X_35MM_60HZ_THERMAL_RIFLESCOPE,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
				if (requirement.templateId === ItemTpl.INFO_SAS_DRIVE) {
					requirement.templateId = ItemTpl.SPECIALSCOPE_ARMASIGHT_VULCAN_MG_35X_BRAVO_NIGHT_VISION_SCOPE
				}
			}
		},
	},
	{
		id: ItemTpl.BARTER_UHF_RFID_READER,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 11,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.BARTER_BROKEN_GPHONE_X_SMARTPHONE,
					count: 1,
					isFunctional: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.SPECITEM_SIGNAL_JAMMER,
					count: 1,
					isFunctional: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_FLAT_SCREWDRIVER_LONG,
					type: "Tool",
				},
				{
					templateId: ItemTpl.BARTER_FLAT_SCREWDRIVER,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.BARTER_GAS_ANALYZER,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
		},
	},
	{
		id: ItemTpl.BARTER_GUNPOWDER_HAWK,
		adjust: (craft: IHideoutProduction) => {
			let requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_CLASSIC_MATCHES)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.BARTER_CAN_OF_THERMITE
			requirement = craft.requirements.find((requirement) => requirement.type === "Area")
			if (!requirement) {
				return
			}
			requirement.requiredLevel = 2
		},
	},
	{
		id: ItemTpl.BARTER_SPARK_PLUG,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 4
		},
	},
	{
		id: ItemTpl.BARTER_PRINTED_CIRCUIT_BOARD,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 3
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_GAS_ANALYZER)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.BARTER_GEIGERMULLER_COUNTER
		},
	},
	{
		id: ItemTpl.BARTER_GEIGERMULLER_COUNTER,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 1,
					type: "Area",
				},
				{
					templateId: ItemTpl.BARTER_GAS_ANALYZER,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_TOOLSET,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.BARTER_GREENBAT_LITHIUM_BATTERY,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 2
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.BARTER_PORTABLE_POWERBANK,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_ROUND_PLIERS,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.GRENADE_VOG25_KHATTABKA_IMPROVISED_HAND,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 2
				}
			}
		},
	},
	{
		id: ItemTpl.AMMO_23X75_ZVEZDA,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 20
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.BARTER_GUNPOWDER_EAGLE,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.AMMO_23X75_SHRAP10,
					count: 20,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.GRENADE_ZARYA_STUN,
					count: 2,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_TOOLSET,
					type: "Tool",
				},
				{
					templateId: ItemTpl.MULTITOOLS_LEATHERMAN_MULTITOOL,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.BARTER_RECHARGEABLE_BATTERY,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.BARTER_PORTABLE_POWERBANK)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.BARTER_ELECTRIC_DRILL
		},
	},
	{
		id: ItemTpl.BARTER_CAN_OF_THERMITE,
		adjust: (craft: IHideoutProduction) => {
			const requirement = craft.requirements.find((requirement) => requirement.templateId === ItemTpl.KEY_DORM_ROOM_308)
			if (!requirement) {
				return
			}
			requirement.templateId = ItemTpl.KNIFE_BARS_A2607_DAMASCUS
		},
	},
	{
		id: ItemTpl.AMMO_45ACP_AP,
		adjust: (craft: IHideoutProduction) => {
			craft.count = 120
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.AMMO_45ACP_LASERMATCH,
					count: 120,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.MULTITOOLS_LEATHERMAN_MULTITOOL,
					type: "Tool",
				},
				{
					templateId: ItemTpl.BARTER_GUNPOWDER_EAGLE,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_PACK_OF_NAILS,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_SET_OF_FILES_MASTER,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.AMMO_57X28_SS190,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.BARTER_HAND_DRILL,
					type: "Tool",
				},
				{
					templateId: ItemTpl.BARTER_PLIERS_ELITE,
					type: "Tool",
				},
				{
					templateId: ItemTpl.AMMO_57X28_SS197SR,
					count: 180,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_GUNPOWDER_HAWK,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_PACK_OF_NAILS,
					count: 2,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
			]
		},
	},
	{
		id: ItemTpl.AMMO_556X45_SOST,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.AMMO_556X45_HP,
					count: 150,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_GUNPOWDER_EAGLE,
					count: 1,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_PLIERS_ELITE,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.AMMO_9X18PM_PSTM,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements.push({
				templateId: ItemTpl.AMMO_9X18PM_PST,
				count: 140,
				isFunctional: false,
				isEncoded: false,
				type: "Item",
			})
		},
	},
	{
		id: ItemTpl.AMMO_12G_AP20,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.AMMO_12G_MAGNUM,
					count: 80,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.AMMO_9X19_AP_63,
					count: 80,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_NIPPERS,
					type: "Tool",
				},
				{
					templateId: ItemTpl.BARTER_FLAT_SCREWDRIVER_LONG,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.AMMO_46X30_AP_SX,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count && requirement.count < 10) {
					requirement.count = 1
				}
			}
		},
	},
	{
		id: ItemTpl.AMMO_366TKM_APM,
		adjust: (craft: IHideoutProduction) => {
			craft.requirements = [
				{
					areaType: 10,
					requiredLevel: 2,
					type: "Area",
				},
				{
					templateId: ItemTpl.AMMO_9X39_SP6,
					count: 100,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.AMMO_762X39_HP,
					count: 100,
					isFunctional: false,
					isEncoded: false,
					type: "Item",
				},
				{
					templateId: ItemTpl.BARTER_PLIERS,
					type: "Tool",
				},
			]
		},
	},
	{
		id: ItemTpl.BARTER_OFZ_30X165MM_SHELL,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
		},
	},
	{
		id: ItemTpl.GRENADE_RGD5_HAND,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
		},
	},
	{
		id: ItemTpl.GRENADE_ZARYA_STUN,
		adjust: (craft: IHideoutProduction) => {
			for (const requirement of craft.requirements) {
				if (requirement.count) {
					requirement.count = 1
				}
			}
		},
	},
]
