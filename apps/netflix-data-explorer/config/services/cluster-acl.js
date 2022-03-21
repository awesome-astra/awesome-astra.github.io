"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupClusterAccessControlService = void 0;
const ClusterAccessControlService_1 = __importDefault(require("@/services/cluster-acls/ClusterAccessControlService"));
const enums_1 = require("@/typings/enums");
const app_utils_1 = require("@/utils/app-utils");
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const configuration_1 = require("../configuration");
const logger_1 = __importDefault(require("../logger"));
const { CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER } = configuration_1.getConfig();
const logger = logger_1.default(module);
async function getClusterAccessControlProvider(app) {
    if (!CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER) {
        throw new Error('CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER not specified in configuration.');
    }
    const EntityAccessControlLoaderClass = await class_loader_utils_1.loadClass(`@/services/cluster-acls/providers/${CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER}`);
    // TODO revisit global state
    return new EntityAccessControlLoaderClass(app_utils_1.getAllKnownEnvironments(), app_utils_1.getAllKnownRegions(), app_utils_1.getEnv(app), app_utils_1.getRegion(app));
}
/**
 * Sets up and starts the access control service which polls the specified
 * provider to fetch the mapping of clusters to allowed users/groups.
 * @param app The Express application.
 */
async function setupClusterAccessControlService(app, store) {
    const dataAccessControlService = new ClusterAccessControlService_1.default();
    dataAccessControlService.use(await getClusterAccessControlProvider(app));
    const { accessControl } = store;
    accessControl.status = enums_1.State.LOADING;
    dataAccessControlService.on('loaded', (clusterAclMap) => {
        accessControl.clusterAclMap = clusterAclMap;
        accessControl.status = enums_1.State.SUCCESS;
    });
    dataAccessControlService.on('error', (err) => {
        logger.error('failed fetch cluster access control information', err.message);
        accessControl.status = enums_1.State.ERROR;
    });
    return dataAccessControlService;
}
exports.setupClusterAccessControlService = setupClusterAccessControlService;
//# sourceMappingURL=cluster-acl.js.map