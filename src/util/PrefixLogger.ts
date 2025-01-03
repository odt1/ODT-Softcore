import { DependencyContainer } from "tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";

export class PrefixLogger {
    private static instance: PrefixLogger | null = null;

    private readonly logger: ILogger;
    private readonly prefix: string;
    private debug: boolean;

    // Private constructor prevents direct instantiation
    private constructor(logger: ILogger, prefix: string, debug: boolean) {
        this.logger = logger;
        this.prefix = prefix;
        this.debug = debug;
    }

    // Singleton initializer
    public static getInstance(container?: DependencyContainer, debug = false): PrefixLogger {
        if (!PrefixLogger.instance) {
            if (!container) {
                throw new Error("PrefixLogger: Container not provided");
            }
            const logger = container.resolve<ILogger>("WinstonLogger");
            PrefixLogger.instance = new PrefixLogger(logger, "[Softcore]", debug);
        }
        return PrefixLogger.instance;
    }

    public setDebug(debug: boolean) {
        this.debug = debug;
    }

    public info(message: string) {
        this.logger.info(`${this.prefix} ${message}`);
    }

    public warning(message: string) {
        this.logger.warning(`${this.prefix} ${message}`);
    }

    public error(message: string) {
        this.logger.error(`${this.prefix} ${message}`);
    }

    public debugLog(message: string) {
        if (this.debug) {
            this.logger.info(`${this.prefix} [DEBUG] ${message}`);
        }
    }
}
