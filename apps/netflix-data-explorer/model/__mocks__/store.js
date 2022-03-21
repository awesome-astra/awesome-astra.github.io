"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = exports.privateCluster = exports.sharedCluster = void 0;
const configuration_1 = require("@/config/configuration");
const mock_store_helpers_1 = require("./mock-store-helpers");
const { RESTRICTED_CLUSTERS, UNRESTRICTED_CLUSTERS } = configuration_1.getConfig();
const sharedClusterName = 'shared_cluster_name';
const privateClusterName = 'private_cluster_name';
const privateClusterOwners = ['teamA@netflix.com'];
exports.sharedCluster = mock_store_helpers_1.createStoreItem('cassandra', sharedClusterName, [], true);
exports.privateCluster = mock_store_helpers_1.createStoreItem('cassandra', privateClusterName, privateClusterOwners, false);
const store = mock_store_helpers_1.createMockStore([
    ...RESTRICTED_CLUSTERS.map((clusterName) => mock_store_helpers_1.createStoreItem('cassandra', clusterName, [], false)),
    ...UNRESTRICTED_CLUSTERS.map((clusterName) => mock_store_helpers_1.createStoreItem('cassandra', clusterName, [], false)),
    exports.sharedCluster,
    exports.privateCluster,
]);
exports.getStore = jest.fn().mockImplementation(() => {
    // clone the store to avoid any cross-test funny business
    return JSON.parse(JSON.stringify(store));
});
//# sourceMappingURL=store.js.map