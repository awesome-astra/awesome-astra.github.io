"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mock_store_helpers_1 = require("../__mocks__/mock-store-helpers");
describe('store suite', () => {
    const clusterName = 'clusterA';
    const findCluster = (theStore, theName) => theStore.discovery.clusters.cassandra.find((cluster) => cluster.name === theName);
    it('should allow replacing the store with mock data', async () => {
        const MockStoreModule = (await Promise.resolve().then(() => __importStar(require('@/model/store'))));
        const origStore = MockStoreModule.getStore();
        // verify store doesn't have an existing cluster with the same name
        expect(findCluster(MockStoreModule.getStore(), clusterName)).toBeUndefined();
        // mock a new store with our new cluster (this is an example
        // of how to mock store data in other tests).
        const store = mock_store_helpers_1.createMockStore([
            mock_store_helpers_1.createStoreItem('cassandra', clusterName, ['owner1@netflix.com', 'owner2@netflix.com'], false),
        ]);
        MockStoreModule.getStore.mockReturnValue(store);
        expect(findCluster(MockStoreModule.getStore(), clusterName)).toBeDefined();
        // resetting the mock should not affect the original store
        MockStoreModule.getStore.mockReset();
        expect(findCluster(origStore, clusterName)).toBeUndefined();
    });
});
//# sourceMappingURL=store.spec.js.map