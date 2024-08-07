const fleaListingsWhitelist = [
	// Whitelist for disabling global flea offers, used in Pacifist_FleaMarket
	// Handbook Categories IDs, updated for 3.5.0
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
	"5b47574386f77428ca22b33e", // Barter items
	// "5b47574386f77428ca22b33f", // Gear
	"5b47574386f77428ca22b340", // Provisions
	"5b47574386f77428ca22b341", // Info items
	// "5b47574386f77428ca22b342", // Keys
	"5b47574386f77428ca22b343", // Maps
	"5b47574386f77428ca22b344", // Medication
	// "5b47574386f77428ca22b345", // Special equipment
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

	// 3.80
	// 	"5b47574386f77428ca22b2f6", // Tools
	// "5b47574386f77428ca22b2f1", // Valuables
	// "5b47574386f77428ca22b2f2", // Flammable materials
	// "5b47574386f77428ca22b32f", // Facecovers
	// "5b5f749986f774094242f199", // Special purpose sights
	// "5b47574386f77428ca22b2ed", // Energy elements
	// "5b47574386f77428ca22b33b", // Rounds
	// "5b47574386f77428ca22b344", // Medication
	// "5b47574386f77428ca22b2f3", // Medical supplies
	// "5b47574386f77428ca22b2ef", // Electronics
	// "5b47574386f77428ca22b2f0", // Household materials
	// "5b47574386f77428ca22b342", // Keys
	// "5b5f737886f774093e6cb4fb", // Tactical combo devices
	// "5b5f742686f774093e6cb4ff", // Collimators
	// "5b5f78b786f77447ed5636af", // Money
	// "5b5f78dc86f77409407a7f8e", // Weapons
	// "5b5f794b86f77409407a7f92", // Shotguns
	// "5b5f7a2386f774093f2ed3c4", // Throwables
	// "5b5f6fd286f774093f2ecf0d", // Secure containers
	// "5b5f71a686f77447ed5636ab", // Weapon parts & mods
	// "5b5f71b386f774093f2ecf11", // Functional mods
	// "5b5f7a0886f77409407a7f96", // Melee weapons
	// "5b47574386f77428ca22b335", // Drinks
	// "5b47574386f77428ca22b33a", // Injectors
	// "5b47574386f77428ca22b33c", // Ammo packs
	// "5b47574386f77428ca22b330", // Headgear
	// "5b47574386f77428ca22b345", // Special equipment
	// "5b5f71c186f77409407a7ec0", // Bipods
	// "5b5f748386f774093e6cb501", // Optics
	// "5b5f750686f774093e6cb503", // Gear mods
	// "5b5f754a86f774094242f19b", // Magazines
	// "5b5f761f86f774094242f1a1", // Pistol grips
	// "5b5f791486f774093f2ed3be", // Marksman rifles
	// "5b5f75c686f774094242f19f", // Barrels
	// "5b47574386f77428ca22b33e", // Barter items
	// "5b5f6f3c86f774094242ef87", // Headsets
	// "5b5f701386f774093f2ecf0f", // Body armor
	// "5b5f72f786f77447ec5d7702", // Muzzle adapters
	// "5b5f740a86f77447ec5d7706", // Assault scopes
	// "5b5f792486f77447ed5636b3", // Pistols
	// "5b5f796a86f774093f2ed3c0", // SMGs
	// "5b47574386f77428ca22b2ee", // Building materials
	// "5b47574386f77428ca22b346", // Ammo
	// "5b5f724c86f774093f2ecf15", // Flashhiders & brakes
	// "5b5f73ab86f774094242f195", // Flashlights
	// "5b5f75e486f77447ec5d7712", // Handguards
	// "6564b96a189fe36f356d177c", // icon_barter_others
	// "5b47574386f77428ca22b331", // Eyewear
	// "5b47574386f77428ca22b33f", // Gear
	// "5b5f760586f774093e6cb509", // Gas blocks
	// "5b5f73ec86f774093e6cb4fd", // Sights
	// "5b5f759686f774094242f19d", // Magwells
	// "5b5f764186f77447ec5d7714", // Receivers & slides
	// "5b47574386f77428ca22b340", // Provisions
	// "5b47574386f77428ca22b341", // Info items
	// "5b5f757486f774093e6cb507", // Stocks & chassis
	// "5b5f78e986f77447ed5636b1", // Assault carbines
	// "5b5f724186f77447ed5636ad", // Muzzle devices
	// "5b47574386f77428ca22b337", // Pills
	// "5b5f731a86f774093e6cb4f9", // Suppressors
	// "5b5f798886f77447ed5636b5", // Bolt-action rifles
	// "5b5f746686f77447ec5d7708", // Iron sights
	// "5c518ed586f774119a772aee", // Electronic keys
	// "5b5f79a486f77409407a7f94", // Machine guns
	// "5b5f6f8786f77447ed563642", // Tactical rigs
	// "5b47574386f77428ca22b339", // Injury treatment
	// "5b5f704686f77447ec5d76d7", // Gear components
	// "5b5f78fc86f77409407a7f90", // Assault rifles
	// "5b5f751486f77447ec5d770c", // Charging handles
	// "5b5f79d186f774093f2ed3c2", // Grenade launchers
	// "5b5f79eb86f77447ed5636b7", // Special weapons
	// "5b47574386f77428ca22b2f4", // Others
	// "5b5f6fa186f77409407a7eb7", // Storage containers
	// "5b47574386f77428ca22b336", // Food
	// "5b5f71de86f774093f2ecf13", // Foregrips
	// "5b47574386f77428ca22b338", // Medkits
	// "5b5f736886f774094242f193", // Light & laser devices
	// "5b47574386f77428ca22b343", // Maps
	// "5b5f6f6c86f774093f2ecf0b", // Backpacks
	// "5b5f73c486f77447ec5d7704", // Laser target pointers
	// "5b5f744786f774094242f197", // Compact collimators
	// "5b5f752e86f774093e6cb505", // Launchers
	// "5b5f74cc86f77447ec5d770a", // Auxiliary parts
	// "5b5f75b986f77447ec5d7710", // Vital parts
	// "5b619f1a86f77450a702a6f3", // Quest items
	// "5b5f755f86f77447ec5d770e", // Mounts
	// "5c518ec986f7743b68682ce2", // Mechanical keys
];

module.exports = fleaListingsWhitelist;
