"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const DynomiteExplorer_1 = __importDefault(require("@/services/datastores/dynomite/lib/DynomiteExplorer"));
const BaseDatastoreService_1 = __importDefault(require("../base/BaseDatastoreService"));
const { CLUSTER_NAME_PATTERN_DYNOMITE } = configuration_1.getConfig();
const logger = logger_1.default(module);
class DynomiteDatastoreService extends BaseDatastoreService_1.default {
    getDatastoreType() {
        return 'dynomite';
    }
    connect(cluster) {
        logger.info(`creating new DynomiteExplorer for cluster: ${cluster.name}`);
        return Promise.resolve(new DynomiteExplorer_1.default(cluster));
    }
    discoveryCallback(appName) {
        return new RegExp(CLUSTER_NAME_PATTERN_DYNOMITE, 'i').test(appName);
    }
}
exports.default = DynomiteDatastoreService;
//# sourceMappingURL=index.js.map