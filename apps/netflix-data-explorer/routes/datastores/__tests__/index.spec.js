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
const index_1 = require("@/index");
const mock_store_helpers_1 = require("@/model/__mocks__/mock-store-helpers");
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const supertest_1 = __importDefault(require("supertest"));
jest.mock('@/model/store');
describe('/datastores route suite', () => {
    let app;
    const teamClusterName = 'datastore-route-test-cluster';
    const teamDL = 'cass-test-cluster-owners@netflix.com';
    let setUserGroups;
    const opsTeamDL = 'ops-team@acme.com';
    const restrictedClusterNames = ['restricted-a', 'restricted-b'];
    const unrestrictedClusterNames = ['unrestricted-a'];
    beforeAll(async () => {
        // setup to manipulate user groups before each test
        const MockServices = await Promise.resolve().then(() => __importStar(require('@/config/services')));
        setUserGroups = MockServices.__setUserGroups;
        // apply test config
        const MockConfiguration = (await Promise.resolve().then(() => __importStar(require('@/config/configuration'))));
        MockConfiguration.__updateConfig({
            ALL_CLUSTERS_MEMBERS: [opsTeamDL],
            REQUIRE_AUTHENTICATION: true,
        });
        // create a mock store with sample datastores
        const MockStoreModule = (await Promise.resolve().then(() => __importStar(require('@/model/store'))));
        const store = mock_store_helpers_1.createMockStore([
            ...restrictedClusterNames.map((name) => mock_store_helpers_1.createStoreItem('cassandra', name, [], true)),
            ...unrestrictedClusterNames.map((name) => mock_store_helpers_1.createStoreItem('cassandra', name, [], false)),
            mock_store_helpers_1.createStoreItem('cassandra', teamClusterName, [teamDL], false),
        ]);
        MockStoreModule.getStore.mockReturnValue(store);
    });
    beforeEach(async () => {
        app = await index_1.getApp();
        setUserGroups(); // reset the user groups mock to default values
    });
    it('should return the list of clusters owned by a user', async () => {
        setUserGroups([teamDL]);
        const result = await supertest_1.default(app).get('/REST/datastores').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        const clusters = JSON.parse(result.text);
        expect(clusters.find((cluster) => cluster.name === teamClusterName)).toBeDefined();
    });
    it('should only return shared and unrestricted clusters for a user without any dedicated clusters', async () => {
        const result = await supertest_1.default(app).get('/REST/datastores').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        const clusters = JSON.parse(result.text);
        const unrestrictedClusterSet = new Set(unrestrictedClusterNames);
        expect(clusters.find((cluster) => cluster.name === teamClusterName)).toBeUndefined();
        expect(clusters.every((cluster) => cluster.isShared || unrestrictedClusterSet.has(cluster.name))).toBe(true);
    });
    it('should return the list of clusters for a member of the all clusters group', async () => {
        setUserGroups([opsTeamDL]);
        const result = await supertest_1.default(app).get('/REST/datastores').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        const clusters = JSON.parse(result.text);
        const returnedClusterNames = new Set(clusters.map((cluster) => cluster.name));
        // no restricted clusters should be returned
        expect(restrictedClusterNames.every((restrictedName) => !returnedClusterNames.has(restrictedName)));
        // all unrestricted clusters should be returned
        expect(unrestrictedClusterNames.every((unrestrictedName) => returnedClusterNames.has(unrestrictedName)));
        // test team cluster should be included
        expect(returnedClusterNames.has(teamClusterName)).toBe(true);
    });
});
//# sourceMappingURL=index.spec.js.map