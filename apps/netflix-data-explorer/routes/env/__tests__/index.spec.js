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
const configuration_1 = require("@/config/configuration");
const index_1 = require("@/index");
const mock_store_helpers_1 = require("@/model/__mocks__/mock-store-helpers");
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const app_utils_1 = require("@/utils/app-utils");
const supertest_1 = __importDefault(require("supertest"));
const { ENVIRONMENTS, REGIONS } = configuration_1.getConfig();
describe('/env route', () => {
    let app;
    const clusterName = 'env-route-test-cluster';
    const sampleDatastore = 'cassandra';
    const availability = [
        { env: 'test', region: 'us-east-1' },
        { env: 'test', region: 'eu-west-1' },
        { env: 'prod', region: 'eu-west-1' },
    ];
    beforeAll(async () => {
        app = await index_1.getApp();
        const MockStoreModule = await Promise.resolve().then(() => __importStar(require('@/model/store')));
        const mockStore = mock_store_helpers_1.createMockStore(availability.map((regionInfo) => mock_store_helpers_1.createStoreItem('cassandra', clusterName, ['owner1@netflix.com', 'owner2@netflix.com'], false, regionInfo.env, regionInfo.region)));
        MockStoreModule.getStore.mockReturnValue(mockStore);
    });
    describe('read only operations', () => {
        it('should fetch the environments for the given cluster', async () => {
            const result = await supertest_1.default(app)
                .get(`/REST/env/regions/cassandra/${clusterName}`)
                .set(auth_helper_1.userHeaders);
            expect(result.status).toEqual(200);
            const data = JSON.parse(result.text);
            const comparator = (a, b) => `${a.env}-${a.region}`.localeCompare(`${b.env}-${b.region}`);
            expect(data.sort(comparator)).toEqual(availability.sort(comparator));
        });
        it('should return empty for an unknown cluster', async () => {
            const result = await supertest_1.default(app)
                .get(`/REST/env/regions/${sampleDatastore}/unknownClusterName`)
                .set(auth_helper_1.userHeaders);
            expect(result.status).toEqual(200);
            expect(JSON.parse(result.text)).toEqual([]);
        });
        it('should return all available regions', async () => {
            const result = await supertest_1.default(app)
                .get('/REST/env/regions')
                .set(auth_helper_1.userHeaders);
            expect(result.status).toEqual(200);
            const data = JSON.parse(result.text);
            const regionIds = new Array();
            ENVIRONMENTS.forEach((envName) => {
                REGIONS.forEach((regionName) => regionIds.push(`${envName}:${regionName}`));
            });
            expect(data.available.map((item) => `${item.env}:${item.region}`).sort()).toEqual(regionIds.sort());
        });
    });
    describe('redirect suite', () => {
        it('should return a 400 for an invalid env', async () => {
            const region = 'us-east-1';
            const result = await supertest_1.default(app)
                .post(`/REST/env/regions/invalidenv-${region}`)
                .set(auth_helper_1.userHeaders)
                .send({
                datastoreType: sampleDatastore,
                cluster: clusterName,
            });
            expect(result.status).toEqual(400);
        });
        it('should return a 404 for an invalid region', async () => {
            const result = await supertest_1.default(app)
                .post(`/REST/env/regions/${ENVIRONMENTS[0]}-invalidregion`)
                .set(auth_helper_1.userHeaders)
                .send({
                datastoreType: sampleDatastore,
                cluster: clusterName,
            });
            expect(result.status).toEqual(404);
        });
        it('should redirect to the appropriate cluster', async () => {
            const envName = 'local';
            const region = 'local';
            const result = await supertest_1.default(app)
                .post(`/REST/env/regions/${envName}-${region}`)
                .set(auth_helper_1.userHeaders)
                .send({ datastoreType: sampleDatastore, cluster: clusterName });
            expect(result.status).toEqual(200);
            expect(result.header.location).toEqual(`https://${app_utils_1.getAppStack(app)}-${region}.${envName}.acme.net/${sampleDatastore}/clusters/${clusterName}`);
        });
    });
});
//# sourceMappingURL=index.spec.js.map