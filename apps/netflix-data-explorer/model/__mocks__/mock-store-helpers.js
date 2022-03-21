"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockStore = exports.createStoreItem = exports.createClusterOwnership = exports.createTestCluster = void 0;
const enums_1 = require("@/typings/enums");
const baseCluster = {
    env: 'test',
    instances: [],
    name: 'TBD',
    region: 'us-east-1',
    datastoreType: 'cassandra',
};
function createTestCluster(datastoreType, clusterName, env = 'test', region = 'us-east-1') {
    return {
        ...baseCluster,
        name: clusterName,
        datastoreType: datastoreType,
        env,
        region,
    };
}
exports.createTestCluster = createTestCluster;
function createClusterOwnership(clusterName, owners, isShared = false) {
    return {
        isShared,
        name: clusterName,
        owners,
    };
}
exports.createClusterOwnership = createClusterOwnership;
function createStoreItem(datastoreType, clusterName, owners, isShared = false, env = 'test', region = 'us-east-1') {
    return {
        cluster: {
            env,
            instances: [],
            name: clusterName,
            region,
            datastoreType,
        },
        ownership: {
            isShared,
            name: clusterName,
            owners,
        },
    };
}
exports.createStoreItem = createStoreItem;
/**
 * Helper method for creating a mock store populated with a list of clusters.
 * Use createStoreItem() to create the items in the store.
 * @see createStoreItem
 */
function createMockStore(storeItems) {
    const clusterAclMap = {};
    const clusters = {};
    storeItems.forEach(({ cluster: clusterDefinition, ownership: clusterOwnership }) => {
        const { name, datastoreType } = clusterDefinition;
        clusterAclMap[name] = clusterOwnership;
        clusters[datastoreType] =
            clusters[datastoreType] || new Array();
        clusters[datastoreType].push(clusterDefinition);
    });
    return {
        accessControl: {
            clusterAclMap,
            status: enums_1.State.SUCCESS,
        },
        discovery: {
            clusters,
            environments: ['test'],
            regions: ['us-east-1'],
            status: enums_1.State.SUCCESS,
        },
    };
}
exports.createMockStore = createMockStore;
//# sourceMappingURL=mock-store-helpers.js.map