import { DependencyContainer } from "tsyringe"

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer"
import { ConfigServer } from "@spt-aki/servers/ConfigServer"
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes"
// import { ObjectId } from "@spt-aki/utils/ObjectId" // [Debug]

// import * as fs from "fs" // [Debug] Used for file saving

import config from "../config/config.json"

const fleaWhitelist = [
	// Whitelist for disabling global flea offers
	// Handbook Categories IDs
	"5b47574386f77428ca22b2ed", // Energy elements
	"5b47574386f77428ca22b2ee", // Building materials
	"5b47574386f77428ca22b2ef", // Electronics
	"5b47574386f77428ca22b2f0", // Household materials
	"5b47574386f77428ca22b2f1", // Valuables
	"5b47574386f77428ca22b2f2", // Flammable materials
	"5b47574386f77428ca22b2f3", // Medical supplies
	"5b47574386f77428ca22b2f4", // Others
	"5b47574386f77428ca22b2f6", // Tools
	// "5b47574386f77428ca22b32f", // Facecovers
	// "5b47574386f77428ca22b330", // Headgear
	// "5b47574386f77428ca22b331", // Eyewear
	"5b47574386f77428ca22b335", // Drinks
	"5b47574386f77428ca22b336", // Food
	"5b47574386f77428ca22b337", // Pills
	"5b47574386f77428ca22b338", // Medkits
	"5b47574386f77428ca22b339", // Injury treatment
	"5b47574386f77428ca22b33a", // Injectors
	// "5b47574386f77428ca22b33b", // Rounds
	// "5b47574386f77428ca22b33c", // Ammo packs
	// "5b47574386f77428ca22b33f", // Gear
	"5b47574386f77428ca22b341", // Info items
	// "5b47574386f77428ca22b342", // Keys
	"5b47574386f77428ca22b343", // Maps
	"5b47574386f77428ca22b344", // Medication
	"5b47574386f77428ca22b345", // Special equipment
	// "5b47574386f77428ca22b346", // Ammo
	// "5b5f6f3c86f774094242ef87", // Headsets
	// "5b5f6f6c86f774093f2ecf0b", // Backpacks
	// "5b5f6f8786f77447ed563642", // Tactical rigs
	// "5b5f6fa186f77409407a7eb7", // Storage containers
	// "5b5f6fd286f774093f2ecf0d", // Secure containers
	// "5b5f701386f774093f2ecf0f", // Body armor
	// "5b5f704686f77447ec5d76d7", // Gear components
	// "5b5f71a686f77447ed5636ab", // Weapon parts & mods
	// "5b5f71b386f774093f2ecf11", // Functional mods
	// "5b5f71c186f77409407a7ec0", // Bipods
	// "5b5f71de86f774093f2ecf13", // Foregrips
	// "5b5f724186f77447ed5636ad", // Muzzle devices
	// "5b5f724c86f774093f2ecf15", // Flashhiders & brakes
	// "5b5f72f786f77447ec5d7702", // Muzzle adapters
	// "5b5f731a86f774093e6cb4f9", // Suppressors
	// "5b5f736886f774094242f193", // Light & laser devices
	// "5b5f737886f774093e6cb4fb", // Tactical combo devices
	// "5b5f73ab86f774094242f195", // Flashlights
	// "5b5f73c486f77447ec5d7704", // Laser target pointers
	// "5b5f73ec86f774093e6cb4fd", // Sights
	// "5b5f740a86f77447ec5d7706", // Assault scopes
	// "5b5f742686f774093e6cb4ff", // Collimators
	// "5b5f744786f774094242f197", // Compact collimators
	// "5b5f746686f77447ec5d7708", // Iron sights
	// "5b5f748386f774093e6cb501", // Optics
	// "5b5f749986f774094242f199", // Special purpose sights
	// "5b5f74cc86f77447ec5d770a", // Auxiliary parts
	// "5b5f750686f774093e6cb503", // Gear mods
	// "5b5f751486f77447ec5d770c", // Charging handles
	// "5b5f752e86f774093e6cb505", // Launchers
	// "5b5f754a86f774094242f19b", // Magazines
	// "5b5f755f86f77447ec5d770e", // Mounts
	// "5b5f757486f774093e6cb507", // Stocks & chassis
	// "5b5f759686f774094242f19d", // Magwells
	// "5b5f75b986f77447ec5d7710", // Vital parts
	// "5b5f75c686f774094242f19f", // Barrels
	// "5b5f75e486f77447ec5d7712", // Handguards
	// "5b5f760586f774093e6cb509", // Gas blocks
	// "5b5f761f86f774094242f1a1", // Pistol grips
	// "5b5f764186f77447ec5d7714", // Receivers & slides
	// "5b5f78b786f77447ed5636af", // Money
	// "5b5f78dc86f77409407a7f8e", // Weapons
	// "5b5f78e986f77447ed5636b1", // Assault carbines
	// "5b5f78fc86f77409407a7f90", // Assault rifles
	// "5b5f791486f774093f2ed3be", // Marksman rifles
	// "5b5f792486f77447ed5636b3", // Pistols
	// "5b5f794b86f77409407a7f92", // Shotguns
	// "5b5f796a86f774093f2ed3c0", // SMGs
	// "5b5f798886f77447ed5636b5", // Bolt-action rifles
	// "5b5f79a486f77409407a7f94", // Machine guns
	// "5b5f79d186f774093f2ed3c2", // Grenade launchers
	// "5b5f79eb86f77447ed5636b7", // Special weapons
	// "5b5f7a0886f77409407a7f96", // Melee weapons
	// "5b5f7a2386f774093f2ed3c4", // Throwables
	// "5b619f1a86f77450a702a6f3", // Quest items
	// "5c518ec986f7743b68682ce2", // Mechanical keys
	// "5c518ed586f774119a772aee", // Electronic keys
]

const baseClasses = [
	// unused, for reference
	"54009119af1c881c07000029", // Item
	"5d650c3e815116009f6201d2", // Fuel
	"57864ee62459775490116fc1", // Battery
	"57864ada245977548638de91", // Building material
	"57864a66245977548f04a81f", // Electronics
	"57864c322459775490116fbf", // Household goods
	"57864a3d24597754843f8721", // Jewelry
	"57864e4c24597754843f8723", // Lubricant
	"57864c8c245977548867e7f1", // Medical supplies
	"590c745b86f7743cc433c5f2", // Other
	"57864bb7245977548b3b66c2", // Tool
	"5448e54d4bdc2dcc718b4568", // Armor
	"5a341c4686f77469e155819e", // FaceCover
	"5a341c4086f77401f2541505", // Headwear
	"5448e5724bdc2ddf718b4568", // Vis. observ. device
	"5b3f15d486f77432d0509248", // ArmBand
	"57bef4c42459772e8d35a53b", // Armored equipment
	"5645bcb74bdc2ded0b8b4578", // Headphones
	"550aa4af4bdc2dd4348b456e", // Compensator
	"550aa4bf4bdc2dd6348b456b", // Flashhider
	"550aa4dd4bdc2dc9348b4569", // Comb. muzzle device
	"550ad14d4bdc2dd5348b456c", // PMS
	"550aa4cd4bdc2dd8348b456c", // Silencer
	"5a2c3a9486f774688b05e574", // NightVision
	"5d21f59b6dbe99052b54ef83", // ThermalVision
	"55818add4bdc2d5b648b456f", // Assault scope
	"55818ad54bdc2ddc698b4569", // Reflex sight
	"55818acf4bdc2dde698b456b", // Compact reflex sight
	"55818ac54bdc2d5b648b456e", // Ironsight
	"55818ae44bdc2dde698b456c", // Scope
	"55818aeb4bdc2ddc698b456a", // Special scope
	"5a74651486f7744e73386dd1", // AuxiliaryMod
	"55818afb4bdc2dde698b456d", // Bipod
	"55818b084bdc2d5b648b4571", // Flashlight
	"55818af64bdc2d5b648b4570", // Foregrip
	"56ea9461d2720b67698b456f", // Gas block
	"55818b0e4bdc2dde698b456e", // Laser designator
	"5448fe394bdc2d0d028b456c", // Muzzle device
	"55818b1d4bdc2d5b648b4572", // Rail covers
	"5448fe7a4bdc2d6f028b456b", // Sights
	"55818b164bdc2ddc698b456c", // Comb. tact. device
	"627a137bf21bc425b06ab944", // SpringDrivenCylinder
	"610720f290b75a49ff2e5e25", // CylinderMagazine
	"55818a6f4bdc2db9688b456b", // Charging handle
	"55818b014bdc2ddc698b456b", // UBGL
	"5448bc234bdc2d3c308b4569", // Magazine
	"55818b224bdc2dde698b456f", // Mount
	"55818a604bdc2db5418b457e", // Mag shaft
	"55818a594bdc2db9688b456a", // Stock
	"555ef6e44bdc2de9068b457e", // Barrel
	"55818a104bdc2db9688b4569", // Handguard
	"55818a684bdc2ddd698b456d", // Pistol grip
	"55818a304bdc2db5418b457d", // Receiver
	"550aa4154bdc2dd8348b456b", // Functional mod
	"55802f3e4bdc2de7118b4584", // Gear mod
	"55802f4a4bdc2ddb688b4569", // Essential mod
	"5448e53e4bdc2d60728b4567", // Backpack
	"566965d44bdc2d814c8b4571", // Loot container
	"5448bf274bdc2dfc2f8b456a", // Port. container
	"5448e5284bdc2dcb718b4567", // Chest rig
	"557596e64bdc2dc2118b4571", // Pockets
	"62f109593b54472778797866", // RandomLootContainer
	"6050cac987d3f925bf016837", // SortingTable
	"5447b5fc4bdc2d87278b4567", // Assault carbine
	"5447b5f14bdc2d61278b4567", // Assault rifle
	"5447bedf4bdc2d87278b4568", // Grenade launcher
	"5447bed64bdc2d97278b4568", // Machinegun
	"5447b6194bdc2d67278b4567", // Marksman rifle
	"5447b5cf4bdc2d65278b4567", // Handgun
	"617f1ef5e8b54b0998387733", // Revolver
	"5447b6094bdc2dc3278b4567", // Shotgun
	"5447b5e04bdc2d62278b4567", // SMG
	"5447b6254bdc2dc3278b4568", // Sniper rifle
	"5447bee84bdc2dc3278b4569", // Special weapon
	"543be5f84bdc2dd4348b456a", // Equipment
	"55d720f24bdc2d88028b456d", // Inventory
	"5671435f4bdc2d96058b4569", // Locking container
	"5448fe124bdc2da5018b4567", // Weapon mod
	"566168634bdc2d144c8b456c", // Searchable item
	"5795f317245977243854e041", // Common container
	"566abbb64bdc2d144c8b457d", // Stash
	"567583764bdc2d98058b456e", // Stationary cont.
	"5422acb9af1c889c16000029", // Weapon
	"5448e8d64bdc2dce718b4568", // Drink
	"5448e8d04bdc2ddf718b4569", // Food
	"5c99f98d86f7745c314214b3", // KeyMechanical
	"5c164d2286f774194c5e69fa", // Keycard
	"5448f3a14bdc2d27728b4569", // Drug
	"5448f39d4bdc2d0a728b4568", // Medikit
	"5448f3ac4bdc2dce718b4569", // Medical item
	"5448f3a64bdc2d60728b456a", // Stimulant
	"5f4fbaaca5573a5ac31db429", // Compass
	"61605ddea09d851a0a0c1bbc", // PortableRangeFinder
	"616eb7aea207f41933308f46", // RepairKits
	"5485a8684bdc2da71d8b4567", // Ammo
	"543be5cb4bdc2deb348b4568", // Ammo container
	"543be5dd4bdc2deb348b4569", // Money
	"5448eb774bdc2d0a728b4567", // Barter item
	"566162e44bdc2d3f298b4573", // Compound item
	"543be6674bdc2df1348b4569", // Food and drink
	"5448ecbe4bdc2d60728b4568", // Info
	"543be5e94bdc2df1348b4568", // Key
	"5447e1d04bdc2dff2f8b4567", // Knife
	"567849dd4bdc2d150f8b456e", // Map
	"543be5664bdc2dd4348b4569", // Meds
	"5447e0e74bdc2d3c308b4567", // Special item
	"5661632d4bdc2d903d8b456b", // Stackable item
	"543be6564bdc2df4348b4568", // Throwable weapon
]

const fleaBarterBlacklist = [
	// Blacklist for items that can be bartered with.
	// base classes IDs (parent IDs)
	// "54009119af1c881c07000029", // Item
	"5d650c3e815116009f6201d2", // Fuel
	// "57864ee62459775490116fc1", // Battery
	// "57864ada245977548638de91", // Building material
	// "57864a66245977548f04a81f", // Electronics
	// "57864c322459775490116fbf", // Household goods
	// "57864a3d24597754843f8721", // Jewelry
	// "57864e4c24597754843f8723", // Lubricant
	// "57864c8c245977548867e7f1", // Medical supplies
	// "590c745b86f7743cc433c5f2", // Other
	// "57864bb7245977548b3b66c2", // Tool
	"5448e54d4bdc2dcc718b4568", // Armor
	"5a341c4686f77469e155819e", // FaceCover
	"5a341c4086f77401f2541505", // Headwear
	"5448e5724bdc2ddf718b4568", // Vis. observ. device
	"5b3f15d486f77432d0509248", // ArmBand
	"57bef4c42459772e8d35a53b", // Armored equipment
	"5645bcb74bdc2ded0b8b4578", // Headphones
	"550aa4af4bdc2dd4348b456e", // Compensator
	"550aa4bf4bdc2dd6348b456b", // Flashhider
	"550aa4dd4bdc2dc9348b4569", // Comb. muzzle device
	"550ad14d4bdc2dd5348b456c", // PMS
	"550aa4cd4bdc2dd8348b456c", // Silencer
	"5a2c3a9486f774688b05e574", // NightVision
	"5d21f59b6dbe99052b54ef83", // ThermalVision
	"55818add4bdc2d5b648b456f", // Assault scope
	"55818ad54bdc2ddc698b4569", // Reflex sight
	"55818acf4bdc2dde698b456b", // Compact reflex sight
	"55818ac54bdc2d5b648b456e", // Ironsight
	"55818ae44bdc2dde698b456c", // Scope
	"55818aeb4bdc2ddc698b456a", // Special scope
	"5a74651486f7744e73386dd1", // AuxiliaryMod
	"55818afb4bdc2dde698b456d", // Bipod
	"55818b084bdc2d5b648b4571", // Flashlight
	"55818af64bdc2d5b648b4570", // Foregrip
	"56ea9461d2720b67698b456f", // Gas block
	"55818b0e4bdc2dde698b456e", // Laser designator
	"5448fe394bdc2d0d028b456c", // Muzzle device
	"55818b1d4bdc2d5b648b4572", // Rail covers
	"5448fe7a4bdc2d6f028b456b", // Sights
	"55818b164bdc2ddc698b456c", // Comb. tact. device
	"627a137bf21bc425b06ab944", // SpringDrivenCylinder
	"610720f290b75a49ff2e5e25", // CylinderMagazine
	"55818a6f4bdc2db9688b456b", // Charging handle
	"55818b014bdc2ddc698b456b", // UBGL
	"5448bc234bdc2d3c308b4569", // Magazine
	"55818b224bdc2dde698b456f", // Mount
	"55818a604bdc2db5418b457e", // Mag shaft
	"55818a594bdc2db9688b456a", // Stock
	"555ef6e44bdc2de9068b457e", // Barrel
	"55818a104bdc2db9688b4569", // Handguard
	"55818a684bdc2ddd698b456d", // Pistol grip
	"55818a304bdc2db5418b457d", // Receiver
	"550aa4154bdc2dd8348b456b", // Functional mod
	"55802f3e4bdc2de7118b4584", // Gear mod
	"55802f4a4bdc2ddb688b4569", // Essential mod
	"5448e53e4bdc2d60728b4567", // Backpack
	"566965d44bdc2d814c8b4571", // Loot container
	"5448bf274bdc2dfc2f8b456a", // Port. container
	"5448e5284bdc2dcb718b4567", // Chest rig
	"557596e64bdc2dc2118b4571", // Pockets
	"62f109593b54472778797866", // RandomLootContainer
	"6050cac987d3f925bf016837", // SortingTable
	"5447b5fc4bdc2d87278b4567", // Assault carbine
	"5447b5f14bdc2d61278b4567", // Assault rifle
	"5447bedf4bdc2d87278b4568", // Grenade launcher
	"5447bed64bdc2d97278b4568", // Machinegun
	"5447b6194bdc2d67278b4567", // Marksman rifle
	"5447b5cf4bdc2d65278b4567", // Handgun
	"617f1ef5e8b54b0998387733", // Revolver
	"5447b6094bdc2dc3278b4567", // Shotgun
	"5447b5e04bdc2d62278b4567", // SMG
	"5447b6254bdc2dc3278b4568", // Sniper rifle
	"5447bee84bdc2dc3278b4569", // Special weapon
	"543be5f84bdc2dd4348b456a", // Equipment
	"55d720f24bdc2d88028b456d", // Inventory
	"5671435f4bdc2d96058b4569", // Locking container
	"5448fe124bdc2da5018b4567", // Weapon mod
	"566168634bdc2d144c8b456c", // Searchable item
	"5795f317245977243854e041", // Common container
	"566abbb64bdc2d144c8b457d", // Stash
	"567583764bdc2d98058b456e", // Stationary cont.
	"5422acb9af1c889c16000029", // Weapon
	// "5448e8d64bdc2dce718b4568", // Drink
	// "5448e8d04bdc2ddf718b4569", // Food
	"5c99f98d86f7745c314214b3", // KeyMechanical
	"5c164d2286f774194c5e69fa", // Keycard
	// "5448f3a14bdc2d27728b4569", // Drug
	// "5448f39d4bdc2d0a728b4568", // Medikit
	// "5448f3ac4bdc2dce718b4569", // Medical item
	"5448f3a64bdc2d60728b456a", // Stimulant
	"5f4fbaaca5573a5ac31db429", // Compass
	"61605ddea09d851a0a0c1bbc", // PortableRangeFinder
	// "616eb7aea207f41933308f46", // RepairKits
	"5485a8684bdc2da71d8b4567", // Ammo
	"543be5cb4bdc2deb348b4568", // Ammo container
	"543be5dd4bdc2deb348b4569", // Money
	// "5448eb774bdc2d0a728b4567", // Barter item
	"566162e44bdc2d3f298b4573", // Compound item
	// "543be6674bdc2df1348b4569", // Food and drink
	// "5448ecbe4bdc2d60728b4568", // Info
	"543be5e94bdc2df1348b4568", // Key
	"5447e1d04bdc2dff2f8b4567", // Knife
	"567849dd4bdc2d150f8b456e", // Map
	// "543be5664bdc2dd4348b4569", // Meds
	"5447e0e74bdc2d3c308b4567", // Special item
	"5661632d4bdc2d903d8b456b", // Stackable item
	"543be6564bdc2df4348b4568", // Throwable weapon
]

const questKeys = [
	// Whitelist for quest keys
	"59387a4986f77401cc236e62", // Dorm room 114 key
	// "5938603e86f77435642354f4", // Dorm room 206 key
	// "5938504186f7740991483f30", // Dorm room 203 key
	"5780cf942459777df90dcb72", // Dorm room 214 key
	"5780cfa52459777dfb276eb1", // Dorm room 220 key
	"593aa4be86f77457f56379f8", // Dorm room 303 key
	// "5780cf7f2459777de4559322", // Dorm room 314 marked key, lol, nope
	// "5937ee6486f77408994ba448", // Machinery key
	// "5780d0532459777a5108b9a2", // Tarcone Director's office key
	"5938144586f77473c2087145", // Portable bunkhouse key
	// "5913611c86f77479e0084092", // Trailer park portable cabin key
	// "593962ca86f774068014d9af", // Unknown key
	"5448ba0b4bdc2d02308b456c", // Factory emergency exit key
	"5ad5cfbd86f7742c825d6104", // OLI logistics department office key
	"5ad5db3786f7743568421cce", // EMERCOM medical unit key
	"5ad7247386f7747487619dc3", // Goshan cash register key
	// "5c94bbff86f7747ee735c08f", // TerraGroup Labs access keycard
	"5efde6b4f5448336730dbd61", // Keycard with a blue marking
	"5c1d0c5f86f7744bb2683cf0", // TerraGroup Labs keycard (Blue)
	"5c1d0dc586f7744baf2e7b79", // TerraGroup Labs keycard (Green)
	"62987c658081af308d7558c6", // Radar station commandant room key
	"62987da96188c076bc0d8c51", // Operating room key
	"5d947d4e86f774447b415895", // RB-KSM key
	"5d80c6c586f77440351beef1", // RB-OB key
	"5d80ccac86f77470841ff452", // RB-ORB1 key
	"5d80ccdd86f77474f7575e02", // RB-ORB2 key
	"5d80cd1a86f77402aa362f42", // RB-ORB3 key
	"5d947d3886f774447b415893", // RB-SMP key
	"5d9f1fa686f774726974a992", // RB-ST key
	"5a0448bc86f774736f14efa8", // Key to the closed premises of the Health Resort
	"5a0eb6ac86f7743124037a28", // Cottage back door key
	"5a0ea79b86f7741d4a35298e", // Health Resort universal utility room key
	"5a0dc95c86f77452440fc675", // Health Resort west wing office room 112 key
	"5a0ee30786f774023b6ee08f", // Health Resort west wing room 216 key
	"5a13ef0686f7746e5a411744", // Health Resort west wing room 219 key
	"5a0ee34586f774023b6ee092", // Health Resort west wing room 220 key
	"5a13f46386f7741dd7384b04", // Health Resort west wing room 306 key
	"5eff09cd30a7dc22fd1ddfed", // Health Resort office key with a blue tape
	"5a145d4786f7744cbb6f4a12", // Health Resort east wing room 306 key
	"5a145d7b86f7744cbb6f4a13", // Health Resort east wing room 308 key
	"5a0eee1486f77402aa773226", // Health Resort east wing room 328 key
	"591afe0186f77431bd616a11", // ZB-014 key
	// "5d08d21286f774736e7c94c3", // Shturman's stash key
]

const itemWhitelist = [
	// Whitelist for items that can be bartered FOR on flea, outside of fleaWhitelist categories
	"60363c0c92ec1c31037959f5", // GP-7 gas mask
	"5fd4c5477a8d854fa0105061", // Security vest
	"5f5e45cc5021ce62144be7aa", // LolKek 3F Transfer tourist backpack
	"5780cf722459777a5108b9a1", // Dorm room 308 key
	"59e770b986f7742cbd762754", // Anti-fragmentation glasses
	"572b7fa524597762b747ce82", // Lower half-mask
	"5b4329075acfc400153b78ff", // Pompon hat
	"59e7708286f7742cbd762753", // Ushanka ear flap hat
	"5e54f79686f7744022011103", // Pestily plague mask
	"5b4326435acfc433000ed01d", // Neoprene mask
	"5b432c305acfc40019478128", // GP-5 gas mask
	"5aa2b923e5b5b000137b7589", // Round frame sunglasses
	"5c0d2727d174af02a012cf58", // PSh-97 DJETA riot helmet
	"57e26fc7245977162a14b800", // Bars A-2607 95H18 knife
	"57e26ea924597715ca604a09", // Bars A-2607 Damascus knife
	"61c18db6dfd64163ea78fbb4", // Leather cap
	"56e33634d2720bd8058b456b", // Duffle bag
	"5f60cd6cf2bcbb675b00dac6", // Walker's XCEL 500BT Digital headset
	"5c165d832e2216398b5a7e36", // Peltor Tactical Sport headset
	"5e4d34ca86f774264f758330", // Walker's Razor Digital headset
	"628e4e576d783146b124c64d", // Peltor ComTac 4 Hybrid
]

const BSGblacklist = [
	// BSGblacklist, hardcoded for safety, NEED TO UPDATE ON NEW PATCHES!!!!!!!
	"59faff1d86f7746c51718c9c", // Physical bitcoin
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red)
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver)
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet)
	"59f32bb586f774757e1e8442", // Dogtag BEAR
	"59f32c3b86f77472a31742f0", // Dogtag USEC
	"619bc61e86e01e16f839a999", // Alpha armband
	"619bddc6c9546643a67df6ee", // DEADSKUL armband
	"619bddffc9546643a67df6f0", // Train Hard armband
	"619bde3dc9546643a67df6f2", // Kiba Arms armband
	"619bdeb986e01e16f839a99e", // RFARMY armband
	"619bdf9cc9546643a67df6f8", // UNTAR armband
	"5ab8e79e86f7742d8b372e78", // BNTI Gzhel-K body armor
	"545cdb794bdc2d3a198b456a", // 6B43 6A Zabralo-Sh body armor
	"5c0e541586f7747fa54205c9", // 6B13 M modified assault armor (Tan)
	"5fd4c474dd870108a754b241", // 5.11 Tactical Hexgrid plate carrier
	"60a283193cb70855c43a381d", // NFM THOR Integrated Carrier body armor
	"5e9dacf986f774054d6b89f4", // FORT Defender-2 body armor
	"5b44cd8b86f774503d30cba2", // IOTV Gen4 body armor (full protection)
	"5b44cf1486f77431723e3d05", // IOTV Gen4 body armor (assault kit)
	"5b44d0de86f774503d30cba8", // IOTV Gen4 body armor (high mobility kit)
	"5f5f41476bdad616ad46d631", // NPP KlASS Korund-VM body armor
	"5ca2151486f774244a3b8d30", // FORT Redut-M body armor
	"5ca21c6986f77479963115a7", // FORT Redut-T5 body armor
	"5e4abb5086f77406975c9342", // LBT-6094A Slick Plate Carrier
	"6038b4ca92ec1c3103795a0d", // LBT-6094A Slick Plate Carrier (Olive)
	"6038b4b292ec1c3103795a0b", // LBT-6094A Slick Plate Carrier (Tan)
	"5c0e625a86f7742d77340f62", // BNTI Zhuk-6a body armor
	"62963c18dbc8ab5f0d382d0b", // Death Knight mask
	"62a61bbf8ec41a51b34758d2", // Big Pipe's smoking pipe
	"60a7ad3a0c5cb24b0134664a", // Tagilla's welding mask "Gorilla"
	"60a7ad2a2198820d95707a2e", // Tagilla's welding mask "UBEY"
	"5f60c74e3b85f6263c145586", // Rys-T bulletproof helmet
	"5a154d5cfcdbcb001a3b00da", // Ops-Core FAST MT Super High Cut helmet (Black)
	"5aa7e276e5b5b000171d0647", // Altyn bulletproof helmet
	"5ac8d6885acfc400180ae7b0", // Ops-Core FAST MT Super High Cut helmet (Tan)
	"5c091a4e0db834001d5addc8", // Maska-1SCh bulletproof helmet (Olive Drab)
	"5ca20ee186f774799474abc2", // Vulkan-5 (LShZ-5) bulletproof helmet
	"5c17a7ed2e2216152142459c", // Crye Precision AirFrame helmet (Tan)
	"5f60b34a41e30a4ab12a6947", // Galvion Caiman Hybrid helmet
	"5c0e874186f7745dc7616606", // Maska-1SCh bulletproof helmet (Killa)
	"5e00c1ad86f774747333222c", // Team Wendy EXFIL Ballistic Helmet (Black)
	"5e01ef6886f77445f643baa4", // Team Wendy EXFIL Ballistic Helmet (Coyote Brown)
	"5f60c85b58eff926626a60f7", // Rys-T face shield
	"5ca2113f86f7740b2547e1d2", // Vulkan-5 face shield
	"5a16b7e1fcdbcb00165aa6c9", // Ops-Core FAST multi-hit ballistic face shield
	"5c0919b50db834001b7ce3b9", // Maska-1SCh face shield (Olive Drab)
	"5e01f37686f774773c6f6c15", // Team Wendy EXFIL Ballistic face shield (Coyote Brown)
	"5e00cdd986f7747473332240", // Team Wendy EXFIL Ballistic face shield (Black)
	"5c0558060db834001b735271", // GPNVG-18 Night Vision goggles
	"5d1b5e94d7ad1a2b865a96b0", // FLIR RS-32 2.25-9x 35mm 60Hz thermal riflescope
	"5a1eaa87fcdbcb001865f75e", // Trijicon REAP-IR thermal scope
	"5cfe8010d7ad1a59283b14c6", // AK 7.62x39 X Products X-47 50-round drum magazine
	"5c6175362e221600133e3b94", // AK 7.62x39 ProMag AK-A-16 73-round drum magazine
	"59c1383d86f774290a37e0ca", // 5.56x45 Magpul PMAG D-60 STANAG 60-round magazine
	"544a37c44bdc2d25388b4567", // 5.56x45 SureFire MAG5-60 STANAG 60-round magazine
	"5ab8ebf186f7742d8b372e80", // SSO Attack 2 raid backpack
	"5c0e805e86f774683f3dd637", // 3V Gear Paratus 3-Day Operator's Tactical backpack
	"61b9e1aaef9a1b5d6a79899a", // Santa's bag
	"5f5e46b96bdad616ad46d613", // Eberlestock F4 Terminator load bearing backpack (Tiger Stripe)
	"59e763f286f7742ee57895da", // Pilgrim tourist backpack
	"6034d2d697633951dc245ea6", // Eberlestock G2 Gunslinger II backpack (Dry Earth)
	"5df8a4d786f77412672a1e3b", // 6Sh118 raid backpack
	"5c0e774286f77468413cc5b2", // Mystery Ranch Blackjack 50 backpack (Multicam)
	"5857a8b324597729ab0a0e7d", // Secure container Beta
	"5c0a794586f77461c458f892", // Secure container Boss
	"5c0a5a5986f77476aa30ae64", // Developer container
	"59db794186f77448bc595262", // Secure container Epsilon
	"5857a8bc2459772bad15db29", // Secure container Gamma
	"5c093ca986f7740a1867ab12", // Secure container Kappa
	"544a11ac4bdc2d470e8b456a", // Secure container Alpha
	"5732ee6a24597719ae0c0281", // Waist pouch
	"627a4e6b255f7527fb05a0f6", // Карманы 1 на 4 со спец слотами
	"557ffd194bdc2d28148b457f", // Pockets
	"60c7272c204bc17802313365", // Pockets 1x3
	"5af99e9186f7747c447120b8", // Pockets Large
	"61bcc89aef0f505f0c6cd0fc", // FirstSpear Strandhogg plate carrier rig (Ranger Green)
	"5d5d87f786f77427997cfaef", // Ars Arma A18 Skanda plate carrier
	"544a5caa4bdc2d1a388b4568", // Crye Precision AVS plate carrier
	"628d0618d1ba6e4fa07ce5a4", // NPP KlASS Bagariy armored rig
	"5e4ac41886f77406a511c9a8", // Ars Arma CPC MOD.2 plate carrier
	"5c0e746986f7741453628fe5", // WARTECH TV-110 plate carrier rig
	"628dc750b910320f4c27a732", // ECLiPSE RBAV-AF plate carrier (Ranger Green)
	"61bc85697113f767765c7fe7", // Eagle Industries MMAC plate carrier (Ranger Green)
	"609e860ebd219504d8507525", // Crye Precision AVS MBAV (Tagilla Edition)
	"628b9784bcf6e2659e09b8a2", // S&S Precision PlateFrame plate carrier (Goons Edition)
	"628b9c7d45122232a872358f", // Crye Precision CPC plate carrier (Goons Edition)
	"5b44cad286f77402a54ae7e5", // 5.11 Tactical TacTec plate carrier
	"60a3c70cde5f453f634816a3", // CQC Osprey MK4A plate carrier (Assault, MTP)
	"60a3c68c37ea821725773ef5", // CQC Osprey MK4A plate carrier (Protection, MTP)
	"628cd624459354321c4b7fa2", // Tasmanian Tiger SK plate carrier (Multicam Black)
	"5c0a840b86f7742ffa4f2482", // T H I C C item case
	"5b7c710788a4506dec015957", // Lucky Scav Junk box
	"5b6d9ce188a4501afc1b2b25", // T H I C C Weapon case
	"6183afd850224f204c1da514", // FN SCAR-H 7.62x51 assault rifle
	"606587252535c57a13424cfd", // CMMG Mk47 Mutant 7.62x39 assault rifle
	"5dcbd56fdbd3d91b3e5468d5", // Desert Tech MDR 7.62x51 assault rifle
	"6165ac306ef05c2ce828ef74", // FN SCAR-H 7.62x51 assault rifle (FDE)
	"628a60ae6b1d481ff772e9c8", // Rifle Dynamics RD-704 7.62x39 assault rifle
	"5e81ebcd8e146c7080625e15", // FN40GL Mk2 grenade launcher
	"6217726288ed9f0845317459", // RSP-30 reactive signal cartridge (Green)
	"62178c4d4ecf221597654e3d", // RSP-30 reactive signal cartridge (Red)
	"624c0b3340357b5f566e8766", // RSP-30 reactive signal cartridge (Yellow)
	"620109578d82e67e7911abf2", // ZiD SP-81 26x75 signal pistol
	"6176aca650224f204c1da3fb", // HK G28 7.62x51 marksman rifle
	"5df8ce05b11454561e39243b", // Knight's Armament Company SR-25 7.62x51 marksman rifle
	"5a367e5dc4a282000e49738f", // Remington R11 RSASS 7.62x51 marksman rifle
	"5aafa857e5b5b00018480968", // Springfield Armory M1A 7.62x51 rifle
	"5fc22d7c187fea44d52eda44", // SWORD International Mk-18 .338 LM marksman rifle
	"6275303a9f372d6ea97f9ec7", // M32A1 MSGL 40mm grenade launcher
	"5e848cc2988a8701445df1e8", // TOZ KS-23M 23x75mm pump-action shotgun
	"627e14b21713922ded6f2c15", // Accuracy International AXMC .338 LM bolt-action sniper rifle
	"5c94bbff86f7747ee735c08f", // TerraGroup Labs access keycard
	"5efb0cabfb3e451d70735af5", // .45 ACP AP (70/38)
	"5d6e68a8a4b9360b6c0d54e2", // 12/70 AP-20 armor-piercing slug (164/37)
	"5d6e68b3a4b9361bca7e50b5", // 12/70 Copper Sabot Premier HP slug (206/14)
	"5d6e68d1a4b93622fe60e845", // 12/70 SuperFormance HP slug (220/5)
	"5e85a9f4add9fe03027d9bf1", // 23x75mm "Zvezda" flashbang round (0/0)
	"62389aaba63f32501b1b444f", // 26x75mm flare cartridge (Green) (37/0)
	"62389ba9a63f32501b1b4451", // 26x75mm flare cartridge (Red) (37/0)
	"62389be94d5d474bf712e709", // 26x75mm flare cartridge (Yellow) (37/0)
	"5f0c892565703e5c461894e9", // 40x46mm M433 (HEDP) grenade
	"5ede47405b097655935d7d16", // 40x46mm M441 (HE) grenade
	"5ba26835d4351e0035628ff5", // 4.6x30mm AP SX (35/53)
	"5ba26844d4351e00334c9475", // 4.6x30mm Subsonic SX (45/36)
	"5c0d5e4486f77478390952fe", // 5.45x39mm PPBS gs "Igolnik" (37/62)
	"61962b617c6c7b169525f168", // 5.45x39mm 7N40 (52/44)
	"56dff026d2720bb8668b4567", // 5.45x39mm BS gs (40/51)
	"56dff061d2720bb5668b4567", // 5.45x39mm BT gs (42/40)
	"54527ac44bdc2d36668b4567", // 5.56x45mm M855A1 (49/44)
	"59e6906286f7746c9f75e847", // 5.56x45mm M856A1 (54/37)
	"59e690b686f7746c9f75e848", // 5.56x45mm M995 (42/53)
	"601949593ae8f707c4608daa", // 5.56x45mm SSA AP (38/57)
	"5cc80f67e4a949035e43bbba", // 5.7x28mm SB193 (54/35)
	"5cc80f38e4a949001152b560", // 5.7x28mm SS190 (49/37)
	"5fd20ff893a8961fc660a954", // .300 Blackout AP (51/48)
	"59e0d99486f7744a32234762", // 7.62x39mm BP gzh (58/47)
	"601aa3d2b2bcb34913271e6d", // 7.62x39mm MAI AP (47/58)
	"5a6086ea4f39f99cd479502f", // 7.62x51mm M61 (70/64)
	"5a608bf24f39f98ffc77720e", // 7.62x51mm M62 Tracer (79/44)
	"5efb0c1bd79ff02a1f5e68d9", // 7.62x51mm M993 (67/70)
	"5e023d34e8a400319a28ed44", // 7.62x54mm R BT gzh (78/55)
	"5e023d48186a883be655e551", // 7.62x54mm R BS gs (72/70)
	"560d61e84bdc2da74d8b4571", // 7.62x54mm R SNB gzh (75/62)
	"5fc382a9d724d907e2077dab", // .338 Lapua Magnum AP (115/79)
	"5fc275cf85fd526b824a571a", // .338 Lapua Magnum FMJ (122/47)
	"5fc382b6d6fa9c00c571bbc3", // .338 Lapua Magnum TAC-X (196/18)
	"5efb0da7a29a85116f6ea05f", // 9x19mm PBP gzh (52/39)
	"5c925fa22e221601da359b7b", // 9x19mm AP 6.3 (52/30)
	"5c0d688c86f77413ae3407b2", // 9x39mm BP gs (60/55)
	"57a0e5022459774d1673f889", // 9x39mm SP-6 gs (58/46)
	"5c0d668f86f7747ccb7f13b2", // 9x39mm SPP gs (68/40)
	"635267f063651329f75a4ee8", // 26x75mm distress signal flare (poison green) (37/0)
	"57372bd3245977670b7cd243", // 5.45x39mm BS gs ammo pack (30 pcs)
	"57372c89245977685d4159b1", // 5.45x39mm BT gs ammo pack (30 pcs)
	"57372b832459776701014e41", // 5.45x39mm BS gs ammo pack (120 pcs)
	"5c1260dc86f7746b106e8748", // 9x39mm BP gs ammo pack (8 pcs)
	"57372c21245977670937c6c2", // 5.45x39mm BT gs ammo pack (120 pcs)
	"5c1262a286f7743f8a69aab2", // 5.45x39mm PPBS gs "Igolnik" ammo pack (30 pcs)
	"57372bad245977670b7cd242", // 5.45x39mm BS gs ammo pack (120 pcs)
	"57372c56245977685e584582", // 5.45x39mm BT gs ammo pack (120 pcs)
	// "5696686a4bdc2da3298b456a", // Dollars
	// "569668774bdc2da2298b4568", // Euros
	// "5449016a4bdc2d6f028b456f", // Roubles
	"617fd91e5539a84ec44ce155", // RGN hand grenade
	"618a431df1eb8e24b8741deb", // RGO hand grenade
]

const scavcaseWhitelist = [
	// Whitelist for scav case rewards (base class IDs), those are ALWAYS INCLUDED IN REWARDS
	"54009119af1c881c07000029", // Item
	"5d650c3e815116009f6201d2", // Fuel
	"57864ee62459775490116fc1", // Battery
	"57864ada245977548638de91", // Building material
	"57864a66245977548f04a81f", // Electronics
	"57864c322459775490116fbf", // Household goods
	"57864a3d24597754843f8721", // Jewelry
	"57864e4c24597754843f8723", // Lubricant
	"57864c8c245977548867e7f1", // Medical supplies
	"590c745b86f7743cc433c5f2", // Other
	"57864bb7245977548b3b66c2", // Tool
	"5448e54d4bdc2dcc718b4568", // Armor
	// "5a341c4686f77469e155819e", // FaceCover
	// "5a341c4086f77401f2541505", // Headwear
	// "5448e5724bdc2ddf718b4568", // Vis. observ. device
	// "5b3f15d486f77432d0509248", // ArmBand
	"57bef4c42459772e8d35a53b", // Armored equipment
	"5645bcb74bdc2ded0b8b4578", // Headphones
	"550aa4af4bdc2dd4348b456e", // Compensator
	// "550aa4bf4bdc2dd6348b456b", // Flashhider
	// "550aa4dd4bdc2dc9348b4569", // Comb. muzzle device
	"550ad14d4bdc2dd5348b456c", // PMS
	"550aa4cd4bdc2dd8348b456c", // Silencer
	"5a2c3a9486f774688b05e574", // NightVision
	"5d21f59b6dbe99052b54ef83", // ThermalVision
	"55818add4bdc2d5b648b456f", // Assault scope
	"55818ad54bdc2ddc698b4569", // Reflex sight
	"55818acf4bdc2dde698b456b", // Compact reflex sight
	// "55818ac54bdc2d5b648b456e", // Ironsight
	"55818ae44bdc2dde698b456c", // Scope
	"55818aeb4bdc2ddc698b456a", // Special scope
	// "5a74651486f7744e73386dd1", // AuxiliaryMod
	// "55818afb4bdc2dde698b456d", // Bipod
	"55818b084bdc2d5b648b4571", // Flashlight
	"55818af64bdc2d5b648b4570", // Foregrip
	// "56ea9461d2720b67698b456f", // Gas block
	"55818b0e4bdc2dde698b456e", // Laser designator
	// "5448fe394bdc2d0d028b456c", // Muzzle device
	"55818b1d4bdc2d5b648b4572", // Rail covers
	"5448fe7a4bdc2d6f028b456b", // Sights
	"55818b164bdc2ddc698b456c", // Comb. tact. device
	// "627a137bf21bc425b06ab944", // SpringDrivenCylinder
	// "610720f290b75a49ff2e5e25", // CylinderMagazine
	// "55818a6f4bdc2db9688b456b", // Charging handle
	"55818b014bdc2ddc698b456b", // UBGL
	// "5448bc234bdc2d3c308b4569", // Magazine
	// "55818b224bdc2dde698b456f", // Mount
	"55818a604bdc2db5418b457e", // Mag shaft
	// "55818a594bdc2db9688b456a", // Stock
	// "555ef6e44bdc2de9068b457e", // Barrel
	// "55818a104bdc2db9688b4569", // Handguard
	// "55818a684bdc2ddd698b456d", // Pistol grip
	// "55818a304bdc2db5418b457d", // Receiver
	"550aa4154bdc2dd8348b456b", // Functional mod
	"55802f3e4bdc2de7118b4584", // Gear mod
	"55802f4a4bdc2ddb688b4569", // Essential mod
	"5448e53e4bdc2d60728b4567", // Backpack
	// "566965d44bdc2d814c8b4571", // Loot container
	// "5448bf274bdc2dfc2f8b456a", // Port. container
	"5448e5284bdc2dcb718b4567", // Chest rig
	"557596e64bdc2dc2118b4571", // Pockets
	"62f109593b54472778797866", // RandomLootContainer
	"6050cac987d3f925bf016837", // SortingTable
	"5447b5fc4bdc2d87278b4567", // Assault carbine
	"5447b5f14bdc2d61278b4567", // Assault rifle
	"5447bedf4bdc2d87278b4568", // Grenade launcher
	"5447bed64bdc2d97278b4568", // Machinegun
	"5447b6194bdc2d67278b4567", // Marksman rifle
	"5447b5cf4bdc2d65278b4567", // Handgun
	"617f1ef5e8b54b0998387733", // Revolver
	"5447b6094bdc2dc3278b4567", // Shotgun
	"5447b5e04bdc2d62278b4567", // SMG
	"5447b6254bdc2dc3278b4568", // Sniper rifle
	"5447bee84bdc2dc3278b4569", // Special weapon
	"543be5f84bdc2dd4348b456a", // Equipment
	"55d720f24bdc2d88028b456d", // Inventory
	"5671435f4bdc2d96058b4569", // Locking container
	"5448fe124bdc2da5018b4567", // Weapon mod
	"566168634bdc2d144c8b456c", // Searchable item
	"5795f317245977243854e041", // Common container
	"566abbb64bdc2d144c8b457d", // Stash
	"567583764bdc2d98058b456e", // Stationary cont.
	"5422acb9af1c889c16000029", // Weapon
	"5448e8d64bdc2dce718b4568", // Drink
	"5448e8d04bdc2ddf718b4569", // Food
	"5c99f98d86f7745c314214b3", // KeyMechanical
	"5c164d2286f774194c5e69fa", // Keycard
	"5448f3a14bdc2d27728b4569", // Drug
	"5448f39d4bdc2d0a728b4568", // Medikit
	"5448f3ac4bdc2dce718b4569", // Medical item
	"5448f3a64bdc2d60728b456a", // Stimulant
	"5f4fbaaca5573a5ac31db429", // Compass
	"61605ddea09d851a0a0c1bbc", // PortableRangeFinder
	"616eb7aea207f41933308f46", // RepairKits
	"5485a8684bdc2da71d8b4567", // Ammo
	"543be5cb4bdc2deb348b4568", // Ammo container
	"543be5dd4bdc2deb348b4569", // Money
	"5448eb774bdc2d0a728b4567", // Barter item
	"566162e44bdc2d3f298b4573", // Compound item
	"543be6674bdc2df1348b4569", // Food and drink
	"5448ecbe4bdc2d60728b4568", // Info
	"543be5e94bdc2df1348b4568", // Key
	"5447e1d04bdc2dff2f8b4567", // Knife
	"567849dd4bdc2d150f8b456e", // Map
	"543be5664bdc2dd4348b4569", // Meds
	"5447e0e74bdc2d3c308b4567", // Special item
	"5661632d4bdc2d903d8b456b", // Stackable item
	"543be6564bdc2df4348b4568", // Throwable weapon
]

const scavcaseItemBlacklist = [
	// Blacklist (itemIDs) to always exclude items from reward list
	"634959225289190e5e773b3b", // Pumpkin with sweets
	"59f32bb586f774757e1e8442", // Dogtag BEAR
	"59f32c3b86f77472a31742f0", // Dogtag USEC
	"62963c18dbc8ab5f0d382d0b", // Death Knight mask
	"62a61bbf8ec41a51b34758d2", // Big Pipe's smoking pipe
	"60a7ad3a0c5cb24b0134664a", // Tagilla's welding mask "Gorilla"
	"60a7ad2a2198820d95707a2e", // Tagilla's welding mask "UBEY"
	"5c0e874186f7745dc7616606", // Maska-1SCh bulletproof helmet (Killa)
	"60a7acf20c5cb24b01346648", // BOSS cap
	"5c0e842486f77443a74d2976", // Maska-1SCh face shield (Killa)
	"628e4dd1f477aa12234918aa", // Big Pipe's bandana
	"58ac60eb86f77401897560ff", // Balaclava_dev
	"5b3b713c5acfc4330140bd8d", // TT-33 7.62x25 TT pistol (Golden)
	"628b9784bcf6e2659e09b8a2", // S&S Precision PlateFrame plate carrier (Goons Edition)
	"628b9c7d45122232a872358f", // Crye Precision CPC plate carrier (Goons Edition)
	"609e860ebd219504d8507525", // Crye Precision AVS MBAV (Tagilla Edition)
	"59ef13ca86f77445fd0e2483", // Jack-o'-lantern tactical pumpkin helmet
	"5943d9c186f7745a13413ac9", // Shrapnel
	"5996f6d686f77467977ba6cc", // F1 Shrapnel
	"5996f6cb86f774678763a6ca", // RGD-5 Shrapnel
	"5996f6fc86f7745e585b4de3", // M67 Shrapnel
	"5df8a6a186f77412640e2e80", // Christmas tree ornament (Red)
	"5df8a72c86f77412640e2e83", // Christmas tree ornament (Silver)
	"5df8a77486f77412672a1e3f", // Christmas tree ornament (Violet)
	"5c0e541586f7747fa54205c9", // 6B13 M modified assault armor (Tan) (Killa)
	"628bc7fb408e2b2e9c0801b1", // Mystery Ranch NICE COMM 3 BVS frame system
]

class Mod implements IPostDBLoadMod {
	public postDBLoad(container: DependencyContainer): void {
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
		const configServer = container.resolve<ConfigServer>("ConfigServer")
		// const ObjectId = container.resolve<ObjectId>("ObjectId") // [Debug]
		const tables = databaseServer.getTables()
		const locales = tables.locales.global
		const items = tables.templates.items
		const handbook = tables.templates.handbook
		const prices = tables.templates.prices
		const globals = tables.globals.config
		const traderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		const hideoutConfig = configServer.getConfig<IHideoutConfig>(ConfigTypes.HIDEOUT)
		const insuranceConfig = configServer.getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE)
		const scavcaseConfig = configServer.getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE)
		const prapor = tables.traders["54cb50c76803fa8b248b4571"]
		const therapist = tables.traders["54cb57776803fa99248b456e"]
		const ragman = tables.traders["5ac3b934156ae10c4430e83c"]
		const jaeger = tables.traders["5c0647fdd443bc2504c2d371"]
		const mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"]
		const peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"]
		const skier = tables.traders["58330581ace78e27b8b10cee"]
		const traderlist = [prapor, therapist, ragman, jaeger, mechanic, peacekeeper, skier]

		if (config.ScavCaseOptions.enabled) {
			if (config.ScavCaseOptions.BetterRewards.enabled) {
				// buyableitems generator, to make sure rare unbuyable items always are in reward pool (eg anodised red gear)
				let buyableitems = new Set()
				for (const trader of traderlist) {
					trader.assort.items.filter((x) => buyableitems.add(x._tpl))
				}

				// Shitlist generator for scav case rewards. Filters A LOT of crap out, but very conservatevely. Blacklist included in ./docs folder check it out.
				// Always includes items in carefully curated whitelist. Always includes unbuyable and/or cheap items not included in whitelist (such as anodized red gear, but also some crap like scav only hats). Always includes items worth > 10000. Filters everything else out. Spent a lot of time thinking about this, really proud of myself. In the end, just makes sure you almost always get something of valuable or usable.
				// let scavWhitelist = [] // [Debug] used for debug code below
				for (const i in items) {
					const item = items[i]
					if (item._type == "Item") {
						const itemInHandbook = getItemInHandbook(item._id)
						if (
							(itemInHandbook?.Price >= 10000 || scavcaseWhitelist.includes(item._parent) || !buyableitems.has(item._id)) &&
							!scavcaseItemBlacklist.includes(item._id) &&
							item._props.QuestItem != true &&
							itemInHandbook?.Price != undefined
							// && !scavcaseConfig.rewardItemParentBlacklist.includes(item._parent) // [Debug] not actually needed, used only for reference when generating black/whitelists. Ignore(? TODO: look into it) ammo and money here, they are a special case in SPI-AKI logic.
						) {
							// whitelist here, do nothing.
							// scavWhitelist.push(item._id) // [Debug] used for debug code below
							// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
						} else {
							scavcaseConfig.rewardItemBlacklist.push(item._id)
							// shitlist here.
							// log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
						}
					}
				}
			}

			if (config.ScavCaseOptions.Rebalance.enabled) {
				scavcaseConfig.rewardItemValueRangeRub = {
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

				const scavCaseRedone = [
					{
						_id: "62710974e71632321e5afd5f",
						ProductionTime: 2500,
						Requirements: [
							{
								templateId: "62a09f32621468534a797acb", // Pevko, T1 62a09f32621468534a797acb
								count: 1,
								isFunctional: false,
								type: "Item",
							},
						],
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "0",
								max: "0",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
					},
					{
						_id: "62710a8c403346379e3de9be",
						ProductionTime: 7700,
						Requirements: [
							{
								templateId: "5d40407c86f774318526545a", // Vodka T2 5d40407c86f774318526545a
								count: 1,
								isFunctional: false,
								type: "Item",
							},
						],
						EndProducts: {
							Common: {
								min: "3",
								max: "4",
							},
							Rare: {
								min: "0",
								max: "1",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
					},
					{
						_id: "62710a69adfbd4354d79c58e",
						ProductionTime: 8100,
						Requirements: [
							{
								templateId: "5d403f9186f7743cac3f229b", // Whisky T3 5d403f9186f7743cac3f229b
								count: 1,
								isFunctional: false,
								type: "Item",
							},
						],
						EndProducts: {
							Common: {
								min: "4",
								max: "5",
							},
							Rare: {
								min: "1",
								max: "2",
							},
							Superrare: {
								min: "0",
								max: "0",
							},
						},
					},
					{
						_id: "6271093e621b0a76055cd61e",
						ProductionTime: 16800,
						Requirements: [
							{
								templateId: "5d1b376e86f774252519444e", // Moonshine
								count: 1,
								isFunctional: false,
								type: "Item",
							},
						],
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "0",
								max: "3",
							},
							Superrare: {
								min: "1",
								max: "2",
							},
						},
					},
					{
						_id: "62710a0e436dcc0b9c55f4ec",
						ProductionTime: 19200,
						Requirements: [
							{
								templateId: "5c12613b86f7743bbe2c3f76", // Intel
								count: 1,
								isFunctional: false,
								type: "Item",
							},
						],
						EndProducts: {
							Common: {
								min: "2",
								max: "3",
							},
							Rare: {
								min: "3",
								max: "5",
							},
							Superrare: {
								min: "0",
								max: "1",
							},
						},
					},
				]

				tables.hideout.scavcase = scavCaseRedone // mi donta undestanda tem red wavy lines, tis bad? tis worka! tis gooda! donta cera wavy lines.
			}
			if (config.ScavCaseOptions.FasterScavcase.enabled) {
				tables.hideout.scavcase.forEach((x) => (x.ProductionTime /= config.ScavCaseOptions.FasterScavcase.SpeedMultiplier))
			}
			if (false) {
				// "if" for convenience during editing, to hide this debug block in IDE
				//
				// Random WIP testing code here, I like it, I saved it, ignore it, or use it for debug or your mods.
				//
				// [Debug] Master item list logger OR, optionally filters based on parent class
				// Object.values(items)
				// 	// .filter((x) => x._parent == "543be6564bdc2df4348b4568")
				// 	.map((x) => {
				// 		const price = getItemInHandbook(x._id)?.Price
				// 		log(getItemName(x._parent) + ": " + getItemName(x._id) + ", " + price + " // " + x._id)
				// 	})
				//
				// [Debug] WIP item list logger with file saving, itterates all base classes and filters stuff. Strong stuff, can't remember what it actually does now, was using it to to balance tiers lists.
				// let gg = []
				// for (let i = 0; i < baseClasses.length; i++) {
				// 	const baseclass = baseClasses[i]
				// 	if (scavcaseBlacklist.includes(baseclass)) {
				// 		Object.values(items)
				// 			.filter((x) => x._parent == baseclass)
				// 			.map((x) => {
				// 				const price = getItemInHandbook(x._id)?.Price
				// 				if (price > 10000) {
				// 					gg.push(getItemName(x._parent) + "	" + getItemName(x._id) + "	" + price + "\n")
				// 				}
				// 			})
				// 	}
				// 	if (i == baseClasses.length - 1) {
				// 		const ggs = gg.toString()
				// 		fs.writeFile("./test_b.txt", ggs, (err) => {
				// 			if (err) {
				// 				console.error(err)
				// 			}
				// 			log("OK!")
				// 		})
				// 	}
				// }
				//
				// [Debug] Scavcase tier lists generators, enable scavWhitelist above.
				// const commonItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.common.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.common.max
				// )
				// const rareItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.rare.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.rare.max
				// )
				// const superrareItems = scavWhitelist.filter(
				// 	(x) =>
				// 		getItemInHandbook(x).Price >= scavcaseConfig.rewardItemValueRangeRub.superrare.min &&
				// 		getItemInHandbook(x).Price <= scavcaseConfig.rewardItemValueRangeRub.superrare.max
				// )
				// [Debug] Tier lists loggers
				// commonItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				// rareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				// superrareItems.map(x => log(getItemName(x) + " " + getItemInHandbook(x).Price + " " + x))
				//
				// [Debug] AVG sum for tier calc
				//		let sum = 0
				//		for (let i = 0; i < superrareItems.length; i++) {
				//			const item = superrareItems[i]
				//
				//			sum += getItemInHandbook(item).Price
				//		}
				//		log(sum / superrareItems.length)
				//
				// [Debug] Comment generator with filter for ALL items, for white/black lists, shows item names
				// Object.values(items)
				// .filter((x) => x._props.CanSellOnRagfair == false && x._type == "Item")
				// .map((x) => log(`"${x._id}", // ${getItemName(x._id)}`));
				//
				// [Debug] Comment generator for white/black lists, shows item names, universally usefull for different arrays
				// itemWhitelist.map((x) => log(`"${x}", // ${getItemName(x)}`));
				//
				// [Debug] Stale code, filters and logs ALL items
				//	Object.values(items)
				//		.filter((x) => {
				//			const price = getItemInHandbook(x._id)?.Price
				//			return price >= 10000 && price <= 20000
				//		})
				//		.map((x) => {
				//			const price = getItemInHandbook(x._id)?.Price
				//			log(getItemName(x._id) + ": " + price)
				//		})
			}
		}

		if (config.HideoutOptions.enabled) {
			// 100x Faster hideout production, 10x superwater and moonshine production, bitcoins
			for (let prod in tables.hideout.production) {
				const endProduct = tables.hideout.production[prod].endProduct
				let productionTime = tables.hideout.production[prod].productionTime
				if (
					(endProduct == "5d1b376e86f774252519444e" || endProduct == "5d1b33a686f7742523398398") &&
					config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.enabled
				) {
					// superwater and moonshine
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.Base_Moonshine_And_Water_Time_Multiplier
					)
				} else if (endProduct == "59faff1d86f7746c51718c9c" && config.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
					// bitcoins
					tables.hideout.production[prod].productionTime = Math.round(
						productionTime / config.HideoutOptions.Faster_Bitcoin_Farming.Base_Bitcoin_Time_Multiplier
					)
				} else if (config.HideoutOptions.Faster_Crafting_Time.enabled) {
					// all other crafts
					tables.hideout.production[prod].productionTime = Math.round(productionTime / config.HideoutOptions.Faster_Crafting_Time.Base_Crafting_Time_Multiplier)
				}
			}

			if (config.HideoutOptions.Faster_Crafting_Time.enabled && config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.enabled) {
				// Buff to hideout exp rate, more testing needed
				hideoutConfig.hoursForSkillCrafting /= config.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.Hideout_Skill_Exp_Multiplier
			}

			if (config.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
				// Instead of modifing base farming time try this:
				tables.hideout.settings.gpuBoostRate = config.HideoutOptions.Faster_Bitcoin_Farming.GPU_Efficiency

				// TODO: replace getBTCSlots() in HideoutHelper to add bonus slots per farm level. lv2 - 4 slots, lv3 - 5, elite - 7

				// Vanilla: Base time (x1): 40h 17min (2417 min), GPU Boost (0.041225): x1, each GPU has only ~4.12% efficiency
				// 2× GPU: 38h 41min x1.04
				// 10× GPU: 29h 23min x1.37
				// 25× GPU: 20h 15min x1.99
				// 50× GPU: 13h 20min x3.02

				// Softcore v0.1: Base time (x10): 4h 2min, GPU Boost (0.041225): x1
				// 2× GPU: 3h 52min x1.04
				// 10× GPU: 2h 56min x1.37
				// 25× GPU: 2h 1min x1.99
				// 50× GPU: 1h 20min x3.02

				// Softcore v0.2: Base time (x2): 20h 8min, GPU Boost(0.5): x12.13, each GPU has ~50% efficiency
				// 2× GPU: 13h 26min x1.5
				// 10× GPU: 3h 40min x5.5
				// 25× GPU: 1h 33min x13
				// 50× GPU: 0h 47min x25.5

				// Linear: Base time (x1): 40h 17min, GPU Boost (1): x24.26, each GPU is 100% efficient
				// 2× GPU: 20h 8min x2
				// 10× GPU: 4h 2min x10
				// 25× GPU: 1h 37min x25
				// 50× GPU: 0h 48min x50
			}

			if (config.HideoutOptions.Faster_Hideout_Construction.enabled) {
				// 100x Faster hideout construction
				for (const area in tables.hideout.areas) {
					for (const stage in tables.hideout.areas[area].stages) {
						tables.hideout.areas[area].stages[stage].constructionTime = Math.round(
							tables.hideout.areas[area].stages[stage].constructionTime / config.HideoutOptions.Faster_Hideout_Construction.Hideout_Construction_Time_Multiplier
						)
					}
				}
			}

			if (config.HideoutOptions.Increased_Fuel_Consumption.enabled) {
				// 10x faster fuel draw
				tables.hideout.settings.generatorFuelFlowRate *= config.HideoutOptions.Increased_Fuel_Consumption.Fuel_Consumption_Multiplier
			}
		}

		for (let handbookItem in tables.templates.handbook.Items) {
			const itemInHandbook = tables.templates.handbook.Items[handbookItem]
			const itemID = itemInHandbook.Id

			if (prices[itemID] != undefined) {
				// Change all Flea prices to handbook prices.
				prices[itemID] = itemInHandbook.Price
			}
			if (!fleaWhitelist.includes(itemInHandbook.ParentId)) {
				// Ban everything on flea except whitelist handbook categories above.
				items[itemID]._props.CanSellOnRagfair = false
			}
		}

		// Unban random spawn only quest keys from flea, make them 2x expensive
		for (const questKey of questKeys) {
			prices[questKey] *= 2
			items[questKey]._props.CanSellOnRagfair = true
		}

		// Unban whitelist
		for (const item of itemWhitelist) {
			items[item]._props.CanSellOnRagfair = true
		}

		// Hardcode fix for important or unbalanced items. Too low prices can't convert to barters.
		prices["5aa2b923e5b5b000137b7589"] *= 5 // Round frame sunglasses
		prices["59e770b986f7742cbd762754"] *= 2 // Anti-fragmentation glasses
		prices["5f5e45cc5021ce62144be7aa"] *= 2 // LolKek 3F Transfer tourist backpack
		prices["5751487e245977207e26a315"] = 1500 // Emelya
		prices["57347d3d245977448f7b7f61"] = 2000 // Croutons

		if (config.OtherTweaks.enabled) {
			if (config.OtherTweaks.Skill_Exp_Buffs.enabled) {
				// Buff Vitality, Sniper and Surgery skill leveling
				globals.SkillsSettings.Vitality.DamageTakenAction *= 100 // I believe even this is a conservative number for a normal gameplay...
				globals.SkillsSettings.Sniper.WeaponShotAction *= 10
				globals.SkillsSettings.Surgery.SurgeryAction *= 10
				globals.SkillsSettings.StressResistance.LowHPDuration *= 10
			}

			if (config.OtherTweaks.Faster_Examine_Time.enabled) {
				// Faster ExamineTime
				Object.values(items)
					.filter((x) => x._props.ExamineTime != undefined)
					.forEach((x) => (x._props.ExamineTime /= 5))
			}

			if (config.OtherTweaks.Remove_Backpack_Restrictions.enabled) {
				// Remove backpack restrictions (for containers [ammo, med, etc] mostly).
				// Never again I'll see an unlootable medcase in 314...
				for (const itemID in items) {
					const item = items[itemID]
					if (item._props.ExaminedByDefault != undefined) {
						item._props.ExaminedByDefault = true //debug
					}
					if (true) {
						let filtered
						try {
							filtered = item._props.Grids[0]._props.filters[0].ExcludedFilter
						} catch (error) {}
						if (filtered !== undefined) {
							if (filtered.includes("5aafbcd986f7745e590fff23")) {
								item._props.Grids[0]._props.filters[0].ExcludedFilter = []
							}
						}
					}
				}
			}

			if (config.OtherTweaks.Keytool_Buff.enabled) {
				// Other opinionated tweaks:
				// keytool buff to make it 5x5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsH = 5
				tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsV = 5
			}

			if (config.OtherTweaks.SICC_Case_Buff.enabled) {
				// Huge buff to SICC case to make it actually not shit and a direct upgrade to Docs. And while we are here, allow it to hold keytool. It's Softcore, who cares.
				let mergeFilters = [
					...new Set([
						...tables.templates.items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter, // Docs
						...tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter, // SICC
						"59fafd4b86f7745ca07e1232", // keytool
					]),
				]
				tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter = mergeFilters
				log(mergeFilters.map((x) => getItemName(x)))
			}

			if (config.OtherTweaks.Reshala_Always_Has_GoldenTT.enabled) {
				// Reshala always has his Golden TT
				tables.bots.types.bossbully.chances.equipment.Holster = 100
				tables.bots.types.bossbully.inventory.equipment.Holster = { "5b3b713c5acfc4330140bd8d": 1 }
			}
		}

		if (config.InsuranceChanges.enabled) {
			// Redo insurance. Prapor in an instant return with 50% chance, costs 10% of item value, Therapist has 2 hour return with 80% chance, costs 20%.
			prapor.base.insurance.min_return_hour = 0
			prapor.base.insurance.max_return_hour = 0
			prapor.base.insurance.max_storage_time = 720
			therapist.base.insurance.min_return_hour = 2
			therapist.base.insurance.max_return_hour = 2
			therapist.base.insurance.max_storage_time = 720
			insuranceConfig.insuranceMultiplier["54cb50c76803fa8b248b4571"] = 0.1
			insuranceConfig.insuranceMultiplier["54cb57776803fa99248b456e"] = 0.2
			insuranceConfig.returnChancePercent["54cb50c76803fa8b248b4571"] = 50
			insuranceConfig.returnChancePercent["54cb57776803fa99248b456e"] = 80
		}

		if (config.EconomyOptions.enabled) {
			// Ragfair changes:

			if (config.EconomyOptions.Disable_Flea_Market_Completely.disable) {
				globals.RagFair.minUserLevel = 99
			} else {
				// Min level is 5
				globals.RagFair.minUserLevel = 5

				// Completely disable selling items
				ragfairConfig.sell.chance.base = 0
				// Untill this is fixed (https://dev.sp-tarkov.com/SPT-AKI/Server/issues/3098), no sellorino amigo.
				// Will enable selling in SPT 3.5 with further tweaks, since prices are quite balanced now.
				//ragfairConfig.sell.chance.overprices = 0 // block overpriced abuse. you have to sell for < DB fleaprice (use my Item info mod to see it)
				//ragfairConfig.sell.reputation.gain *= 10
				//ragfairConfig.sell.reputation.loss *= 10
				//ragfairConfig.sell.time.base = 1
				//ragfairConfig.sell.time.min = 1
				//ragfairConfig.sell.time.max = 1

				if (config.EconomyOptions.Barter_Economy.enabled) {
					ragfairConfig.dynamic.barter.chancePercent = 90 // Allow 10% of listings for cash
					ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100 // Barters only for items that cost > 100
					ragfairConfig.dynamic.barter.priceRangeVariancePercent = 40 // more variance for flea barters, seems actually fun!

					// Max 2 for 1 barters.
					ragfairConfig.dynamic.barter.itemCountMax = 2

					// Only pristine items are offered on flea.
					ragfairConfig.dynamic.condition.min = 1

					// Sligtly increase flea prices, but with bigger variance, you still get a lot of great trades. Hustle.
					ragfairConfig.dynamic.price.min *= 1.3 // 0.8 -> 1.04
					ragfairConfig.dynamic.price.max *= 1.3 // 1.2 -> 1.56

					//Allow FIR only items for barters. This is default, so just in case. To make a point.
					globals.RagFair.isOnlyFoundInRaidAllowed = true

					// Can only barter from items not in the blacklist. Only allows base classes, and not itemIDs =(
					ragfairConfig.dynamic.barter.itemTypeBlacklist = fleaBarterBlacklist

					BSGblacklist.filter((x) => {
						// dirty hack to block BSG blacklisted items (dogtags, bitcoins, ornaments and others) from barters, since you can't buy them on flea anyway, so it should not matter.
						if (x == "59faff1d86f7746c51718c9c" && config.EconomyOptions.Unban_Bitcoins_For_Barters.enabled == true) {
							// do nothing
						} else {
							// 2 is used to pass getFleaPriceForItem check and not trigger generateStaticPrices
							prices[x] = 2
							if (items[x]._props.CanSellOnRagfair == true) {
								log(`Item ${getItemName(x)} can be bought on flea for free, you dirty cheater!!!`)
							}
						}
					})

					// ragfairConfig.dynamic.barter.itemCountMax = 3
					// Max 20 offers. Too low of a number breaks AKI server for some reason, with constant client errors on completed trades.
					// More random trades variance anyway, this is fun.
					ragfairConfig.dynamic.offerItemCount.min = 10
					ragfairConfig.dynamic.offerItemCount.max = 20

					// Max 2 items per offer. Feels nice. Loot more shit, it might come in handy.
					ragfairConfig.dynamic.nonStackableCount.min = 1
					ragfairConfig.dynamic.nonStackableCount.max = 2
				}
				// Add BSGblacklist and mod custom blacklist to Fence blacklists
				let commonBlacklist = []
				commonBlacklist.push(...BSGblacklist, ...fleaBarterBlacklist)

				// Fence sells only items that are not in the flea blacklist
				traderConfig.fence.assortSize = 30
				traderConfig.fence.blacklist = commonBlacklist //itemid or baseid
				traderConfig.fence.maxPresetsPercent = 0
				traderConfig.fence.itemPriceMult = 0.8 // at 6 Fence karma you buy items almost at a price Therapist buys from you. Go grind.
			}
		}
		// Crafts:
		// This here, is some dumb stuff, I should've created some special class, controller, pushed the data out of the code or some other OOP bullcrap, but I'm not a programmer, so this will have to suffice. Sorry, not sorry.

		// 2x Clin production buff
		getCraft("59e358a886f7741776641ac3").count = 2

		// 2x Paracord production buff
		getCraft("5c12688486f77426843c7d32").count = 2

		// Water filter < 2 airfilter craft buff
		getCraft("5d1b385e86f774252167b98a").requirements.find((x) => x.templateId == "590c595c86f7747884343ad7").count = 2

		// Toilet paper production nerf lol. Who would have thought this craft would be OP, huh?
		getCraft("5c13cef886f774072e618e82").count = 1

		// EWR buff
		getCraft("60098b1705871270cd5352a1").count = 3

		// Buff MULE
		getCraft("5ed51652f6c34d2cc26336a1").count = 2

		// Surv12 nerf
		getCraft("5d02797c86f774203f38e30a").requirements.find((x) => x.templateId == "5e831507ea0a7c419c2f9bd9").templateId = "5af0454c86f7746bf20992e8"
		getCraft("5d02797c86f774203f38e30a").count = 1

		// AFAK buff
		getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "590c678286f77426c9660122").count = 1
		getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "5751a25924597722c463c472").templateId = "5e8488fa988a8701445df1e4"

		// Portable defibrillator big nerf (Portable Powerbank 1 -> 4). Lore-friendly and still profitable, just not as ridiculous.
		getCraft("5c052e6986f7746b207bc3c9").requirements.find((x) => x.templateId == "5af0561e86f7745f5f3ad6ac").count = 4

		// LEDX buff (Huge buff, 1 of each component only). Now it is actually only sometimes bother to craft it.
		getCraft("5c0530ee86f774697952d952").requirements.forEach((x) => {
			if (x.count) {
				x.count = 1
			}
		})

		// Virtex buff (Military circuit board 2 -> 1)
		getCraft("5c05308086f7746b2101e90b").requirements.find((x) => x.templateId == "5d0376a486f7747d8050965c").count = 1

		// Military circuit board buff (1 -> 2)
		getCraft("5d0376a486f7747d8050965c").count = 2

		// Military flash drive lore-based change (2 Secure Flash drive -> 1 VPX, and Topographic survey maps 2 -> 1). Not "profitable", but will change Intel folder craft to compensate.
		getCraft("62a0a16d0b9d3c46de5b6e97").requirements.forEach((x) => {
			if (x.count) {
				x.count = 1
			}
		})
		getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.templateId == "590c621186f774138d11ea29").templateId = "5c05300686f7746dce784e5d"

		// Intelligence folder buff (Military flash drive 2 -> 1)
		getCraft("5c12613b86f7743bbe2c3f76").requirements.find((x) => x.templateId == "62a0a16d0b9d3c46de5b6e97").count = 1

		// VPX buff (RAM and Broken GPhone smartphone 3 -> 2)
		getCraft("5c05300686f7746dce784e5d").requirements.forEach((x) => {
			if (x.count) {
				x.count = 2
			}
		})

		// FLIR huge buff (everything is 1, plus change SAS drive (wtf?!) to Armasight Vulcan MG 3.5x Bravo night vision scope)
		getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.forEach((x) => {
			if (x.count) {
				x.count = 1
			}
		})
		getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.find((x) => x.templateId == "590c37d286f77443be3d7827").templateId = "5b3b6e495acfc4330140bd88"

		// CMS nerf (Medical tools 1 -> 2)
		getCraft("5d02778e86f774203e7dedbe").requirements.find((x) => x.templateId == "619cc01e0a7c3a1a2731940c").count = 2

		// GRIzZLY nerf (1 -> 2)
		getCraft("590c657e86f77412b013051d").count = 1

		// coffee buff (2 -> 3)
		getCraft("5af0484c86f7740f02001f7f").count = 3

		// MPPV buff (KEKTAPE duct tape 2 -> 1)
		getCraft("5df8a42886f77412640e2e75").requirements.find((x) => x.templateId == "5e2af29386f7746d4159f077").count = 1

		// bottled water buff water (8 -> 16)
		getCraft("5448fee04bdc2dbc018b4567").count = 16

		// Topographic survey maps buff (1 -> 2)
		getCraft("62a0a124de7ac81993580542").count = 2

		// Aquamari buff (3 -> 5)
		getCraft("5c0fa877d174af02a012e1cf").count = 5

		// SJ6 buff (2 -> 3)
		getCraft("5c0e531d86f7747fa23f4d42").count = 3

		// GPU buff (3 VPX -> 1 Virtex, 10 PCB -> 1, 10 CPU -> 1)
		getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").count = 1
		getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").templateId = "5c05308086f7746b2101e90b"
		getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "573477e124597737dd42e191").count = 1
		getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "590a3b0486f7743954552bdb").count = 1

		// UHF RFID Reader huge buff (only Broken GPhone X smartphone + Signal Jammer)
		getCraft("5c052fb986f7746b2101e909").requirements = [
			{
				areaType: 11,
				requiredLevel: 2,
				type: "Area",
			},
			{
				templateId: "5c1265fc86f7743f896a21c2",
				count: 1,
				isFunctional: false,
				type: "Item",
			},
			{
				templateId: "5ac78a9b86f7741cca0bbd8d",
				count: 1,
				isFunctional: false,
				type: "Item",
			},
			{
				templateId: "5d4042a986f7743185265463",
				type: "Tool",
			},
			{
				templateId: "5d63d33b86f7746ea9275524",
				type: "Tool",
			},
		]

		// 63da4dbee8fa73e225000001
		// 63da4dbee8fa73e225000002
		// 63da4dbee8fa73e225000003
		// 63da4dbee8fa73e225000004
		// 63da4dbee8fa73e225000005
		// 63da4dbee8fa73e225000006
		// 63da4dbee8fa73e225000007
		// 63da4dbee8fa73e225000008
		// 63da4dbee8fa73e225000009
		// 63da4dbee8fa73e22500000a

		const Ophthalmoscope = {
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
			boosters: null,
			endProduct: "5af0534a86f7743b6f354284",
			continuous: false,
			count: 1,
			productionLimitCount: 0,
		}
		const Zagustin = {
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
			boosters: null,
			endProduct: "5c0e533786f7747fa23f4d47",
			continuous: false,
			count: 3,
			productionLimitCount: 0,
		}
		const Obdolbos = {
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
			boosters: null,
			endProduct: "5ed5166ad380ab312177c100",
			continuous: false,
			count: 8,
			productionLimitCount: 0,
		}
		const CALOK = {
			_id: "63da4dbee8fa73e225000004",

			areaType: 7,
			requirements: [
				{ areaType: 7, requiredLevel: 2, type: "Area" },
				{
					templateId: "5751a25924597722c463c472",
					count: 2,
					isFunctional: false,
					type: "Item",
				},
				{
					templateId: "5755383e24597772cb798966",
					count: 1,
					isFunctional: false,
					type: "Item",
				},
			],
			productionTime: 48,
			boosters: null,
			endProduct: "5e8488fa988a8701445df1e4",
			continuous: false,
			count: 2,
			productionLimitCount: 0,
		}
		const Adrenaline = {
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
			boosters: null,
			endProduct: "5c10c8fd86f7743d7d706df3",
			continuous: false,
			count: 1,
			productionLimitCount: 0,
		}
		const ThreebTG = {
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
			boosters: null,
			endProduct: "5ed515c8d380ab312177c0fa",
			continuous: false,
			count: 2,
			productionLimitCount: 0,
		}
		const AHF1 = {
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
			boosters: null,
			endProduct: "5ed515f6915ec335206e4152",
			continuous: false,
			count: 1,
			productionLimitCount: 0,
		}
		const OLOLO = {
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
			boosters: null,
			endProduct: "62a0a043cf4a99369e2624a5",
			continuous: false,
			count: 3,
			productionLimitCount: 0,
		}
		const L1 = {
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
			boosters: null,
			endProduct: "5ed515e03a40a50460332579",
			continuous: false,
			count: 1,
			productionLimitCount: 0,
		}

		tables.hideout.production.push(ThreebTG, Adrenaline, L1, AHF1, CALOK, Ophthalmoscope, Zagustin, Obdolbos, OLOLO)

		function getCraft(endProductID) {
			return tables.hideout.production.find((x) => x.endProduct == endProductID && x.areaType != 21)
		}

		function getItemInHandbook(itemID) {
			return handbook.Items?.find((i) => i.Id === itemID) // Outs: @Id, @ParentId, @Price
		}

		function getItemName(itemID, locale = "en") {
			if (locales[locale][`${itemID} Name`] != undefined) {
				// return items[itemID]._name
				return locales[locale][`${itemID} Name`]
			} else {
				return items[itemID]?._name
			}
		}
	}
}

const log = (i: any) => {
	console.log(i)
}

module.exports = { mod: new Mod() }
