"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@/index");
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const supertest_1 = __importDefault(require("supertest"));
describe('/admin route', () => {
    let app;
    beforeAll(async () => {
        app = await index_1.getApp();
    });
    it('non-admin users should be rejected', async () => {
        const result = await supertest_1.default(app).get('/REST/admin').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(401);
    });
});
//# sourceMappingURL=index.spec.js.map