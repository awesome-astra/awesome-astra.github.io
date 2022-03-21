"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserGroupCache = void 0;
const UserGroupCache_1 = __importDefault(require("@/services/user/UserGroupCache"));
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const configuration_1 = require("../configuration");
const { USER_CACHE_PROVIDER } = configuration_1.getConfig();
async function getUserGroupCacheProvider() {
    if (!USER_CACHE_PROVIDER) {
        throw new Error('USER_CACHE_PROVIDER not specified in configuration.');
    }
    const UserCacheClass = await class_loader_utils_1.loadClass(`@/services/user/providers/${USER_CACHE_PROVIDER}`);
    return new UserCacheClass();
}
async function setupUserGroupCache() {
    return new UserGroupCache_1.default(await getUserGroupCacheProvider());
}
exports.setupUserGroupCache = setupUserGroupCache;
//# sourceMappingURL=user.js.map