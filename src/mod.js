"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
// import { ObjectId } from "C:/snapshot/project/obj/utils/ObjectId" // [Debug]
// import * as fs from "fs" // [Debug] Used for file saving
const config_json_1 = __importDefault(require("../config/config.json"));
const fleaWhitelist = [
    // Whitelist for disabling global flea offers, used in Pacifist_FleaMarket
    // Handbook Categories IDs
    "5b47574386f77428ca22b2ed",
    "5b47574386f77428ca22b2ee",
    "5b47574386f77428ca22b2ef",
    "5b47574386f77428ca22b2f0",
    "5b47574386f77428ca22b2f1",
    "5b47574386f77428ca22b2f2",
    "5b47574386f77428ca22b2f3",
    "5b47574386f77428ca22b2f4",
    "5b47574386f77428ca22b2f6",
    // "5b47574386f77428ca22b32f", // Facecovers
    // "5b47574386f77428ca22b330", // Headgear
    // "5b47574386f77428ca22b331", // Eyewear
    "5b47574386f77428ca22b335",
    "5b47574386f77428ca22b336",
    "5b47574386f77428ca22b337",
    "5b47574386f77428ca22b338",
    "5b47574386f77428ca22b339",
    "5b47574386f77428ca22b33a",
    // "5b47574386f77428ca22b33b", // Rounds
    // "5b47574386f77428ca22b33c", // Ammo packs
    // "5b47574386f77428ca22b33f", // Gear
    "5b47574386f77428ca22b341",
    // "5b47574386f77428ca22b342", // Keys
    "5b47574386f77428ca22b343",
    "5b47574386f77428ca22b344",
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
];
const baseClasses = [
    // unused, for reference
    "54009119af1c881c07000029",
    "5d650c3e815116009f6201d2",
    "57864ee62459775490116fc1",
    "57864ada245977548638de91",
    "57864a66245977548f04a81f",
    "57864c322459775490116fbf",
    "57864a3d24597754843f8721",
    "57864e4c24597754843f8723",
    "57864c8c245977548867e7f1",
    "590c745b86f7743cc433c5f2",
    "57864bb7245977548b3b66c2",
    "5448e54d4bdc2dcc718b4568",
    "5a341c4686f77469e155819e",
    "5a341c4086f77401f2541505",
    "5448e5724bdc2ddf718b4568",
    "5b3f15d486f77432d0509248",
    "57bef4c42459772e8d35a53b",
    "5645bcb74bdc2ded0b8b4578",
    "550aa4af4bdc2dd4348b456e",
    "550aa4bf4bdc2dd6348b456b",
    "550aa4dd4bdc2dc9348b4569",
    "550ad14d4bdc2dd5348b456c",
    "550aa4cd4bdc2dd8348b456c",
    "5a2c3a9486f774688b05e574",
    "5d21f59b6dbe99052b54ef83",
    "55818add4bdc2d5b648b456f",
    "55818ad54bdc2ddc698b4569",
    "55818acf4bdc2dde698b456b",
    "55818ac54bdc2d5b648b456e",
    "55818ae44bdc2dde698b456c",
    "55818aeb4bdc2ddc698b456a",
    "5a74651486f7744e73386dd1",
    "55818afb4bdc2dde698b456d",
    "55818b084bdc2d5b648b4571",
    "55818af64bdc2d5b648b4570",
    "56ea9461d2720b67698b456f",
    "55818b0e4bdc2dde698b456e",
    "5448fe394bdc2d0d028b456c",
    "55818b1d4bdc2d5b648b4572",
    "5448fe7a4bdc2d6f028b456b",
    "55818b164bdc2ddc698b456c",
    "627a137bf21bc425b06ab944",
    "610720f290b75a49ff2e5e25",
    "55818a6f4bdc2db9688b456b",
    "55818b014bdc2ddc698b456b",
    "5448bc234bdc2d3c308b4569",
    "55818b224bdc2dde698b456f",
    "55818a604bdc2db5418b457e",
    "55818a594bdc2db9688b456a",
    "555ef6e44bdc2de9068b457e",
    "55818a104bdc2db9688b4569",
    "55818a684bdc2ddd698b456d",
    "55818a304bdc2db5418b457d",
    "550aa4154bdc2dd8348b456b",
    "55802f3e4bdc2de7118b4584",
    "55802f4a4bdc2ddb688b4569",
    "5448e53e4bdc2d60728b4567",
    "566965d44bdc2d814c8b4571",
    "5448bf274bdc2dfc2f8b456a",
    "5448e5284bdc2dcb718b4567",
    "557596e64bdc2dc2118b4571",
    "62f109593b54472778797866",
    "6050cac987d3f925bf016837",
    "5447b5fc4bdc2d87278b4567",
    "5447b5f14bdc2d61278b4567",
    "5447bedf4bdc2d87278b4568",
    "5447bed64bdc2d97278b4568",
    "5447b6194bdc2d67278b4567",
    "5447b5cf4bdc2d65278b4567",
    "617f1ef5e8b54b0998387733",
    "5447b6094bdc2dc3278b4567",
    "5447b5e04bdc2d62278b4567",
    "5447b6254bdc2dc3278b4568",
    "5447bee84bdc2dc3278b4569",
    "543be5f84bdc2dd4348b456a",
    "55d720f24bdc2d88028b456d",
    "5671435f4bdc2d96058b4569",
    "5448fe124bdc2da5018b4567",
    "566168634bdc2d144c8b456c",
    "5795f317245977243854e041",
    "566abbb64bdc2d144c8b457d",
    "567583764bdc2d98058b456e",
    "5422acb9af1c889c16000029",
    "5448e8d64bdc2dce718b4568",
    "5448e8d04bdc2ddf718b4569",
    "5c99f98d86f7745c314214b3",
    "5c164d2286f774194c5e69fa",
    "5448f3a14bdc2d27728b4569",
    "5448f39d4bdc2d0a728b4568",
    "5448f3ac4bdc2dce718b4569",
    "5448f3a64bdc2d60728b456a",
    "5f4fbaaca5573a5ac31db429",
    "61605ddea09d851a0a0c1bbc",
    "616eb7aea207f41933308f46",
    "5485a8684bdc2da71d8b4567",
    "543be5cb4bdc2deb348b4568",
    "543be5dd4bdc2deb348b4569",
    "5448eb774bdc2d0a728b4567",
    "566162e44bdc2d3f298b4573",
    "543be6674bdc2df1348b4569",
    "5448ecbe4bdc2d60728b4568",
    "543be5e94bdc2df1348b4568",
    "5447e1d04bdc2dff2f8b4567",
    "567849dd4bdc2d150f8b456e",
    "543be5664bdc2dd4348b4569",
    "5447e0e74bdc2d3c308b4567",
    "5661632d4bdc2d903d8b456b",
    "543be6564bdc2df4348b4568", // Throwable weapon
];
const fleaBarterBlacklist = [
    // Blacklist for items that can be bartered with, used in Barter_Economy and Pacifist_Fence
    // base classes IDs (parent IDs)
    // "54009119af1c881c07000029", // Item
    "5d650c3e815116009f6201d2",
    // "57864ee62459775490116fc1", // Battery
    // "57864ada245977548638de91", // Building material
    // "57864a66245977548f04a81f", // Electronics
    // "57864c322459775490116fbf", // Household goods
    // "57864a3d24597754843f8721", // Jewelry
    // "57864e4c24597754843f8723", // Lubricant
    // "57864c8c245977548867e7f1", // Medical supplies
    // "590c745b86f7743cc433c5f2", // Other
    // "57864bb7245977548b3b66c2", // Tool
    "5448e54d4bdc2dcc718b4568",
    "5a341c4686f77469e155819e",
    "5a341c4086f77401f2541505",
    "5448e5724bdc2ddf718b4568",
    "5b3f15d486f77432d0509248",
    "57bef4c42459772e8d35a53b",
    "5645bcb74bdc2ded0b8b4578",
    "550aa4af4bdc2dd4348b456e",
    "550aa4bf4bdc2dd6348b456b",
    "550aa4dd4bdc2dc9348b4569",
    "550ad14d4bdc2dd5348b456c",
    "550aa4cd4bdc2dd8348b456c",
    "5a2c3a9486f774688b05e574",
    "5d21f59b6dbe99052b54ef83",
    "55818add4bdc2d5b648b456f",
    "55818ad54bdc2ddc698b4569",
    "55818acf4bdc2dde698b456b",
    "55818ac54bdc2d5b648b456e",
    "55818ae44bdc2dde698b456c",
    "55818aeb4bdc2ddc698b456a",
    "5a74651486f7744e73386dd1",
    "55818afb4bdc2dde698b456d",
    "55818b084bdc2d5b648b4571",
    "55818af64bdc2d5b648b4570",
    "56ea9461d2720b67698b456f",
    "55818b0e4bdc2dde698b456e",
    "5448fe394bdc2d0d028b456c",
    "55818b1d4bdc2d5b648b4572",
    "5448fe7a4bdc2d6f028b456b",
    "55818b164bdc2ddc698b456c",
    "627a137bf21bc425b06ab944",
    "610720f290b75a49ff2e5e25",
    "55818a6f4bdc2db9688b456b",
    "55818b014bdc2ddc698b456b",
    "5448bc234bdc2d3c308b4569",
    "55818b224bdc2dde698b456f",
    "55818a604bdc2db5418b457e",
    "55818a594bdc2db9688b456a",
    "555ef6e44bdc2de9068b457e",
    "55818a104bdc2db9688b4569",
    "55818a684bdc2ddd698b456d",
    "55818a304bdc2db5418b457d",
    "550aa4154bdc2dd8348b456b",
    "55802f3e4bdc2de7118b4584",
    "55802f4a4bdc2ddb688b4569",
    "5448e53e4bdc2d60728b4567",
    "566965d44bdc2d814c8b4571",
    "5448bf274bdc2dfc2f8b456a",
    "5448e5284bdc2dcb718b4567",
    "557596e64bdc2dc2118b4571",
    "62f109593b54472778797866",
    "6050cac987d3f925bf016837",
    "5447b5fc4bdc2d87278b4567",
    "5447b5f14bdc2d61278b4567",
    "5447bedf4bdc2d87278b4568",
    "5447bed64bdc2d97278b4568",
    "5447b6194bdc2d67278b4567",
    "5447b5cf4bdc2d65278b4567",
    "617f1ef5e8b54b0998387733",
    "5447b6094bdc2dc3278b4567",
    "5447b5e04bdc2d62278b4567",
    "5447b6254bdc2dc3278b4568",
    "5447bee84bdc2dc3278b4569",
    "543be5f84bdc2dd4348b456a",
    "55d720f24bdc2d88028b456d",
    "5671435f4bdc2d96058b4569",
    "5448fe124bdc2da5018b4567",
    "566168634bdc2d144c8b456c",
    "5795f317245977243854e041",
    "566abbb64bdc2d144c8b457d",
    "567583764bdc2d98058b456e",
    "5422acb9af1c889c16000029",
    // "5448e8d64bdc2dce718b4568", // Drink
    // "5448e8d04bdc2ddf718b4569", // Food
    "5c99f98d86f7745c314214b3",
    "5c164d2286f774194c5e69fa",
    // "5448f3a14bdc2d27728b4569", // Drug
    // "5448f39d4bdc2d0a728b4568", // Medikit
    // "5448f3ac4bdc2dce718b4569", // Medical item
    "5448f3a64bdc2d60728b456a",
    "5f4fbaaca5573a5ac31db429",
    "61605ddea09d851a0a0c1bbc",
    // "616eb7aea207f41933308f46", // RepairKits
    "5485a8684bdc2da71d8b4567",
    "543be5cb4bdc2deb348b4568",
    "543be5dd4bdc2deb348b4569",
    // "5448eb774bdc2d0a728b4567", // Barter item
    "566162e44bdc2d3f298b4573",
    // "543be6674bdc2df1348b4569", // Food and drink
    // "5448ecbe4bdc2d60728b4568", // Info
    "543be5e94bdc2df1348b4568",
    "5447e1d04bdc2dff2f8b4567",
    "567849dd4bdc2d150f8b456e",
    // "543be5664bdc2dd4348b4569", // Meds
    "5447e0e74bdc2d3c308b4567",
    "5661632d4bdc2d903d8b456b",
    "543be6564bdc2df4348b4568", // Throwable weapon
];
const questKeys = [
    // Whitelist for quest keys
    "59387a4986f77401cc236e62",
    // "5938603e86f77435642354f4", // Dorm room 206 key
    // "5938504186f7740991483f30", // Dorm room 203 key
    "5780cf942459777df90dcb72",
    "5780cfa52459777dfb276eb1",
    "593aa4be86f77457f56379f8",
    // "5780cf7f2459777de4559322", // Dorm room 314 marked key, lol, nope
    // "5937ee6486f77408994ba448", // Machinery key
    // "5780d0532459777a5108b9a2", // Tarcone Director's office key
    "5938144586f77473c2087145",
    // "5913611c86f77479e0084092", // Trailer park portable cabin key
    // "593962ca86f774068014d9af", // Unknown key
    "5448ba0b4bdc2d02308b456c",
    "5ad5cfbd86f7742c825d6104",
    "5ad5db3786f7743568421cce",
    "5ad7247386f7747487619dc3",
    // "5c94bbff86f7747ee735c08f", // TerraGroup Labs access keycard
    "5efde6b4f5448336730dbd61",
    "5c1d0c5f86f7744bb2683cf0",
    "5c1d0dc586f7744baf2e7b79",
    "62987c658081af308d7558c6",
    "62987da96188c076bc0d8c51",
    "5d947d4e86f774447b415895",
    "5d80c6c586f77440351beef1",
    "5d80ccac86f77470841ff452",
    "5d80ccdd86f77474f7575e02",
    "5d80cd1a86f77402aa362f42",
    "5d947d3886f774447b415893",
    "5d9f1fa686f774726974a992",
    "5a0448bc86f774736f14efa8",
    "5a0eb6ac86f7743124037a28",
    "5a0ea79b86f7741d4a35298e",
    "5a0dc95c86f77452440fc675",
    "5a0ee30786f774023b6ee08f",
    "5a13ef0686f7746e5a411744",
    "5a0ee34586f774023b6ee092",
    "5a13f46386f7741dd7384b04",
    "5eff09cd30a7dc22fd1ddfed",
    "5a145d4786f7744cbb6f4a12",
    "5a145d7b86f7744cbb6f4a13",
    "5a0eee1486f77402aa773226",
    "591afe0186f77431bd616a11", // ZB-014 key
    // "5d08d21286f774736e7c94c3", // Shturman's stash key
];
const itemWhitelist = [
    // Whitelist for items that can be bartered FOR on flea, outside of fleaWhitelist categories
    "60363c0c92ec1c31037959f5",
    "5fd4c5477a8d854fa0105061",
    "5f5e45cc5021ce62144be7aa",
    "5780cf722459777a5108b9a1",
    "59e770b986f7742cbd762754",
    "572b7fa524597762b747ce82",
    "5b4329075acfc400153b78ff",
    "59e7708286f7742cbd762753",
    "5e54f79686f7744022011103",
    "5b4326435acfc433000ed01d",
    "5b432c305acfc40019478128",
    "5aa2b923e5b5b000137b7589",
    "5c0d2727d174af02a012cf58",
    "57e26fc7245977162a14b800",
    "57e26ea924597715ca604a09",
    "61c18db6dfd64163ea78fbb4",
    "56e33634d2720bd8058b456b",
    "5f60cd6cf2bcbb675b00dac6",
    "5c165d832e2216398b5a7e36",
    "5e4d34ca86f774264f758330",
    "628e4e576d783146b124c64d", // Peltor ComTac 4 Hybrid
];
const BSGblacklist = [
    // BSGblacklist, hardcoded for safety, NEED TO UPDATE ON NEW PATCHES!!!!!!!
    "59faff1d86f7746c51718c9c",
    "5df8a6a186f77412640e2e80",
    "5df8a72c86f77412640e2e83",
    "5df8a77486f77412672a1e3f",
    "59f32bb586f774757e1e8442",
    "59f32c3b86f77472a31742f0",
    "619bc61e86e01e16f839a999",
    "619bddc6c9546643a67df6ee",
    "619bddffc9546643a67df6f0",
    "619bde3dc9546643a67df6f2",
    "619bdeb986e01e16f839a99e",
    "619bdf9cc9546643a67df6f8",
    "5ab8e79e86f7742d8b372e78",
    "545cdb794bdc2d3a198b456a",
    "5c0e541586f7747fa54205c9",
    "5fd4c474dd870108a754b241",
    "60a283193cb70855c43a381d",
    "5e9dacf986f774054d6b89f4",
    "5b44cd8b86f774503d30cba2",
    "5b44cf1486f77431723e3d05",
    "5b44d0de86f774503d30cba8",
    "5f5f41476bdad616ad46d631",
    "5ca2151486f774244a3b8d30",
    "5ca21c6986f77479963115a7",
    "5e4abb5086f77406975c9342",
    "6038b4ca92ec1c3103795a0d",
    "6038b4b292ec1c3103795a0b",
    "5c0e625a86f7742d77340f62",
    "62963c18dbc8ab5f0d382d0b",
    "62a61bbf8ec41a51b34758d2",
    "60a7ad3a0c5cb24b0134664a",
    "60a7ad2a2198820d95707a2e",
    "5f60c74e3b85f6263c145586",
    "5a154d5cfcdbcb001a3b00da",
    "5aa7e276e5b5b000171d0647",
    "5ac8d6885acfc400180ae7b0",
    "5c091a4e0db834001d5addc8",
    "5ca20ee186f774799474abc2",
    "5c17a7ed2e2216152142459c",
    "5f60b34a41e30a4ab12a6947",
    "5c0e874186f7745dc7616606",
    "5e00c1ad86f774747333222c",
    "5e01ef6886f77445f643baa4",
    "5f60c85b58eff926626a60f7",
    "5ca2113f86f7740b2547e1d2",
    "5a16b7e1fcdbcb00165aa6c9",
    "5c0919b50db834001b7ce3b9",
    "5e01f37686f774773c6f6c15",
    "5e00cdd986f7747473332240",
    "5c0558060db834001b735271",
    "5d1b5e94d7ad1a2b865a96b0",
    "5a1eaa87fcdbcb001865f75e",
    "5cfe8010d7ad1a59283b14c6",
    "5c6175362e221600133e3b94",
    "59c1383d86f774290a37e0ca",
    "544a37c44bdc2d25388b4567",
    "5ab8ebf186f7742d8b372e80",
    "5c0e805e86f774683f3dd637",
    "61b9e1aaef9a1b5d6a79899a",
    "5f5e46b96bdad616ad46d613",
    "59e763f286f7742ee57895da",
    "6034d2d697633951dc245ea6",
    "5df8a4d786f77412672a1e3b",
    "5c0e774286f77468413cc5b2",
    "5857a8b324597729ab0a0e7d",
    "5c0a794586f77461c458f892",
    "5c0a5a5986f77476aa30ae64",
    "59db794186f77448bc595262",
    "5857a8bc2459772bad15db29",
    "5c093ca986f7740a1867ab12",
    "544a11ac4bdc2d470e8b456a",
    "5732ee6a24597719ae0c0281",
    "627a4e6b255f7527fb05a0f6",
    "557ffd194bdc2d28148b457f",
    "60c7272c204bc17802313365",
    "5af99e9186f7747c447120b8",
    "61bcc89aef0f505f0c6cd0fc",
    "5d5d87f786f77427997cfaef",
    "544a5caa4bdc2d1a388b4568",
    "628d0618d1ba6e4fa07ce5a4",
    "5e4ac41886f77406a511c9a8",
    "5c0e746986f7741453628fe5",
    "628dc750b910320f4c27a732",
    "61bc85697113f767765c7fe7",
    "609e860ebd219504d8507525",
    "628b9784bcf6e2659e09b8a2",
    "628b9c7d45122232a872358f",
    "5b44cad286f77402a54ae7e5",
    "60a3c70cde5f453f634816a3",
    "60a3c68c37ea821725773ef5",
    "628cd624459354321c4b7fa2",
    "5c0a840b86f7742ffa4f2482",
    "5b7c710788a4506dec015957",
    "5b6d9ce188a4501afc1b2b25",
    "6183afd850224f204c1da514",
    "606587252535c57a13424cfd",
    "5dcbd56fdbd3d91b3e5468d5",
    "6165ac306ef05c2ce828ef74",
    "628a60ae6b1d481ff772e9c8",
    "5e81ebcd8e146c7080625e15",
    "6217726288ed9f0845317459",
    "62178c4d4ecf221597654e3d",
    "624c0b3340357b5f566e8766",
    "620109578d82e67e7911abf2",
    "6176aca650224f204c1da3fb",
    "5df8ce05b11454561e39243b",
    "5a367e5dc4a282000e49738f",
    "5aafa857e5b5b00018480968",
    "5fc22d7c187fea44d52eda44",
    "6275303a9f372d6ea97f9ec7",
    "5e848cc2988a8701445df1e8",
    "627e14b21713922ded6f2c15",
    "5c94bbff86f7747ee735c08f",
    "5efb0cabfb3e451d70735af5",
    "5d6e68a8a4b9360b6c0d54e2",
    "5d6e68b3a4b9361bca7e50b5",
    "5d6e68d1a4b93622fe60e845",
    "5e85a9f4add9fe03027d9bf1",
    "62389aaba63f32501b1b444f",
    "62389ba9a63f32501b1b4451",
    "62389be94d5d474bf712e709",
    "5f0c892565703e5c461894e9",
    "5ede47405b097655935d7d16",
    "5ba26835d4351e0035628ff5",
    "5ba26844d4351e00334c9475",
    "5c0d5e4486f77478390952fe",
    "61962b617c6c7b169525f168",
    "56dff026d2720bb8668b4567",
    "56dff061d2720bb5668b4567",
    "54527ac44bdc2d36668b4567",
    "59e6906286f7746c9f75e847",
    "59e690b686f7746c9f75e848",
    "601949593ae8f707c4608daa",
    "5cc80f67e4a949035e43bbba",
    "5cc80f38e4a949001152b560",
    "5fd20ff893a8961fc660a954",
    "59e0d99486f7744a32234762",
    "601aa3d2b2bcb34913271e6d",
    "5a6086ea4f39f99cd479502f",
    "5a608bf24f39f98ffc77720e",
    "5efb0c1bd79ff02a1f5e68d9",
    "5e023d34e8a400319a28ed44",
    "5e023d48186a883be655e551",
    "560d61e84bdc2da74d8b4571",
    "5fc382a9d724d907e2077dab",
    "5fc275cf85fd526b824a571a",
    "5fc382b6d6fa9c00c571bbc3",
    "5efb0da7a29a85116f6ea05f",
    "5c925fa22e221601da359b7b",
    "5c0d688c86f77413ae3407b2",
    "57a0e5022459774d1673f889",
    "5c0d668f86f7747ccb7f13b2",
    "635267f063651329f75a4ee8",
    "57372bd3245977670b7cd243",
    "57372c89245977685d4159b1",
    "57372b832459776701014e41",
    "5c1260dc86f7746b106e8748",
    "57372c21245977670937c6c2",
    "5c1262a286f7743f8a69aab2",
    "57372bad245977670b7cd242",
    "57372c56245977685e584582",
    // "5696686a4bdc2da3298b456a", // Dollars
    // "569668774bdc2da2298b4568", // Euros
    // "5449016a4bdc2d6f028b456f", // Roubles
    "617fd91e5539a84ec44ce155",
    "618a431df1eb8e24b8741deb", // RGO hand grenade
];
const scavcaseWhitelist = [
    // Whitelist for scav case rewards (base class IDs), those are ALWAYS INCLUDED IN REWARDS
    "54009119af1c881c07000029",
    "5d650c3e815116009f6201d2",
    "57864ee62459775490116fc1",
    "57864ada245977548638de91",
    "57864a66245977548f04a81f",
    "57864c322459775490116fbf",
    "57864a3d24597754843f8721",
    "57864e4c24597754843f8723",
    "57864c8c245977548867e7f1",
    "590c745b86f7743cc433c5f2",
    "57864bb7245977548b3b66c2",
    "5448e54d4bdc2dcc718b4568",
    // "5a341c4686f77469e155819e", // FaceCover
    // "5a341c4086f77401f2541505", // Headwear
    // "5448e5724bdc2ddf718b4568", // Vis. observ. device
    // "5b3f15d486f77432d0509248", // ArmBand
    "57bef4c42459772e8d35a53b",
    "5645bcb74bdc2ded0b8b4578",
    "550aa4af4bdc2dd4348b456e",
    // "550aa4bf4bdc2dd6348b456b", // Flashhider
    // "550aa4dd4bdc2dc9348b4569", // Comb. muzzle device
    "550ad14d4bdc2dd5348b456c",
    "550aa4cd4bdc2dd8348b456c",
    "5a2c3a9486f774688b05e574",
    "5d21f59b6dbe99052b54ef83",
    "55818add4bdc2d5b648b456f",
    "55818ad54bdc2ddc698b4569",
    "55818acf4bdc2dde698b456b",
    // "55818ac54bdc2d5b648b456e", // Ironsight
    "55818ae44bdc2dde698b456c",
    "55818aeb4bdc2ddc698b456a",
    // "5a74651486f7744e73386dd1", // AuxiliaryMod
    // "55818afb4bdc2dde698b456d", // Bipod
    "55818b084bdc2d5b648b4571",
    "55818af64bdc2d5b648b4570",
    // "56ea9461d2720b67698b456f", // Gas block
    "55818b0e4bdc2dde698b456e",
    // "5448fe394bdc2d0d028b456c", // Muzzle device
    "55818b1d4bdc2d5b648b4572",
    "5448fe7a4bdc2d6f028b456b",
    "55818b164bdc2ddc698b456c",
    // "627a137bf21bc425b06ab944", // SpringDrivenCylinder
    // "610720f290b75a49ff2e5e25", // CylinderMagazine
    // "55818a6f4bdc2db9688b456b", // Charging handle
    "55818b014bdc2ddc698b456b",
    // "5448bc234bdc2d3c308b4569", // Magazine
    // "55818b224bdc2dde698b456f", // Mount
    "55818a604bdc2db5418b457e",
    // "55818a594bdc2db9688b456a", // Stock
    // "555ef6e44bdc2de9068b457e", // Barrel
    // "55818a104bdc2db9688b4569", // Handguard
    // "55818a684bdc2ddd698b456d", // Pistol grip
    // "55818a304bdc2db5418b457d", // Receiver
    "550aa4154bdc2dd8348b456b",
    "55802f3e4bdc2de7118b4584",
    "55802f4a4bdc2ddb688b4569",
    "5448e53e4bdc2d60728b4567",
    // "566965d44bdc2d814c8b4571", // Loot container
    // "5448bf274bdc2dfc2f8b456a", // Port. container
    "5448e5284bdc2dcb718b4567",
    "557596e64bdc2dc2118b4571",
    "62f109593b54472778797866",
    "6050cac987d3f925bf016837",
    "5447b5fc4bdc2d87278b4567",
    "5447b5f14bdc2d61278b4567",
    "5447bedf4bdc2d87278b4568",
    "5447bed64bdc2d97278b4568",
    "5447b6194bdc2d67278b4567",
    "5447b5cf4bdc2d65278b4567",
    "617f1ef5e8b54b0998387733",
    "5447b6094bdc2dc3278b4567",
    "5447b5e04bdc2d62278b4567",
    "5447b6254bdc2dc3278b4568",
    "5447bee84bdc2dc3278b4569",
    "543be5f84bdc2dd4348b456a",
    "55d720f24bdc2d88028b456d",
    "5671435f4bdc2d96058b4569",
    "5448fe124bdc2da5018b4567",
    "566168634bdc2d144c8b456c",
    "5795f317245977243854e041",
    "566abbb64bdc2d144c8b457d",
    "567583764bdc2d98058b456e",
    "5422acb9af1c889c16000029",
    "5448e8d64bdc2dce718b4568",
    "5448e8d04bdc2ddf718b4569",
    "5c99f98d86f7745c314214b3",
    "5c164d2286f774194c5e69fa",
    "5448f3a14bdc2d27728b4569",
    "5448f39d4bdc2d0a728b4568",
    "5448f3ac4bdc2dce718b4569",
    "5448f3a64bdc2d60728b456a",
    "5f4fbaaca5573a5ac31db429",
    "61605ddea09d851a0a0c1bbc",
    "616eb7aea207f41933308f46",
    "5485a8684bdc2da71d8b4567",
    "543be5cb4bdc2deb348b4568",
    "543be5dd4bdc2deb348b4569",
    "5448eb774bdc2d0a728b4567",
    "566162e44bdc2d3f298b4573",
    "543be6674bdc2df1348b4569",
    "5448ecbe4bdc2d60728b4568",
    "543be5e94bdc2df1348b4568",
    "5447e1d04bdc2dff2f8b4567",
    "567849dd4bdc2d150f8b456e",
    "543be5664bdc2dd4348b4569",
    "5447e0e74bdc2d3c308b4567",
    "5661632d4bdc2d903d8b456b",
    "543be6564bdc2df4348b4568", // Throwable weapon
];
const scavcaseItemBlacklist = [
    // Blacklist (itemIDs) to always exclude items from reward list
    "634959225289190e5e773b3b",
    "59f32bb586f774757e1e8442",
    "59f32c3b86f77472a31742f0",
    "62963c18dbc8ab5f0d382d0b",
    "62a61bbf8ec41a51b34758d2",
    "60a7ad3a0c5cb24b0134664a",
    "60a7ad2a2198820d95707a2e",
    "5c0e874186f7745dc7616606",
    "60a7acf20c5cb24b01346648",
    "5c0e842486f77443a74d2976",
    "628e4dd1f477aa12234918aa",
    "58ac60eb86f77401897560ff",
    "5b3b713c5acfc4330140bd8d",
    "628b9784bcf6e2659e09b8a2",
    "628b9c7d45122232a872358f",
    "609e860ebd219504d8507525",
    "59ef13ca86f77445fd0e2483",
    "5943d9c186f7745a13413ac9",
    "5996f6d686f77467977ba6cc",
    "5996f6cb86f774678763a6ca",
    "5996f6fc86f7745e585b4de3",
    "5df8a6a186f77412640e2e80",
    "5df8a72c86f77412640e2e83",
    "5df8a77486f77412672a1e3f",
    "5c0e541586f7747fa54205c9",
    "628bc7fb408e2b2e9c0801b1", // Mystery Ranch NICE COMM 3 BVS frame system
];
class Mod {
    postDBLoad(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        // const ObjectId = container.resolve<ObjectId>("ObjectId") // [Debug]
        const tables = databaseServer.getTables();
        const locales = tables.locales.global;
        const items = tables.templates.items;
        const handbook = tables.templates.handbook;
        const prices = tables.templates.prices;
        const globals = tables.globals.config;
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const hideoutConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.HIDEOUT);
        const insuranceConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.INSURANCE);
        const scavcaseConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.SCAVCASE);
        const prapor = tables.traders["54cb50c76803fa8b248b4571"];
        const therapist = tables.traders["54cb57776803fa99248b456e"];
        const ragman = tables.traders["5ac3b934156ae10c4430e83c"];
        const jaeger = tables.traders["5c0647fdd443bc2504c2d371"];
        const mechanic = tables.traders["5a7c2eca46aef81a7ca2145d"];
        const peacekeeper = tables.traders["5935c25fb3acc3127c3d8cd9"];
        const skier = tables.traders["58330581ace78e27b8b10cee"];
        const traderlist = [prapor, therapist, ragman, jaeger, mechanic, peacekeeper, skier];
        if (config_json_1.default.ScavCaseOptions.enabled == true) {
            if (config_json_1.default.ScavCaseOptions.BetterRewards.enabled == true) {
                // buyableitems generator, to make sure rare unbuyable items always are in reward pool (eg anodised red gear)
                let buyableitems = new Set();
                for (const trader of traderlist) {
                    trader.assort.items.filter((x) => buyableitems.add(x._tpl));
                }
                // Shitlist generator for scav case rewards. Filters A LOT of crap out, but very conservatevely. Blacklist included in ./docs folder check it out.
                // Always includes items in carefully curated whitelist. Always includes unbuyable and/or cheap items not included in whitelist (such as anodized red gear, but also some crap like scav only hats). Always includes items worth > 10000. Filters everything else out. Spent a lot of time thinking about this, really proud of myself. In the end, just makes sure you almost always get something of valuable or usable.
                // let scavWhitelist = [] // [Debug] used for debug code below
                for (const i in items) {
                    const item = items[i];
                    if (item._type == "Item") {
                        const itemInHandbook = getItemInHandbook(item._id);
                        if ((itemInHandbook?.Price >= 10000 || scavcaseWhitelist.includes(item._parent) || !buyableitems.has(item._id)) &&
                            !scavcaseItemBlacklist.includes(item._id) &&
                            item._props.QuestItem != true &&
                            itemInHandbook?.Price != undefined
                        // && !scavcaseConfig.rewardItemParentBlacklist.includes(item._parent) // [Debug] not actually needed, used only for reference when generating black/whitelists. Ignore(? TODO: look into it) ammo and money here, they are a special case in SPI-AKI logic.
                        ) {
                            // whitelist here, do nothing.
                            // scavWhitelist.push(item._id) // [Debug] used for debug code below
                            // log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
                        }
                        else {
                            scavcaseConfig.rewardItemBlacklist.push(item._id);
                            // shitlist here.
                            // log(getItemName(item._parent) + "	" + itemInHandbook?.Price + "	" + getItemName(item._id) + "	" + item._id) // [Debug]
                        }
                    }
                }
            }
            if (config_json_1.default.ScavCaseOptions.Rebalance.enabled == true) {
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
                };
                const scavCaseRedone = [
                    {
                        _id: "62710974e71632321e5afd5f",
                        ProductionTime: 2500,
                        Requirements: [
                            {
                                templateId: "62a09f32621468534a797acb",
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
                                templateId: "5d40407c86f774318526545a",
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
                                templateId: "5d403f9186f7743cac3f229b",
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
                                templateId: "5d1b376e86f774252519444e",
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
                                templateId: "5c12613b86f7743bbe2c3f76",
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
                ];
                tables.hideout.scavcase = scavCaseRedone; // mi donta undestanda tem red wavy lines, tis bad? tis worka! tis gooda! donta cera wavy lines.
            }
            if (config_json_1.default.ScavCaseOptions.FasterScavcase.enabled == true) {
                tables.hideout.scavcase.forEach((x) => (x.ProductionTime /= config_json_1.default.ScavCaseOptions.FasterScavcase.SpeedMultiplier));
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
        if (config_json_1.default.HideoutOptions.enabled == true) {
            // 100x Faster hideout production, 10x superwater and moonshine production, bitcoins
            for (let prod in tables.hideout.production) {
                const endProduct = tables.hideout.production[prod].endProduct;
                let productionTime = tables.hideout.production[prod].productionTime;
                if ((endProduct == "5d1b376e86f774252519444e" || endProduct == "5d1b33a686f7742523398398") &&
                    config_json_1.default.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.enabled) {
                    // superwater and moonshine
                    tables.hideout.production[prod].productionTime = Math.round(productionTime / config_json_1.default.HideoutOptions.Faster_Moonshine_and_Purified_Water_Production.Base_Moonshine_And_Water_Time_Multiplier);
                }
                else if (endProduct == "59faff1d86f7746c51718c9c" && config_json_1.default.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
                    // bitcoins
                    tables.hideout.production[prod].productionTime = Math.round(productionTime / config_json_1.default.HideoutOptions.Faster_Bitcoin_Farming.Base_Bitcoin_Time_Multiplier);
                }
                else if (config_json_1.default.HideoutOptions.Faster_Crafting_Time.enabled) {
                    // all other crafts
                    tables.hideout.production[prod].productionTime = Math.round(productionTime / config_json_1.default.HideoutOptions.Faster_Crafting_Time.Base_Crafting_Time_Multiplier);
                }
            }
            if (config_json_1.default.HideoutOptions.Faster_Crafting_Time.enabled && config_json_1.default.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.enabled) {
                // Buff to hideout exp rate, more testing needed
                hideoutConfig.hoursForSkillCrafting /= config_json_1.default.HideoutOptions.Faster_Crafting_Time.Hideout_Skill_Exp_Fix.Hideout_Skill_Exp_Multiplier;
            }
            if (config_json_1.default.HideoutOptions.Faster_Bitcoin_Farming.enabled) {
                // Instead of modifing base farming time try this:
                tables.hideout.settings.gpuBoostRate = config_json_1.default.HideoutOptions.Faster_Bitcoin_Farming.GPU_Efficiency;
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
            if (config_json_1.default.HideoutOptions.Faster_Hideout_Construction.enabled) {
                // 100x Faster hideout construction
                for (const area in tables.hideout.areas) {
                    for (const stage in tables.hideout.areas[area].stages) {
                        tables.hideout.areas[area].stages[stage].constructionTime = Math.round(tables.hideout.areas[area].stages[stage].constructionTime / config_json_1.default.HideoutOptions.Faster_Hideout_Construction.Hideout_Construction_Time_Multiplier);
                    }
                }
            }
            if (config_json_1.default.HideoutOptions.Increased_Fuel_Consumption.enabled) {
                // 10x faster fuel draw
                tables.hideout.settings.generatorFuelFlowRate *= config_json_1.default.HideoutOptions.Increased_Fuel_Consumption.Fuel_Consumption_Multiplier;
            }
        }
        if (config_json_1.default.OtherTweaks.enabled == true) {
            if (config_json_1.default.OtherTweaks.Skill_Exp_Buffs.enabled) {
                // Buff Vitality, Sniper and Surgery skill leveling
                globals.SkillsSettings.Vitality.DamageTakenAction *= 10;
                globals.SkillsSettings.Sniper.WeaponShotAction *= 10;
                globals.SkillsSettings.Surgery.SurgeryAction *= 10;
                globals.SkillsSettings.StressResistance.LowHPDuration *= 10;
            }
            if (config_json_1.default.OtherTweaks.Faster_Examine_Time.enabled) {
                // Faster ExamineTime
                Object.values(items)
                    .filter((x) => x._props.ExamineTime != undefined)
                    .forEach((x) => (x._props.ExamineTime /= 5));
            }
            if (config_json_1.default.OtherTweaks.Remove_Backpack_Restrictions.enabled) {
                // Remove backpack restrictions (for containers [ammo, med, etc] mostly).
                // Never again I'll see an unlootable medcase in 314...
                for (const itemID in items) {
                    const item = items[itemID];
                    if (item._props.ExaminedByDefault != undefined) {
                        item._props.ExaminedByDefault = true; //debug
                    }
                    if (true) {
                        let filtered;
                        try {
                            filtered = item._props.Grids[0]._props.filters[0].ExcludedFilter;
                        }
                        catch (error) { }
                        if (filtered !== undefined) {
                            if (filtered.includes("5aafbcd986f7745e590fff23")) {
                                item._props.Grids[0]._props.filters[0].ExcludedFilter = [];
                            }
                        }
                    }
                }
            }
            if (config_json_1.default.OtherTweaks.Keytool_Buff.enabled) {
                // Other opinionated tweaks:
                // keytool buff to make it 5x5
                tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsH = 5;
                tables.templates.items["59fafd4b86f7745ca07e1232"]._props.Grids[0]._props.cellsV = 5;
            }
            if (config_json_1.default.OtherTweaks.SICC_Case_Buff.enabled) {
                // Huge buff to SICC case to make it actually not shit and a direct upgrade to Docs. And while we are here, allow it to hold keytool. It's Softcore, who cares.
                let mergeFilters = [
                    ...new Set([
                        ...tables.templates.items["590c60fc86f77412b13fddcf"]._props.Grids[0]._props.filters[0].Filter,
                        ...tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter,
                        "59fafd4b86f7745ca07e1232", // keytool
                    ]),
                ];
                tables.templates.items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter = mergeFilters;
                // log(mergeFilters.map((x) => getItemName(x)))
            }
            if (config_json_1.default.OtherTweaks.Reshala_Always_Has_GoldenTT.enabled) {
                // Reshala always has his Golden TT
                tables.bots.types.bossbully.chances.equipment.Holster = 100;
                tables.bots.types.bossbully.inventory.equipment.Holster = { "5b3b713c5acfc4330140bd8d": 1 };
            }
        }
        if (config_json_1.default.InsuranceChanges.enabled == true) {
            // Redo insurance. Prapor in an instant return with 50% chance, costs 10% of item value, Therapist has 2 hour return with 80% chance, costs 20%.
            prapor.base.insurance.min_return_hour = 0;
            prapor.base.insurance.max_return_hour = 0;
            prapor.base.insurance.max_storage_time = 720;
            therapist.base.insurance.min_return_hour = 2;
            therapist.base.insurance.max_return_hour = 2;
            therapist.base.insurance.max_storage_time = 720;
            insuranceConfig.insuranceMultiplier["54cb50c76803fa8b248b4571"] = 0.1;
            insuranceConfig.insuranceMultiplier["54cb57776803fa99248b456e"] = 0.2;
            insuranceConfig.returnChancePercent["54cb50c76803fa8b248b4571"] = 50;
            insuranceConfig.returnChancePercent["54cb57776803fa99248b456e"] = 80;
        }
        if (config_json_1.default.EconomyOptions.enabled == true) {
            // Ragfair changes:
            if (config_json_1.default.EconomyOptions.Disable_Flea_Market_Completely.disable == true) {
                globals.RagFair.minUserLevel = 99;
            }
            else {
                globals.RagFair.minUserLevel = config_json_1.default.EconomyOptions.Fleamarket_Opened_at_Level.value;
                for (let handbookItem in tables.templates.handbook.Items) {
                    const itemInHandbook = tables.templates.handbook.Items[handbookItem];
                    const itemID = itemInHandbook.Id;
                    if (prices[itemID] != undefined && config_json_1.default.EconomyOptions.Price_Rebalance.enabled == true) {
                        // Change all Flea prices to handbook prices.
                        prices[itemID] = itemInHandbook.Price;
                    }
                    if (!fleaWhitelist.includes(itemInHandbook.ParentId) && config_json_1.default.EconomyOptions.Pacifist_FleaMarket.enabled == true) {
                        // Ban everything on flea except whitelist handbook categories above.
                        items[itemID]._props.CanSellOnRagfair = false;
                    }
                }
                if (config_json_1.default.EconomyOptions.Price_Rebalance.enabled == true) {
                    // Hardcode fix for important or unbalanced items. Too low prices can't convert to barters.
                    prices["5aa2b923e5b5b000137b7589"] *= 5; // Round frame sunglasses
                    prices["59e770b986f7742cbd762754"] *= 2; // Anti-fragmentation glasses
                    prices["5f5e45cc5021ce62144be7aa"] *= 2; // LolKek 3F Transfer tourist backpack
                    prices["5751487e245977207e26a315"] = 1500; // Emelya
                    prices["57347d3d245977448f7b7f61"] = 2000; // Croutons
                }
                // Unban random spawn only quest keys from flea, make them 2x expensive
                if (config_json_1.default.EconomyOptions.Pacifist_FleaMarket.Enable_QuestKeys.enabled == true) {
                    for (const questKey of questKeys) {
                        prices[questKey] *= 2;
                        items[questKey]._props.CanSellOnRagfair = true;
                    }
                }
                if (config_json_1.default.EconomyOptions.Pacifist_FleaMarket.Enable_Whitelist.enabled) {
                    // Unban whitelist
                    for (const item of itemWhitelist) {
                        items[item]._props.CanSellOnRagfair = true;
                    }
                }
                if (config_json_1.default.EconomyOptions.Disable_Selling_on_Flea.sellingDisabled == true) {
                    // Completely disable selling items
                    ragfairConfig.sell.chance.base = 0;
                    // Untill this is fixed (https://dev.sp-tarkov.com/SPT-AKI/Server/issues/3098), no sellorino amigo.
                    // Will enable selling in SPT 3.5 with further tweaks, since prices are quite balanced now.
                    // WIP
                    //ragfairConfig.sell.chance.overprices = 0 // block overpriced abuse. you have to sell for < DB fleaprice (use my Item info mod to see it)
                    //ragfairConfig.sell.reputation.gain *= 10
                    //ragfairConfig.sell.reputation.loss *= 10
                    //ragfairConfig.sell.time.base = 1
                    //ragfairConfig.sell.time.min = 1
                    //ragfairConfig.sell.time.max = 1
                }
                // Sligtly increase flea prices, but with bigger variance, you still get a lot of great trades. Hustle.
                ragfairConfig.dynamic.price.min *= config_json_1.default.EconomyOptions.Flea_Prices_Increased.multiplier; // 0.8 -> 1.04
                ragfairConfig.dynamic.price.max *= config_json_1.default.EconomyOptions.Flea_Prices_Increased.multiplier; // 1.2 -> 1.56
                if (config_json_1.default.EconomyOptions.Flea_Pristine_Items.enabled == true) {
                    // Only pristine items are offered on flea.
                    ragfairConfig.dynamic.condition.min = 1;
                }
                if (config_json_1.default.EconomyOptions.Only_Found_In_Raid_Items_Allowed_For_Barters.enabled == true) {
                    //Allow FIR only items for barters. This is default, so just in case. To make a point.
                    globals.RagFair.isOnlyFoundInRaidAllowed = true;
                }
                else {
                    globals.RagFair.isOnlyFoundInRaidAllowed = false;
                }
                if (config_json_1.default.EconomyOptions.Barter_Economy.enabled == true) {
                    // Can only barter from items not in the blacklist. Only allows base classes, and not itemIDs =(
                    ragfairConfig.dynamic.barter.itemTypeBlacklist = fleaBarterBlacklist;
                    ragfairConfig.dynamic.barter.chancePercent = 100 - config_json_1.default.EconomyOptions.Barter_Economy.Cash_Offers_Percentage.value; // Allow 10% of listings for cash
                    ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100; // Barters only for items that cost > 100
                    ragfairConfig.dynamic.barter.priceRangeVariancePercent = config_json_1.default.EconomyOptions.Barter_Economy.Barter_Price_Variance.value; // more variance for flea barters, seems actually fun!
                    // Max 2 for 1 barters.
                    ragfairConfig.dynamic.barter.itemCountMax = config_json_1.default.EconomyOptions.Barter_Economy.itemCountMax.value;
                    BSGblacklist.filter((x) => {
                        // dirty hack to block BSG blacklisted items (dogtags, bitcoins, ornaments and others) from barters, since you can't buy them on flea anyway, so it should not matter.
                        if (x == "59faff1d86f7746c51718c9c" && config_json_1.default.EconomyOptions.Barter_Economy.Unban_Bitcoins_For_Barters.enabled == true) {
                            // do nothing
                        }
                        else {
                            // 2 is used to pass getFleaPriceForItem check and not trigger generateStaticPrices
                            prices[x] = 2;
                            if (items[x]._props.CanSellOnRagfair == true) {
                                log(`Item ${getItemName(x)} can be bought on flea for free, you dirty cheater!`);
                            }
                        }
                    });
                    // Max 20 offers. Too low of a number breaks AKI server for some reason, with constant client errors on completed trades.
                    // More random trades variance anyway, this is fun.
                    ragfairConfig.dynamic.offerItemCount.min = config_json_1.default.EconomyOptions.Barter_Economy.offerItemCount.min;
                    ragfairConfig.dynamic.offerItemCount.max = config_json_1.default.EconomyOptions.Barter_Economy.offerItemCount.max;
                    // Max 2 items per offer. Feels nice. Loot more shit, it might come in handy.
                    ragfairConfig.dynamic.nonStackableCount.min = config_json_1.default.EconomyOptions.Barter_Economy.nonStackableCount.min;
                    ragfairConfig.dynamic.nonStackableCount.max = config_json_1.default.EconomyOptions.Barter_Economy.nonStackableCount.max;
                }
            }
            if (config_json_1.default.EconomyOptions.Pacifist_Fence.enabled == true) {
                // Add BSGblacklist and mod custom blacklist to Fence blacklists
                let commonBlacklist = [];
                commonBlacklist.push(...BSGblacklist, ...fleaBarterBlacklist);
                // Fence sells only items that are not in the flea blacklist
                traderConfig.fence.assortSize = config_json_1.default.EconomyOptions.Pacifist_Fence.Number_Of_Fence_Offers;
                traderConfig.fence.blacklist = commonBlacklist; //itemid or baseid
                traderConfig.fence.maxPresetsPercent = 0;
                traderConfig.fence.itemPriceMult = 0.8; // at 6 Fence karma you buy items almost at a price Therapist buys from you. Go grind.
            }
        }
        if (config_json_1.default.CraftingRebalance.enabled == true) {
            // Crafts:
            // This here, is some dumb stuff, I should've created some special class, controller, pushed the data out of the code or some other OOP bullcrap, but I'm not a programmer, so this will have to suffice. Sorry, not sorry.
            // 2x Clin production buff
            getCraft("59e358a886f7741776641ac3").count = 2;
            // 2x Paracord production buff
            getCraft("5c12688486f77426843c7d32").count = 2;
            // Water filter < 2 airfilter craft buff
            getCraft("5d1b385e86f774252167b98a").requirements.find((x) => x.templateId == "590c595c86f7747884343ad7").count = 2;
            // Toilet paper production nerf lol. Who would have thought this craft would be OP, huh?
            getCraft("5c13cef886f774072e618e82").count = 1;
            // EWR buff
            getCraft("60098b1705871270cd5352a1").count = 3;
            // Buff MULE
            getCraft("5ed51652f6c34d2cc26336a1").count = 2;
            // Surv12 nerf
            getCraft("5d02797c86f774203f38e30a").requirements.find((x) => x.templateId == "5e831507ea0a7c419c2f9bd9").templateId = "5af0454c86f7746bf20992e8";
            getCraft("5d02797c86f774203f38e30a").count = 1;
            // AFAK buff
            getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "590c678286f77426c9660122").count = 1;
            getCraft("60098ad7c2240c0fe85c570a").requirements.find((x) => x.templateId == "5751a25924597722c463c472").templateId = "5e8488fa988a8701445df1e4";
            // Portable defibrillator big nerf (Portable Powerbank 1 -> 4). Lore-friendly and still profitable, just not as ridiculous.
            getCraft("5c052e6986f7746b207bc3c9").requirements.find((x) => x.templateId == "5af0561e86f7745f5f3ad6ac").count = 4;
            // LEDX buff (Huge buff, 1 of each component only). Now it is actually only sometimes bother to craft it.
            getCraft("5c0530ee86f774697952d952").requirements.forEach((x) => {
                if (x.count) {
                    x.count = 1;
                }
            });
            // Virtex buff (Military circuit board 2 -> 1)
            getCraft("5c05308086f7746b2101e90b").requirements.find((x) => x.templateId == "5d0376a486f7747d8050965c").count = 1;
            // Military circuit board buff (1 -> 2)
            getCraft("5d0376a486f7747d8050965c").count = 2;
            // Military flash drive lore-based change (2 Secure Flash drive -> 1 VPX, and Topographic survey maps 2 -> 1). Not "profitable", but will change Intel folder craft to compensate.
            getCraft("62a0a16d0b9d3c46de5b6e97").requirements.forEach((x) => {
                if (x.count) {
                    x.count = 1;
                }
            });
            getCraft("62a0a16d0b9d3c46de5b6e97").requirements.find((x) => x.templateId == "590c621186f774138d11ea29").templateId = "5c05300686f7746dce784e5d";
            // Intelligence folder buff (Military flash drive 2 -> 1)
            getCraft("5c12613b86f7743bbe2c3f76").requirements.find((x) => x.templateId == "62a0a16d0b9d3c46de5b6e97").count = 1;
            // VPX buff (RAM and Broken GPhone smartphone 3 -> 2)
            getCraft("5c05300686f7746dce784e5d").requirements.forEach((x) => {
                if (x.count) {
                    x.count = 2;
                }
            });
            // FLIR huge buff (everything is 1, plus change SAS drive (wtf?!) to Armasight Vulcan MG 3.5x Bravo night vision scope)
            getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.forEach((x) => {
                if (x.count) {
                    x.count = 1;
                }
            });
            getCraft("5d1b5e94d7ad1a2b865a96b0").requirements.find((x) => x.templateId == "590c37d286f77443be3d7827").templateId = "5b3b6e495acfc4330140bd88";
            // CMS nerf (Medical tools 1 -> 2)
            getCraft("5d02778e86f774203e7dedbe").requirements.find((x) => x.templateId == "619cc01e0a7c3a1a2731940c").count = 2;
            // GRIzZLY nerf (1 -> 2)
            getCraft("590c657e86f77412b013051d").count = 1;
            // coffee buff (2 -> 3)
            getCraft("5af0484c86f7740f02001f7f").count = 3;
            // MPPV buff (KEKTAPE duct tape 2 -> 1)
            getCraft("5df8a42886f77412640e2e75").requirements.find((x) => x.templateId == "5e2af29386f7746d4159f077").count = 1;
            // bottled water buff water (8 -> 16)
            getCraft("5448fee04bdc2dbc018b4567").count = 16;
            // Topographic survey maps buff (1 -> 2)
            getCraft("62a0a124de7ac81993580542").count = 2;
            // Aquamari buff (3 -> 5)
            getCraft("5c0fa877d174af02a012e1cf").count = 5;
            // SJ6 buff (2 -> 3)
            getCraft("5c0e531d86f7747fa23f4d42").count = 3;
            // GPU buff (3 VPX -> 1 Virtex, 10 PCB -> 1, 10 CPU -> 1)
            getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").count = 1;
            getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "5c05300686f7746dce784e5d").templateId = "5c05308086f7746b2101e90b";
            getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "573477e124597737dd42e191").count = 1;
            getCraft("57347ca924597744596b4e71").requirements.find((x) => x.templateId == "590a3b0486f7743954552bdb").count = 1;
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
            ];
        }
        if (config_json_1.default.AdditionalCraftingRecipes.enabled == true) {
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
            };
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
            };
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
            };
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
            };
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
            };
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
            };
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
            };
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
            };
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
            };
            tables.hideout.production.push(ThreebTG, Adrenaline, L1, AHF1, CALOK, Ophthalmoscope, Zagustin, Obdolbos, OLOLO);
        }
        function getCraft(endProductID) {
            return tables.hideout.production.find((x) => x.endProduct == endProductID && x.areaType != 21);
        }
        function getItemInHandbook(itemID) {
            return handbook.Items?.find((i) => i.Id === itemID); // Outs: @Id, @ParentId, @Price
        }
        function getItemName(itemID, locale = "en") {
            if (locales[locale][`${itemID} Name`] != undefined) {
                // return items[itemID]._name
                return locales[locale][`${itemID} Name`];
            }
            else {
                return items[itemID]?._name;
            }
        }
    }
}
const log = (i) => {
    console.log(i);
};
module.exports = { mod: new Mod() };
