"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = void 0;
/**
 * Contains app state that needs to be accessible from various parts of the app.
 * Should only contain transient data as this data is only stored in memory.
 * Good candidates are temporary caches of information from other services.
 */
const store = {
    accessControl: {
        clusterAclMap: undefined,
        status: undefined,
    },
    discovery: {
        clusters: {},
        environments: [],
        regions: [],
        status: undefined,
    },
};
function getStore() {
    return store;
}
exports.getStore = getStore;
//# sourceMappingURL=store.js.map