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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mock_store_helpers_1 = require("@/model/__mocks__/mock-store-helpers");
const ClusterNotAuthorizedError_1 = __importDefault(require("@/model/errors/ClusterNotAuthorizedError"));
const acl_utils_1 = require("@/utils/acl-utils");
const user_helper_1 = require("./helpers/user-helper");
jest.mock('@/model/store');
jest.mock('@/config/configuration');
describe('Cluster Access Control', () => {
    const RESTRICTED_CLUSTERS = ['restricted-a', 'restricted-b'];
    const UNRESTRICTED_CLUSTERS = ['unrestricted-a', 'unrestricted-b'];
    const netflixDL = 'all@netflix.com';
    const opsTeam = 'ops-team@netflix.com';
    const teamDL = 'teamA@netflix.com';
    // create a couple of sample users
    const opsUser = user_helper_1.createTestUser('ops-user@netflix.com', [opsTeam, netflixDL]);
    const generalUser = user_helper_1.createTestUser('jack@netflix.com', [netflixDL]);
    const teamUser = user_helper_1.createTestUser('jill@netflix.com', [teamDL, netflixDL]);
    beforeAll(async () => {
        const MockConfiguration = (await Promise.resolve().then(() => __importStar(require('@/config/configuration'))));
        MockConfiguration.__updateConfig({
            ALL_CLUSTERS_MEMBERS: [opsTeam],
            REQUIRE_AUTHENTICATION: true,
            RESTRICTED_CLUSTERS,
            UNRESTRICTED_CLUSTERS,
        });
    });
    describe('Cluster Access', () => {
        let sharedClusterItem;
        let privateCluster;
        let unrestrictedClusters;
        let restrictedClusters;
        beforeAll(async () => {
            const MockStoreModule = (await Promise.resolve().then(() => __importStar(require('@/model/store'))));
            unrestrictedClusters = UNRESTRICTED_CLUSTERS.map((name) => mock_store_helpers_1.createStoreItem('cassandra', name, [], true));
            restrictedClusters = RESTRICTED_CLUSTERS.map((name) => mock_store_helpers_1.createStoreItem('cassandra', name, [], true));
            sharedClusterItem = mock_store_helpers_1.createStoreItem('cassandra', 'acl_test_cluster_1', [], true);
            privateCluster = mock_store_helpers_1.createStoreItem('cassandra', 'acl_test_cluster_2', [teamDL], false);
            const mockStoreData = mock_store_helpers_1.createMockStore([
                sharedClusterItem,
                privateCluster,
                ...unrestrictedClusters,
                ...restrictedClusters,
            ]);
            MockStoreModule.getStore.mockReturnValue(mockStoreData);
        });
        describe('Shared Clusters', () => {
            it('Should allow general access to shared cluster', () => expect(acl_utils_1.canUserAccessCluster(generalUser, sharedClusterItem.cluster)).toBe(true));
            it('Should allow Ops team access to shared cluster', () => expect(acl_utils_1.canUserAccessCluster(opsUser, sharedClusterItem.cluster)).toBe(true));
            it('Verifying cluster acccess should throw for unauthorized users', () => expect(() => acl_utils_1.verifyUserCanAccessCluster(generalUser, privateCluster.cluster)).toThrow(ClusterNotAuthorizedError_1.default));
            it('Should not throw for Ops team members', () => {
                expect(() => acl_utils_1.verifyUserCanAccessCluster(opsUser, privateCluster.cluster)).not.toThrow(ClusterNotAuthorizedError_1.default);
            });
            it('Should allow general access to unrestricted clusters', () => {
                unrestrictedClusters.forEach((cluster) => {
                    expect(acl_utils_1.canUserAccessCluster(generalUser, cluster.cluster)).toBe(true);
                });
            });
            it('Should not allow any access (even Ops team) to restricted clusters', () => {
                restrictedClusters.forEach((cluster) => {
                    expect(acl_utils_1.canUserAccessCluster(opsUser, cluster.cluster)).toBe(false);
                });
            });
        });
        describe('Dedicated Clusters', () => {
            it('Should not allow general access to dedicated cluster', () => {
                expect(acl_utils_1.canUserAccessCluster(generalUser, privateCluster.cluster)).toBe(false);
            });
            it('Should allow team owner access to dedicated cluster', () => {
                expect(acl_utils_1.canUserAccessCluster(teamUser, privateCluster.cluster)).toBe(true);
            });
            it('Should allow Ops team access to dedicated cluster', () => {
                expect(acl_utils_1.canUserAccessCluster(opsUser, privateCluster.cluster)).toBe(true);
            });
            it('Should not throw for Ops team access to dedicated cluster', () => {
                expect(() => acl_utils_1.verifyUserCanAccessCluster(opsUser, privateCluster.cluster)).not.toThrow(ClusterNotAuthorizedError_1.default);
            });
        });
    });
});
//# sourceMappingURL=cluster-acl.spec.js.map