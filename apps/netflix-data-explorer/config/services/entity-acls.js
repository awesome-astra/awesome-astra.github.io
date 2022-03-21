"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEntityAccessControlService = exports.setupEntityAccessControlCache = void 0;
const EntityAccessControlCache_1 = __importDefault(require("@/services/entity-acls/EntityAccessControlCache"));
const EntityAccessControlService_1 = __importDefault(require("@/services/entity-acls/EntityAccessControlService"));
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const configuration_1 = require("../configuration");
const { ENTITY_ACCESS_CONTROL_LOADER, ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER, } = configuration_1.getConfig();
async function setupEntityAccessControlCache(app) {
    if (!ENTITY_ACCESS_CONTROL_LOADER) {
        throw new Error('ENTITY_ACCESS_CONTROL_LOADER not specified in configuration.');
    }
    const EntityAccessControlLoaderClass = await class_loader_utils_1.loadClass(`@/services/entity-acls/providers/${ENTITY_ACCESS_CONTROL_LOADER}`);
    const loader = new EntityAccessControlLoaderClass(app);
    return new EntityAccessControlCache_1.default(loader);
}
exports.setupEntityAccessControlCache = setupEntityAccessControlCache;
async function setupEntityAccessControlService() {
    if (!ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER) {
        throw new Error('ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER not specified in configuration.');
    }
    const EntityAccessControlServiceClass = await class_loader_utils_1.loadClass(`@/services/entity-acls/providers/${ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER}`);
    const loader = new EntityAccessControlServiceClass();
    return new EntityAccessControlService_1.default(loader);
}
exports.setupEntityAccessControlService = setupEntityAccessControlService;
//# sourceMappingURL=entity-acls.js.map