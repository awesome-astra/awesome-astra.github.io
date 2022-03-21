"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAstraConfiguration = exports.getConfig = exports.loadConfig = exports.init = void 0;
const set_utils_1 = require("@/utils/set-utils");
const fs_1 = require("fs");
const path_1 = require("path");
const baseConfig = __importStar(require("./base-config"));
let config;
const isTestEnv = process.env.NODE_ENV === 'test';
function init() {
    if (config && !isTestEnv) {
        throw new Error('config has already been loaded. `init` should only be called once at app startup.');
    }
    // check for available configuration overrides
    const path = path_1.join(__dirname, '/overrides');
    if (!fs_1.existsSync(path)) {
        console.warn(`Configuration overrides directory is empty.
      Expected to find an overridden config file in: ${path}.
      Please ensure you have run "yarn setup" to generate a config file.`);
        config = baseConfig;
        return;
    }
    const availableOverrides = fs_1.readdirSync(path)
        .filter((filename) => filename.endsWith(isTestEnv ? '.ts' : '.js'))
        .map((filename) => filename.split('.')[0]);
    const envConfigName = 'DATA_EXPLORER_CONFIG_NAME';
    const useEnvOverride = process.env[envConfigName];
    if (availableOverrides.length > 1 && !useEnvOverride) {
        throw new Error(`Multiple override files found: ${path}. Found: ${JSON.stringify(availableOverrides)}. If a single config file exists it will be used, but if multiple
      files exist, you must set environment variable "${envConfigName}".`);
    }
    else if (useEnvOverride) {
        if (availableOverrides.indexOf(useEnvOverride) < 0) {
            throw new Error(`Could not find an override named "${useEnvOverride}". Available overrides:
        ${JSON.stringify(availableOverrides)}. If you just added a new .ts override file, please ensure you have run a build.`);
        }
        console.log(`Loading config override: ${useEnvOverride}`);
        config = loadConfig(`@/config/overrides/${useEnvOverride}`);
    }
    else {
        // no override specified - just use base config
        console.log(`No environment overrides found. Defaulting to base config...`);
        config = baseConfig;
    }
}
exports.init = init;
/**
 * Loads the configuration for the app. First the base configuration will be loaded and any
 * overrides present in the `overrides` directory will be applied on top.
 */
function loadConfig(configModule) {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const customConfig = require(configModule);
    const newCustomProperties = set_utils_1.difference(new Set(Object.getOwnPropertyNames(customConfig)), new Set(Object.getOwnPropertyNames(baseConfig)));
    for (const propName of newCustomProperties) {
        console.warn(`Found new property "${propName}" in custom configuration override. Do you have a typo in the name of your property?`);
    }
    return Object.assign({}, baseConfig, customConfig);
}
exports.loadConfig = loadConfig;
/**
 * Fetches the configuration.
 * Expects `init` to have been called already.
 * @see init
 */
function getConfig() {
    if (config === undefined) {
        throw new Error('config is currently undefined. please ensure `init` is called during initialization');
    }
    return JSON.parse(JSON.stringify(config));
}
exports.getConfig = getConfig;
function setAstraConfiguration(token, bundleName) {
    if (config) {
        config.ASTRA_APPLICATION_TOKEN = token;
        config.ASTRA_SECURE_BUNDLE_NAME = bundleName;
    }
}
exports.setAstraConfiguration = setAstraConfiguration;
//# sourceMappingURL=configuration.js.map