import Ajv, { JSONSchemaType, type ValidateFunction } from "ajv";
import * as fs from "node:fs";
import * as json5 from "json5";
import { join } from "node:path";
import ConfigurationSchema from "../schemas/ConfigSchema";
import type { Configuration } from "../types";

/**
 * ConfigServer Class - Credits to https://github.com/refringe/CustomRaidTimes/blob/main/src/servers/ConfigServer.ts
 *
 * The ConfigServer class is responsible for managing the application's configuration settings.
 * It provides functionality to load and validate a configuration file, which is specified in JSON5 format.
 * The class checks the validity of the configuration and ensures that they match the schema.
 */
export class ConfigServer {
    private relativeConfigPath: string;
    private configPath: string;
    private config: Configuration | unknown | null = null;
    private isLoaded = false;
    private isValid = false;

    // JSON schema validator & config schema
    private ajv: Ajv;
    private validate: ValidateFunction;
    private configSchema: JSONSchemaType<Configuration>;

    /**
     * Constructs a new ConfigServer instance.
     * Automatically loads and validates the configuration file specified by the relative path.
     *
     * @param {string} relativeConfigPath - The relative path to the configuration file.
     */
    constructor(relativeConfigPath = "../../config/config.json5") {
        this.relativeConfigPath = relativeConfigPath;
        this.configPath = this.buildConfigPath();

        this.ajv = new Ajv();
        this.configSchema = ConfigurationSchema;
        this.validate = this.ajv.compile(this.configSchema);
    }

    /**
     * Constructs the absolute path to the configuration file based on its relative path.
     *
     * @returns {string} - The absolute path to the configuration file.
     */
    private buildConfigPath(): string {
        return join(__dirname, this.relativeConfigPath);
    }

    /**
     * Loads the configuration from a file. Sets the `isLoaded` flag to true if successful, false otherwise. Throws a
     * ConfigError if the file cannot be loaded.
     *
     * @returns {this} - Returns the ConfigServer instance.
     */
    public loadConfig(): this {
        try {
            const configFileContent = fs.readFileSync(this.configPath, "utf-8");
            this.config = json5.parse(configFileContent) as unknown; // Still needs validation.
            this.isLoaded = true;
        } catch (error) {
            this.config = null;
            this.isLoaded = false;
            this.isValid = false;
            throw new Error("CONFIG_LOAD_ERROR - Could not load configuration");
        }
        return this;
    }

    /**
     * Validates the loaded configuration. Sets the `isValid` flag to true if the validation is successful, false
     * otherwise. Throws a ConfigError if the configuration is not loaded or is invalid.
     *
     * @returns {this} - Returns the ConfigServer instance.
     */
    public validateConfig(): this {
        if (!this.isLoaded) {
            throw new Error("CONFIG_NOT_LOADED - Configuration not loaded");
        }

        if (this.config === null) {
            throw new Error("CONFIG_IS_NULL - Configuration is null");
        }

        const valid = this.validate(this.config);
        if (!valid) {
            this.config = null;
            this.isValid = false;
            throw new Error(
                `CONFIG_VALIDATION_ERROR - Configuration validation failed - ${this.ajv.errorsText(this.validate.errors)}`
            );
        }

        this.config = this.config as Configuration; // Safe cast after validation.
        this.isValid = true;

        return this;
    }

    /**
     * Type guard for the Configuration type.
     *
     * @param {unknown} config - The configuration to check.
     * @returns {boolean} - True if the configuration is valid, false otherwise.
     */
    private isConfiguration(config: unknown): config is Configuration {
        return this.validate(config) as boolean;
    }

    /**
     * Retrieves the loaded and validated configuration.
     *
     * @returns {Configuration | null} - The loaded and validated configuration, or null if the configuration invalid.
     */
    public getConfig(): Configuration | null {
        if (!this.isValid) {
            throw new Error("CONFIG_INVALID - Configuration not valid or not loaded");
        }

        if (this.config !== null && this.isConfiguration(this.config)) {
            return this.config;
        }

        return null;
    }
}
