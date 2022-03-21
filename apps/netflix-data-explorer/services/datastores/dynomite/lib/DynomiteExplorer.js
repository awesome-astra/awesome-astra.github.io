"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const Cursor_1 = __importDefault(require("@/services/datastores/dynomite/lib/Cursor"));
const dynomite_constants_1 = require("@/services/datastores/dynomite/lib/dynomite-constants");
const DynomiteCluster_1 = __importDefault(require("@/services/datastores/dynomite/lib/DynomiteCluster"));
const DynomiteTypes_1 = __importDefault(require("@/services/datastores/dynomite/lib/DynomiteTypes"));
const errors_1 = require("@/services/datastores/dynomite/lib/errors");
const redis_info_utils_1 = require("@/services/datastores/dynomite/lib/utils/redis-info-utils");
const scan_utils_1 = require("@/services/datastores/dynomite/lib/utils/scan-utils");
const collections_1 = require("./collections");
const logger = logger_1.default(module);
const EMPTY_RESULT = {
    cursor: { complete: true },
    keys: [],
    count: 0,
};
/**
 * @class
 */
class DynomiteExplorer {
    constructor(cluster) {
        this.cluster = cluster;
        // setup a dynomite cluster to handle delegated calls that require region-awareness
        this.dynomiteCluster = new DynomiteCluster_1.default(cluster);
    }
    /**
     * Adds fields to the given key. If the key doesn't exist, it will be created.
     * Operation is performed via a single call to the database wherever possible.
     * @param type        The type of the key.
     * @param key         The name of the key to add fields to.
     * @param fieldValues Array of field definitions
     */
    async addFields(type, key, fieldValues) {
        const conn = await this.dynomiteCluster.getConnection();
        switch (type) {
            case DynomiteTypes_1.default.string:
                throw new Error('Cannot add fields to strings. Please create a key of a type that supports fields.');
            case DynomiteTypes_1.default.list:
                return conn.rpush(key, fieldValues.map((r) => r.value)); // list members don't provide indices
            case DynomiteTypes_1.default.set:
                return conn.sadd(key, fieldValues.map((r) => r.value));
            case DynomiteTypes_1.default.hash:
                const keyValuePairs = new Array();
                fieldValues.forEach((r) => {
                    if (r.type === 'hash') {
                        keyValuePairs.push(r.key, r.value);
                    }
                });
                if (keyValuePairs.length === 0) {
                    throw Error('No hash key/value pairs provided');
                }
                return conn.hmset(key, keyValuePairs);
            case DynomiteTypes_1.default.zset:
                const zsetItems = new Array();
                fieldValues.forEach((r) => {
                    if (r.type === 'zset') {
                        zsetItems.push(r.score);
                        zsetItems.push(r.value);
                    }
                });
                if (zsetItems.length === 0) {
                    throw Error('No zset score/value pairs provided');
                }
                return conn.zadd(key, zsetItems);
            case DynomiteTypes_1.default.none:
                throw new errors_1.KeyNotFoundError(key);
            default:
                throw new Error(`Unsupported key type: ${type}`);
        }
    }
    /**
     * Deletes the list of fields from the given key.
     * Note, not all data types support fields.
     * @param key      The name of the key.
     * @param fields   Array of field names to delete.
     */
    async deleteFields(key, fieldValues) {
        const conn = await this.dynomiteCluster.getConnection();
        const keyType = await conn.type(key);
        switch (keyType) {
            case DynomiteTypes_1.default.string: {
                throw new Error('Cannot delete field from string types. Please use deleteKey() method instead.');
            }
            case DynomiteTypes_1.default.list:
                return collections_1.deleteListItems(conn, key, fieldValues);
            case DynomiteTypes_1.default.set:
                return collections_1.deleteSetMembers(conn, key, fieldValues);
            case DynomiteTypes_1.default.hash:
                return collections_1.deleteHashKeys(conn, key, fieldValues);
            case DynomiteTypes_1.default.zset:
                return collections_1.deleteZsetMembers(conn, key, fieldValues);
            case DynomiteTypes_1.default.none:
                throw new errors_1.KeyNotFoundError(key);
            default:
                throw new Error(`Unsupported key type: ${keyType}`);
        }
    }
    /**
     * Deletes a given key.
     * @param {String} key The name of the key to delete.
     * @returns {Promise.<Object>}
     */
    async deleteKey(key) {
        logger.info('DynomiteExplorer:deleteKey()');
        const conn = await this.dynomiteCluster.getConnection();
        const result = await conn.del(key);
        if (result === 0) {
            throw new errors_1.KeyNotFoundError(key);
        }
        return { count: result };
    }
    /**
     * Returns an object containing cluster level information.
     * @returns Returns a Promise that will resolve with an Array of info objects for each of the
     *          nodes in the availability zone / rack / ring.
     */
    async getInfo() {
        logger.info('DynomiteExplorer:getInfo()');
        const results = (await this.dynomiteCluster.executeCommandInSingleZone((conn) => conn.info()));
        return results.map((result) => redis_info_utils_1.parseInfoString(result));
    }
    /**
     * Returns the total number of keys available.
     */
    async getKeyCount() {
        const results = (await this.dynomiteCluster.executeCommandInSingleZone((conn) => conn.info()));
        return results.reduce((previous, current) => previous + redis_info_utils_1.getKeyCountFromInfo(current), 0);
    }
    /**
     * Fetches the value of a specific key.
     *
     * Returns an object of the following format:
     *
     *  {
     *      type: "String",
     *      ttl: Number,
     *      value: <Object>
     *  }
     *
     * @param {String} key
     * @returns {Promise.<Object>}
     */
    async getValue(key) {
        const conn = await this.dynomiteCluster.getConnection();
        const type = await conn.type(key);
        let value;
        switch (type) {
            case DynomiteTypes_1.default.string:
                const len = await conn.strlen(key);
                if (len > dynomite_constants_1.MAX_KEY_STRING_SIZE_CHARS) {
                    throw new errors_1.KeyTooLargeError(key, len);
                }
                value = await conn.get(key);
                break;
            case DynomiteTypes_1.default.list:
                value = await conn.lrange(key, 0, -1);
                break;
            case DynomiteTypes_1.default.set:
                value = await conn.smembers(key);
                break;
            case DynomiteTypes_1.default.hash:
                value = await conn.hgetall(key);
                break;
            case DynomiteTypes_1.default.zset:
                value = await conn.zrange(key, 0, -1, 'WITHSCORES');
                break;
            case DynomiteTypes_1.default.none:
                throw new errors_1.KeyNotFoundError(key);
            default:
                throw new Error(`Unsupported key type: ${type}`);
        }
        const ttl = await conn.ttl(key);
        return { name: key, value, type, ttl };
    }
    /**
     * Updates the fields of an aggregate key type.
     * @param key          The name of the key to be updated.
     * @param fieldValues  An array of field value pairs.
     */
    async updateFields(key, fieldValues) {
        const conn = await this.dynomiteCluster.getConnection();
        const type = await conn.type(key);
        const supportedKeyTypes = [DynomiteTypes_1.default.list, DynomiteTypes_1.default.hash, DynomiteTypes_1.default.zset];
        if (!supportedKeyTypes.includes(type)) {
            throw new errors_1.FieldOperationsNotSupportedForTypeError(key, type, supportedKeyTypes);
        }
        const fieldPairs = [];
        switch (type) {
            case DynomiteTypes_1.default.list: {
                // redis doesn't support setting multiple list members in a single call
                const promises = fieldValues.map((r) => {
                    if (r.type === 'list') {
                        return conn.lset(key, r.index, r.value);
                    }
                    return Promise.resolve('OK');
                });
                await Promise.all(promises);
                break;
            }
            case DynomiteTypes_1.default.hash:
                fieldValues.forEach((r) => {
                    if (r.type === 'hash') {
                        fieldPairs.push(r.key);
                        fieldPairs.push(r.value);
                    }
                });
                await conn.hmset(key, fieldPairs);
                break;
            case DynomiteTypes_1.default.zset:
                fieldValues.forEach((r) => {
                    if (r.type === 'zset') {
                        fieldPairs.push(r.score);
                        fieldPairs.push(r.value);
                    }
                });
                await conn.zadd(key, fieldPairs);
                break;
        }
        logger.info('field updated successfully');
        return true;
    }
    /**
     * Sets the given key to the given value.
     * @param key
     * @param value
     * @returns
     */
    async setValue(key, value) {
        const conn = await this.dynomiteCluster.getConnection();
        return conn.set(key, value);
    }
    /**
     * Sets the expiration value for the given key.
     * @param key     The name of the key to set expiration.
     * @param ttl     The expiration value in seconds. Set to null to persist the key
     *                (i.e. remove the expiration).
     */
    async setExpiration(key, ttl) {
        const conn = await this.dynomiteCluster.getConnection();
        if (ttl === undefined) {
            return conn.persist(key);
        }
        return conn.expire(key, ttl);
    }
    /**
     * Returns a set of matching keys.
     * @param cursor
     * @param match
     * @param count
     * @param pageSize
     */
    async getKeys(cursorObj, match, count, pageSize) {
        if (match.indexOf('*') < 0) {
            // as an optimization, if the user isn't search for a wildcard key, just try direct key access
            try {
                await this.getValue(match);
                return {
                    cursor: { complete: true },
                    keys: [match],
                    count: 1,
                };
            }
            catch (err) {
                if (err instanceof errors_1.KeyNotFoundError) {
                    return EMPTY_RESULT;
                }
                throw err;
            }
        }
        else {
            // otherwise we need to perform a scan to find matching keys
            let cursor;
            if (cursorObj) {
                // reuse the existing client cursor if provided
                cursor = Cursor_1.default.fromClientCursor(cursorObj);
            }
            else {
                // create a new cursor with knowledge of all the hosts in the AZ
                const ringMembers = this.dynomiteCluster.getFirstRingMembers();
                logger.debug(`no scan cursor provided. setting up cursor: ${JSON.stringify(ringMembers)}`);
                cursor = new Cursor_1.default(ringMembers);
            }
            const result = await scan_utils_1.scan(this.dynomiteCluster, cursor, match, count, pageSize);
            return result;
        }
    }
    async shutdown() {
        this.dynomiteCluster.disconnect();
    }
}
exports.default = DynomiteExplorer;
//# sourceMappingURL=DynomiteExplorer.js.map