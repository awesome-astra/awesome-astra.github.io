"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEnv = void 0;
const configuration_1 = require("@/config/configuration");
const constants_1 = require("@/config/constants");
const logger_1 = __importDefault(require("./logger"));
const logger = logger_1.default(module);
const { ENV_VAR_APP_NAME, ENV_VAR_APP_CLUSTER, ENV_VAR_ENV, ENV_VAR_REGION, ENVIRONMENTS, REGIONS, } = configuration_1.getConfig();
function setupEnv(app) {
    if (process.env[ENV_VAR_ENV]) {
        app.set(constants_1.APP_ENV, process.env[ENV_VAR_ENV]);
    }
    else {
        if (ENVIRONMENTS.length === 0) {
            throw new Error('At least one environment must be defined.');
        }
        logger.info(`Defaulting to environment: ${ENVIRONMENTS[0]}`);
        app.set(constants_1.APP_ENV, ENVIRONMENTS[0]);
    }
    if (process.env[ENV_VAR_REGION]) {
        app.set(constants_1.APP_REGION, process.env[ENV_VAR_REGION]);
    }
    else {
        if (REGIONS.length === 0) {
            throw new Error('At least one region must be defined.');
        }
        logger.info(`Defaulting to region: ${REGIONS[0]}`);
        app.set(constants_1.APP_REGION, REGIONS[0]);
    }
    app.set(constants_1.APP_NAME, process.env[ENV_VAR_APP_NAME] || 'nfdataexplorer2');
    app.set(constants_1.APP_CLUSTER_NAME, process.env[ENV_VAR_APP_CLUSTER] || 'nfdataexplorer2');
    logger.info(`Using APP_ENV: ${app.get(constants_1.APP_ENV)}`);
    logger.info(`Using APP_REGION: ${app.get(constants_1.APP_REGION)}`);
    logger.info(`Using APP_NAME: ${app.get(constants_1.APP_NAME)}`);
    logger.info(`Using APP_CLUSTER_NAME: ${app.get(constants_1.APP_CLUSTER_NAME)}`);
}
exports.setupEnv = setupEnv;
//# sourceMappingURL=setup-env.js.map