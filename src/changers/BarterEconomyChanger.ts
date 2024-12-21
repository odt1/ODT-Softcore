import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { BarterEconomy } from "../types";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { PrefixLogger } from "../util/PrefixLogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { MinMax } from "@spt/models/common/MinMax";
import { fleaBarterRequestWhitelist, fleaBarterRequestBlacklistItems } from "../assets/fleamarket";
import { IItemConfig } from "@spt/models/spt/config/IItemConfig";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

export class BarterEconomyChanger {
    private logger: PrefixLogger;
    private tables: IDatabaseTables;
    private ragfairConfig: IRagfairConfig;
    private itemconfig: IItemConfig;

    constructor(container: DependencyContainer) {
        this.logger = PrefixLogger.getInstance();
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        this.tables = databaseServer.getTables();
        this.ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        this.itemconfig = configServer.getConfig<IItemConfig>(ConfigTypes.ITEM);
    }

    public apply(config: BarterEconomy) {
        if (!config.enabled) {
            return;
        }

        this.doBarterEconomy();
        this.adjustCashOffers(config.cashOffersPercentage);
        this.adjustBarterPriceVariance(config.barterPriceVariance);
        this.adjustItemCountMax(config.itemCountMax);
        this.adjustOfferItemCount(config.offerItemCount);
        this.adjustNonStackableAmount(config.nonStackableCount);

        if (config.unbanBitcoinsForBarters) {
            this.doUnbanBitcoinsForBarters();
        }
    }

    private doBarterEconomy() {
        const barterBlacklist = Object.values(BaseClasses).filter((baseClass) => !fleaBarterRequestWhitelist.includes(baseClass));

        this.ragfairConfig.dynamic.barter.itemTypeBlacklist = barterBlacklist;
        this.ragfairConfig.dynamic.barter.minRoubleCostToBecomeBarter = 100;
        // Add further unwanted barter items to itemconfig.blacklist as that is used by SPT when adding Barters to Flea.
        // This makes it so, that we don't have to adjust the prices of items, so they can still be sold.
        // No need to add QuestItems as those are already considered blacklisted by SPT.
        let itemBlacklist = this.itemconfig.blacklist;
        itemBlacklist = itemBlacklist.concat(fleaBarterRequestBlacklistItems);
        this.itemconfig.blacklist = [...new Set(itemBlacklist)];

        const handbookItems = this.tables.templates?.handbook.Items;
        if (!handbookItems) {
            this.logger.warning("BarterEconomyChanger: doBarterEconomy: Handbook not found, skipping price adjust");
            return;
        }
        //handbookItems[ItemTpl.BARTER_FARFORWARD_GPS_SIGNAL_AMPLIFIER_UNIT].price = 2680970;
        //handbookItems[ItemTpl.BARTER_ADVANCED_CURRENT_CONVERTER].price = 6648292;
        //handbookItems[ItemTpl.BARTER_MICROCONTROLLER_BOARD].price = 1566360;
    }

    private adjustCashOffers(cashOffersPercentage: number) {
        this.ragfairConfig.dynamic.barter.chancePercent = 100 - cashOffersPercentage;
    }

    private adjustBarterPriceVariance(barterPriceVariance: number) {
        this.ragfairConfig.dynamic.barter.priceRangeVariancePercent = barterPriceVariance;
    }

    private adjustItemCountMax(itemCountMax: number) {
        this.ragfairConfig.dynamic.barter.itemCountMax = itemCountMax;
    }

    private adjustOfferItemCount(minMaxRecord: MinMax) {
        this.ragfairConfig.dynamic.offerItemCount = minMaxRecord;
    }

    private adjustNonStackableAmount(minMaxRecord: MinMax) {
        this.ragfairConfig.dynamic.nonStackableCount = minMaxRecord;
    }

    private doUnbanBitcoinsForBarters() {
        this.itemconfig.blacklist = this.itemconfig.blacklist.filter(
            (item) => item !== ItemTpl.BARTER_PHYSICAL_BITCOIN,
        );
    }
}
