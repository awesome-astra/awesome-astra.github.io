"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const enums_1 = require("@/typings/enums");
const lru_cache_1 = __importDefault(require("lru-cache"));
const logger = logger_1.default(module);
const TTL = 1000 * 60 * 2;
class EntityAccessControlCache {
    constructor(loader) {
        this.loader = loader;
        // using unbounded LRU cache to handle expiring keys (TTL)
        this.cache = new lru_cache_1.default({
            maxAge: TTL,
            dispose: (key, _n) => {
                logger.info(`*** disposing of ${key} ***`);
            },
            noDisposeOnSet: true,
        });
    }
    /**
     * Refresh the entire cache (if supported by loader).
     */
    async refresh() {
        logger.info('performing full cache refresh');
        try {
            const entities = await this.loader.fetchAllEntities();
            entities.forEach((entity) => {
                const key = this.buildKeyFromEntity(entity);
                this.cache.set(key, entity);
            });
        }
        catch (err) {
            logger.error('Loader failed to fetch all entities.', err);
        }
    }
    /**
     * Fetches a single entity from the cache. If the item is not in the cache,
     * the loader will be used to try and fetch the key.
     * @param clusterName The cluster name
     * @param env The environment name
     * @param type The type of entity
     * @param entityName The unique name of the entity
     */
    async get(clusterName, env, type, entityName) {
        logger.info(`fetching ${enums_1.EntityType[type]} "${entityName}" from cache`);
        const key = this.buildKey(clusterName, env, type, entityName);
        let value = this.cache.get(key);
        // if the value can't be found or has expired, refresh the cache and try again
        if (value === undefined) {
            logger.info(`cache miss for ${enums_1.EntityType[type]} "${entityName}"`);
            try {
                value = await this.loader.fetchEntity(clusterName, env, type, entityName);
                logger.info(`loaded cache ${enums_1.EntityType[type]} "${entityName}"`);
                this.cache.set(key, value);
            }
            catch (err) {
                logger.error(`Loaded failed to fetch ${enums_1.EntityType[type]} "${entityName}"`, err);
            }
        }
        return value;
    }
    /**
     * Fetches an entry from the cache if present. This method will NOT attempt to
     * load the record in the event of a cache miss. This method can also be used
     * effectively with the `refresh()` method.
     * @param clusterName The cluster name
     * @param env The environment name
     * @param type The type of entity
     * @param entityName The unique name of the entity
     * @see refresh()
     */
    async getIfPresent(clusterName, env, type, entityName) {
        const key = this.buildKey(clusterName, env, type, entityName);
        return this.cache.get(key);
    }
    /**
     * Returns all the values currently in the cache.
     */
    values() {
        return this.cache.values().filter((value) => !!value);
    }
    /**
     * Iterates over all the keys in order of recent-ness.
     * @param callbackFn
     */
    forEach(callbackFn) {
        return this.cache.forEach((value, key) => {
            if (value) {
                callbackFn(value, key);
            }
        });
    }
    buildKeyFromEntity(entity) {
        return this.buildKey(entity.clusterName, entity.env, enums_1.EntityType[entity.type], entity.name);
    }
    buildKey(clusterName, env, type, entityName) {
        const typeString = enums_1.EntityType[type];
        return `${clusterName.toLowerCase()}:::${env.toLowerCase()}:::${typeString}:::${entityName}`;
    }
}
exports.default = EntityAccessControlCache;
//# sourceMappingURL=EntityAccessControlCache.js.map