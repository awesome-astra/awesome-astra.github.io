"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegionAccessible = exports.isClusterShared = exports.getAllKnownEnvironments = exports.getAllKnownRegions = exports.getRegion = exports.getAppStack = exports.getEnv = exports.getCluster = exports.getAvailableClusters = exports.getAppName = void 0;
const configuration_1 = require("@/config/configuration");
const constants_1 = require("@/config/constants");
const ClusterAclsNotLoadedError_1 = __importDefault(require("@/model/errors/ClusterAclsNotLoadedError"));
const DatastoreNotAvailableError_1 = __importDefault(require("@/model/errors/DatastoreNotAvailableError"));
const NoClustersAvailableErrors_1 = __importDefault(require("@/model/errors/NoClustersAvailableErrors"));
const store_1 = require("@/model/store");
const { ENVIRONMENTS, REGIONS } = configuration_1.getConfig();
/**
 * Gets the name of this application.
 * @param app The current Express app.
 * @returns Returns the current app name;
 */
function getAppName(app) {
    return app.get(constants_1.APP_NAME);
}
exports.getAppName = getAppName;
/**
 * Fetches the list of available clusters.
 * @param datastoreType The type of datastore to fetch clusters for.
 * @returns Returns an Array of cluster objects.
 */
function getAvailableClusters(datastoreType) {
    const { discovery } = store_1.getStore();
    const { clusters } = discovery;
    if (!clusters || Object.keys(clusters).length === 0) {
        throw new NoClustersAvailableErrors_1.default(datastoreType);
    }
    const datastoreClusters = clusters[datastoreType];
    if (!datastoreClusters) {
        throw new DatastoreNotAvailableError_1.default(datastoreType);
    }
    return datastoreClusters;
}
exports.getAvailableClusters = getAvailableClusters;
function getCluster(app, datastoreType, clusterName) {
    const clusters = getAvailableClusters(datastoreType);
    const localEnv = getEnv(app);
    const localRegion = getRegion(app);
    // TODO convert to map, avoid linear search
    return clusters.find((cluster) => cluster.name.toLowerCase() === clusterName.toLowerCase() &&
        cluster.env === localEnv &&
        cluster.region === localRegion);
}
exports.getCluster = getCluster;
/**
 * Gets the current environment (e.g. test or prod);
 * @param app The current Express app.
 * @returns Returns the current environment.
 */
function getEnv(app) {
    return app.get(constants_1.APP_ENV);
}
exports.getEnv = getEnv;
/**
 * Returns the name of this cluster. Note, the cluster name will include the stack name as well
 * (e.g. datatexplorer-stg).
 * @param app The current Express app.
 * @returns Returns the current cluster name.
 */
function getAppStack(app) {
    return app.get(constants_1.APP_CLUSTER_NAME);
}
exports.getAppStack = getAppStack;
/**
 * Gets the current AWS region (e.g. us-west-1);
 * @param app The current Express app.
 * @returns Returns the current AWS region.
 */
function getRegion(app) {
    return app.get(constants_1.APP_REGION);
}
exports.getRegion = getRegion;
/**
 * Fetches all defined regions. These are all the well-known regions which is likely a super-set
 * of all available regions.
 * @returns Returns an array of all the possible regions (valid or not).
 * @see getAvailableRegions
 */
function getAllKnownRegions() {
    return REGIONS;
}
exports.getAllKnownRegions = getAllKnownRegions;
/**
 * Fetches all the known environments. These are the well-known environments which is likely
 * a superset of all available environments.
 */
function getAllKnownEnvironments() {
    return ENVIRONMENTS;
}
exports.getAllKnownEnvironments = getAllKnownEnvironments;
function isClusterShared(clusterName) {
    const { accessControl } = store_1.getStore();
    const clusterAclMap = accessControl.clusterAclMap;
    if (!clusterAclMap) {
        throw new ClusterAclsNotLoadedError_1.default(clusterName);
    }
    const clusterACLDef = clusterAclMap[clusterName.toLowerCase()];
    if (!clusterACLDef) {
        return false;
    }
    return clusterACLDef.isShared;
}
exports.isClusterShared = isClusterShared;
/**
 * Helper method for checking if a region and environment is accessible by the current app.
 * For instance, this app might be running in us-east.
 * @param app The current Express app.
 * @param region The region to check.
 * @param env The environment to check.
 * @returns Returns true if the given region and env is accessible.
 */
function isRegionAccessible(app, region, env) {
    return region === getRegion(app) && env === getEnv(app);
}
exports.isRegionAccessible = isRegionAccessible;
//# sourceMappingURL=app-utils.js.map