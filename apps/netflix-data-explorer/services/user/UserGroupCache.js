"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const { USER_CACHE_TIMEOUT } = configuration_1.getConfig();
const logger = logger_1.default(module);
/**
 * Provides a cache-first strategy for reading user google group information.
 */
class UserGroupCache {
    constructor(provider) {
        this.provider = provider;
        if (!provider) {
            throw new Error('UserCacheProvider not specified');
        }
        this.userGroupCache = new lru_cache_1.default({
            max: 50,
            maxAge: USER_CACHE_TIMEOUT,
            dispose: (key, _n) => {
                logger.debug(`User Cache: dropping key "${key}"`);
            },
        });
    }
    /**
     * Fetches the user groups with a cache-first strategy.
     * @param email The user's email.
     * @param accessToken The user's access token (necessary to hit the service).
     */
    async getUserGroups(email, accessToken) {
        const cacheEntry = this.userGroupCache.get(email);
        if (cacheEntry) {
            return cacheEntry.groups;
        }
        try {
            const groups = await this.provider.getUserGroups(email, accessToken);
            if (groups.length === 0) {
                logger.warn(`No groups returned for user ${email}`);
            }
            this.userGroupCache.set(email, {
                email,
                groups,
            });
            return groups;
        }
        catch (err) {
            logger.error(`Failed to lookup user groups for user ${email}. Error: ${err.message}`);
            return [];
        }
    }
    values() {
        return this.userGroupCache.values();
    }
}
exports.default = UserGroupCache;
//# sourceMappingURL=UserGroupCache.js.map