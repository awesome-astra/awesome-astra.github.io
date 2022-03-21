"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const supertest_1 = __importDefault(require("supertest"));
describe('static files', () => {
    let app;
    const titleTag = '<title>Netflix | Data Explorer</title>';
    beforeAll(async () => {
        app = await index_1.getApp();
    });
    it('expected to serve static file', async () => {
        const result = await supertest_1.default(app).get('/').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        expect(result.text).toContain(titleTag);
    });
    it('all unknown routes should serve index.html to enable client routing', async () => {
        const result = await supertest_1.default(app)
            .get('/cassandra/clusters/CASS_TEST_CLUSTER/explore')
            .set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        expect(result.text).toContain(titleTag);
    });
});
describe('/healthcheck route', () => {
    let app;
    beforeAll(async () => {
        app = await index_1.getApp();
    });
    it('healthcheck without credentials should return OK', async () => {
        const result = await supertest_1.default(app).get('/healthcheck');
        expect(result.text).toEqual('OK!');
        expect(result.status).toEqual(200);
    });
});
//# sourceMappingURL=index.spec.js.map