"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const supertest_1 = __importDefault(require("supertest"));
describe('middleware test suite', () => {
    let app;
    beforeAll(async () => {
        app = await index_1.getApp();
    });
    it('Should have CORS enabled', async () => {
        const result = await supertest_1.default(app)
            .get('/REST/datastores/cassandra/clusters')
            .set(auth_helper_1.userHeaders);
        expect(result.header['access-control-allow-origin']).toEqual('*');
    });
});
//# sourceMappingURL=middlewares.spec.js.map