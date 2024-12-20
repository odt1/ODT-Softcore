import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

export const whitelist = [
    // Whitelist for items that can be bartered FOR on flea, outside of fleaWhitelist categories
    ItemTpl.FACECOVER_GP7_GAS_MASK,
    ItemTpl.VEST_SECURITY,
    ItemTpl.BACKPACK_LOLKEK_3F_TRANSFER_TOURIST,
    ItemTpl.KEY_DORM_ROOM_308,
    ItemTpl.VISORS_ANTIFRAGMENTATION_GLASSES,
    ItemTpl.FACECOVER_LOWER_HALFMASK,
    ItemTpl.HEADWEAR_POMPON_HAT,
    ItemTpl.HEADWEAR_USHANKA_EAR_FLAP_HAT,
    ItemTpl.FACECOVER_PESTILY_PLAGUE_MASK,
    ItemTpl.FACECOVER_NEOPRENE_MASK,
    ItemTpl.FACECOVER_GP5_GAS_MASK,
    ItemTpl.VISORS_ROUND_FRAME_SUNGLASSES,
    ItemTpl.HEADWEAR_PSH97_DJETA_RIOT_HELMET,
    ItemTpl.KNIFE_BARS_A2607_95KH18,
    ItemTpl.KNIFE_BARS_A2607_DAMASCUS,
    ItemTpl.HEADWEAR_LEATHER_CAP,
    ItemTpl.BACKPACK_DUFFLE_BAG,
    ItemTpl.HEADPHONES_WALKERS_XCEL_500BT_DIGITAL_HEADSET,
    ItemTpl.HEADPHONES_PELTOR_TACTICAL_SPORT_HEADSET,
    ItemTpl.HEADPHONES_WALKERS_RAZOR_DIGITAL_HEADSET,
    ItemTpl.HEADPHONES_PELTOR_COMTAC_IV_HYBRID_HEADSET_COYOTE_BROWN,
    ItemTpl.HEADWEAR_KINDA_COWBOY_HAT,
    ItemTpl.PISTOL_MAKAROV_PM_T_9X18PM,
    ItemTpl.KNIFE_SP8_SURVIVAL_MACHETE,
    ItemTpl.AMMO_40MMRU_VOG25,
    ItemTpl.CONTAINER_SIMPLE_WALLET,
    ItemTpl.KNIFE_ER_FULCRUM_BAYONET,
    ItemTpl.VISORS_RAYBENCH_HIPSTER_RESERVE_SUNGLASSES,
    ItemTpl.FACECOVER_SHEMAGH_GREEN,
    ItemTpl.FACECOVER_GHOST_BALACLAVA,
    ItemTpl.SILENCER_SUREFIRE_SOCOM556MINI_MONSTER_556X45_SOUND_SUPPRESSOR
]

export const fleaBarterRequestBlacklist = [
    BaseClasses.DRINK,
    BaseClasses.INFO,
    BaseClasses.FOOD,
    BaseClasses.DRUGS,
    BaseClasses.MEDKIT,
    BaseClasses.MEDICAL,
    BaseClasses.BATTERY,
    BaseClasses.ELECTRONICS,
    BaseClasses.BUILDING_MATERIAL,
    BaseClasses.MONEY,
    BaseClasses.HOUSEHOLD_GOODS,
    BaseClasses.JEWELRY,
    BaseClasses.LUBRICANT,
    BaseClasses.OTHER,
    BaseClasses.TOOL,
    BaseClasses.MEDICAL_SUPPLIES,
    BaseClasses.FUEL
]

export const fleaBarterRequestBlacklistItems = [
    ItemTpl.DRINK_BOTTLE_OF_TARKOVSKAYA_VODKA_BAD,
    ItemTpl.BARTER_CHRISTMAS_TREE_ORNAMENT_VIOLET,
    ItemTpl.BARTER_CHRISTMAS_TREE_ORNAMENT_SILVER,
    ItemTpl.BARTER_CHRISTMAS_TREE_ORNAMENT_RED,
    ItemTpl.BARTER_DOGTAGT,
    ItemTpl.BARTER_DOGTAG_BEAR,
    ItemTpl.BARTER_DOGTAG_BEAR_EOD,
    ItemTpl.BARTER_DOGTAG_BEAR_TUE,
    ItemTpl.BARTER_DOGTAG_USEC,
    ItemTpl.BARTER_DOGTAG_USEC_EOD,
    ItemTpl.BARTER_DOGTAG_USEC_TUE
]
