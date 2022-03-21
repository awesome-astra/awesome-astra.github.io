"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteZsetMembers = exports.deleteSetMembers = exports.deleteListItems = exports.deleteHashKeys = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const logger = logger_1.default(module);
async function deleteHashKeys(conn, key, fieldValues) {
    const hashKeysToDelete = new Array();
    fieldValues.forEach((field) => {
        if (field.type === 'hash') {
            hashKeysToDelete.push(field.key);
        }
    });
    if (hashKeysToDelete.length === 0) {
        throw new Error('At least one hash key must be provided');
    }
    return conn.hdel(key, ...hashKeysToDelete);
}
exports.deleteHashKeys = deleteHashKeys;
async function deleteListItems(conn, key, fieldValues) {
    const MARKED_FOR_DELETE = '___deleted___';
    const indicesToDelete = new Array();
    fieldValues.forEach((field) => {
        if (field.type === 'list') {
            indicesToDelete.push(field.index);
        }
    });
    if (indicesToDelete.length === 0) {
        throw new Error('At least one field index must be provided');
    }
    // convert the list to numbers, then reverse sort
    const sortedReversedFields = indicesToDelete.sort().reverse();
    logger.info(JSON.stringify(sortedReversedFields));
    const promises = new Array();
    // Redis doesn't support deletion of keys by index, so we do a two-step mark and delete.
    sortedReversedFields.forEach((f) => {
        logger.info(`Marking index ${f} of ${key} for deletion`);
        promises.push(conn.lset(key, f, MARKED_FOR_DELETE));
    });
    await Promise.all(promises);
    logger.info(`Removing all fields marked for delete on key ${key}`);
    return conn.lrem(key, 0, MARKED_FOR_DELETE);
}
exports.deleteListItems = deleteListItems;
async function deleteSetMembers(conn, key, fieldValues) {
    const setMembersToRemove = new Array();
    fieldValues.forEach((field) => {
        if (field.type === 'set') {
            setMembersToRemove.push(field.value);
        }
    });
    if (setMembersToRemove.length === 0) {
        throw new Error('At least one set member must be provided');
    }
    return conn.srem(key, setMembersToRemove);
}
exports.deleteSetMembers = deleteSetMembers;
async function deleteZsetMembers(conn, key, fieldValues) {
    const sortedKeysToDelete = new Array();
    fieldValues.forEach((field) => {
        if (field.type === 'zset') {
            sortedKeysToDelete.push(field.value);
        }
    });
    if (sortedKeysToDelete.length === 0) {
        throw new Error('At least one hash key must be provided');
    }
    return conn.zrem(key, sortedKeysToDelete);
}
exports.deleteZsetMembers = deleteZsetMembers;
//# sourceMappingURL=collections.js.map