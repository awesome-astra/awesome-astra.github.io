"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerForDatastore = void 0;
const services_1 = require("@/config/services");
const acl_utils_1 = require("./acl-utils");
const app_utils_1 = require("./app-utils");
/**
 * Utility method for fetching an Explorer instance for the given datastore using a cache-first method.
 * In case of a cache-miss, the `createExplorerCb` will be called to create the instance and add it to the cache.
 * Also enforces that the user has the access-rights necessary to acccess the given cluster.
 * @param req               The user's request object.
 * @param datastoreType     The datastore type to lookup.
 * @param clusterName       The name of the cluster to lookup.
 * @param createExplorerCb  The callback that will be called with the ClusterDefinition if found.
 *                          Expected to return an appropriate explorer instance configured for
 *                          the given cluster.
 */
function getExplorerForDatastore(req, datastoreType, clusterName, createExplorerCb) {
    const region = app_utils_1.getRegion(req.app);
    const env = app_utils_1.getEnv(req.app);
    const cluster = app_utils_1.getCluster(req.app, datastoreType, clusterName);
    req.datastoreType = datastoreType;
    req.cluster = cluster;
    acl_utils_1.verifyUserCanAccessCluster(req.user, req.cluster);
    const explorerCache = services_1.getExplorerCache();
    return explorerCache.getExplorer(datastoreType, clusterName, region, env, createExplorerCb);
}
exports.getExplorerForDatastore = getExplorerForDatastore;
//# sourceMappingURL=explorer-utils.js.map