"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDiscoveryService = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const discovery_1 = require("@/services/discovery");
const enums_1 = require("@/typings/enums");
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const lodash_1 = require("lodash");
const configuration_1 = require("../configuration");
const logger = logger_1.default(module);
const { DISCOVERY_PROVIDER, SUPPORTED_DATASTORE_TYPES } = configuration_1.getConfig();
/**
 * Get the appropriate discovery provider.
 * @param app Handle to the Express application.
 * @returns Returns the appropriate DiscoveryProvider subclass.
 */
async function getDiscoveryProvider(datastoreServices) {
    if (!DISCOVERY_PROVIDER) {
        throw new Error('DISCOVERY_PROVIDER not specified in configuration.');
    }
    logger.info(`using discovery provider: ${DISCOVERY_PROVIDER}`);
    const ProviderClass = await class_loader_utils_1.loadClass(`@/services/discovery/providers/${DISCOVERY_PROVIDER}`);
    const discoveryMap = datastoreServices.reduce((prev, curr) => {
        const datastoreType = curr.getDatastoreType();
        prev[datastoreType] = {
            matcher: curr.discoveryCallback,
            ungroupClusters: curr.ungroupClustersCallback,
        };
        return prev;
    }, {});
    return new ProviderClass({ discoveryMap });
}
/**
 * Setup listeners for when clusters/environments/regions are loaded/updated.
 */
async function setupDiscoveryService(explorerCache, datastoreServices, store) {
    const provider = await getDiscoveryProvider(datastoreServices);
    const discoveryService = new discovery_1.DiscoveryService(provider);
    const { discovery } = store;
    discoveryService.on('loaded-clusters', (clusters) => {
        logger.info('clusters loaded');
        const clustersByTag = getGroupedClusters(clusters, 'datastoreType');
        lodash_1.forEach(clustersByTag, (datastoreClusters, datastoreType) => {
            logger.info(`loaded ${datastoreClusters.length} ${datastoreType} clusters`);
            const type = enums_1.DatastoreType[datastoreType.toUpperCase()];
            explorerCache.updateClusters(type, datastoreClusters);
        });
        discovery.clusters = clustersByTag;
        discovery.status = enums_1.State.SUCCESS;
        logger.info(`loaded ${clusters.length} total clusters`);
    });
    discoveryService.on('loaded-environments', (environments) => {
        logger.info(`loaded environments: ${environments}`);
        discovery.environments = environments;
    });
    discoveryService.on('loaded-regions', (regions) => {
        logger.info(`loaded regions: ${regions}`);
        discovery.regions = regions;
    });
    discoveryService.on('error', (err) => {
        logger.error(`failed to load discovery info: ${err.message}`);
        discovery.status = enums_1.State.ERROR;
    });
    discovery.status = enums_1.State.LOADING;
    return discoveryService;
}
exports.setupDiscoveryService = setupDiscoveryService;
function getGroupedClusters(clusters, groupByProp) {
    return lodash_1.chain(clusters)
        .groupBy(groupByProp)
        .pick(SUPPORTED_DATASTORE_TYPES)
        .value();
}
//# sourceMappingURL=discovery.js.map