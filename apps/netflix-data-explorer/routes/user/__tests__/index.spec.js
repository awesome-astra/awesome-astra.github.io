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
const auth_helper_1 = require("@/utils/__tests__/helpers/auth-helper");
const supertest_1 = __importDefault(require("supertest"));
describe('/user route', () => {
    let app;
    beforeAll(async () => {
        const MockConfiguration = (await Promise.resolve().then(() => __importStar(require('@/config/configuration'))));
        MockConfiguration.__updateConfig({
            REQUIRE_AUTHENTICATION: true,
        });
        app = await index_1.getApp();
    });
    it('should verify the user', async () => {
        const result = await supertest_1.default(app).get('/REST/user').set(auth_helper_1.userHeaders);
        expect(result.status).toEqual(200);
        const userInfo = JSON.parse(result.text);
        expect(userInfo.googleGroups).toEqual(['all@netflix.com']);
        expect(userInfo.isAdmin).toEqual(false);
    });
});
//# sourceMappingURL=index.spec.js.map