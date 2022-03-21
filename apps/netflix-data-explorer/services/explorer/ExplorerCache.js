"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const ClusterNotFoundError_1 = __importDefault(require("@/services/datastores/base/errors/ClusterNotFoundError"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const logger = logger_1.default(module);
const TTL = 1000 * 60 * 10;
/**
 * Maintains a cache of discovery information as well as any cached explorer instances that are connected
 * to the back-end datastores.
 *
 * @singleton
 */
class ExplorerCache {
    constructor() {
        this.discoveryCache = new Map();
        this.explorerCache = new lru_cache_1.default({
            maxAge: TTL,
            noDisposeOnSet: true,
            dispose: async (key, explorer) => {
                // the cache contains all the cached hosts and optionally, an Explorer instance if a connection
                // has been established. if the TTL has been reached, we'll shutdown connections to the cluster
                logger.info(`evicting ${key}`);
                if (explorer) {
                    logger.info(`  shutdown connections to: ${key}`);
                    try {
                        await explorer.shutdown();
                    }
                    catch (err) {
                        logger.error(`    shutdown of ${key} connections failed with: ${err.message}`);
                    }
                }
            },
        });
        // by default, keys are only pruned on get(). we want to make sure connections are garbage collected
        setInterval(() => {
            logger.info('pruning explorer cache...');
            this.explorerCache.prune();
        }, TTL);
    }
    /**
     * Updates the cache of clusters. Will replace all saved cluster definitions for the given datastore type.
     * @param datastoreType The type of datastores (e.g. 'cassandra').
     * @param clusters      The list of cluster definitions.
     */
    updateClusters(datastoreType, clusters) {
        clusters.forEach((cluster) => {
            const key = this.getKey(datastoreType, cluster.name, cluster.region, cluster.env);
            this.discoveryCache.set(key, cluster);
        });
    }
    /**
     * Fetches an existing Explorer instance for a given cluster without affecting the recent-ness of
     * the cache or attempting to create a new explorer on a cache miss.
     * @param datastoreType The type of datastore.
     * @param clusterName   The name of the cluster.
     * @param region        The region of this cluster.
     * @param env           The environment of this cluster.
     */
    peekExplorer(datastoreType, clusterName, region, env) {
        const key = this.getKey(datastoreType, clusterName, region, env);
        const cluster = this.discoveryCache.get(key);
        if (!cluster) {
            logger.error('cluster not present in the cache. server may still be starting up...');
            throw new ClusterNotFoundError_1.default(clusterName, region, env);
        }
        return this.explorerCache.peek(key);
    }
    /**
     * Fetches an explorer instance for a given cluster. Will return a cached instance if available,
     * otherwise a new instance will be created using the provided callback.
     * @param datastoreType The type of datastore.
     * @param clusterName   The name of the cluster.
     * @param region        The region of this cluster.
     * @param env           The environment of this cluster.
     * @param explorerCb    The callback used to create the appropriate explorer instance.
     */
    async getExplorer(datastoreType, clusterName, region, env, createExplorerCb) {
        const key = this.getKey(datastoreType, clusterName, region, env);
        // first check to see if this cluster is in our discovery cache
        const cluster = this.discoveryCache.get(key);
        if (!cluster) {
            logger.error('cluster not present in the cache. server may still be starting up...');
            throw new ClusterNotFoundError_1.default(clusterName, region, env);
        }
        // use the cached explorer if available, otherwise create a new connection
        let explorer = this.explorerCache.get(key);
        if (!explorer) {
            const clusterDescription = `${clusterName}.${region}.${env}`;
            logger.info(`no existing client connection for cluster: ${clusterDescription}`);
            explorer = await createExplorerCb(cluster);
        }
        else {
            logger.info('using existing client connection...');
        }
        // update the cached entry to update the access time
        this.explorerCache.set(key, explorer);
        return explorer;
    }
    getKey(type, clusterName, region, env) {
        return [type, env, region, clusterName]
            .map((item) => item.toLowerCase())
            .join(':::');
    }
}
exports.default = ExplorerCache;
//# sourceMappingURL=ExplorerCache.js.map