"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClusterAccessControlService = exports.getExplorerCache = exports.getUserGroupCache = exports.getEntityAccessControlCache = exports.getEntityAccessControlService = exports.setupServices = void 0;
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const store_1 = require("@/model/store");
const cluster_acl_1 = require("./cluster-acl");
const datastores_1 = require("./datastores");
const discovery_1 = require("./discovery");
const entity_acls_1 = require("./entity-acls");
const explorer_1 = require("./explorer");
const user_1 = require("./user");
const logger = logger_1.default(module);
const { SUPPORTED_DATASTORE_TYPES } = configuration_1.getConfig();
let entityAccessControlCache;
let explorerCache;
let discoveryService;
let clusterAccessControlService;
let userGroupCache;
let entityAccessControlService;
async function setupServices(app) {
    const store = store_1.getStore();
    try {
        // load configured datastores
        const datastoreServices = await datastores_1.setupDatastoreSupport(SUPPORTED_DATASTORE_TYPES);
        // setup caches
        entityAccessControlCache = await entity_acls_1.setupEntityAccessControlCache(app);
        explorerCache = await explorer_1.setupExplorerCache();
        userGroupCache = await user_1.setupUserGroupCache();
        // setup async services
        clusterAccessControlService = await cluster_acl_1.setupClusterAccessControlService(app, store);
        discoveryService = await discovery_1.setupDiscoveryService(explorerCache, datastoreServices, store);
        entityAccessControlService = await entity_acls_1.setupEntityAccessControlService();
        // start async services
        await Promise.all([
            discoveryService.start(),
            clusterAccessControlService.start(),
        ]);
    }
    catch (err) {
        logger.error('failed to setup services');
        throw err;
    }
}
exports.setupServices = setupServices;
function getEntityAccessControlService() {
    return entityAccessControlService;
}
exports.getEntityAccessControlService = getEntityAccessControlService;
function getEntityAccessControlCache() {
    return entityAccessControlCache;
}
exports.getEntityAccessControlCache = getEntityAccessControlCache;
function getUserGroupCache() {
    return userGroupCache;
}
exports.getUserGroupCache = getUserGroupCache;
function getExplorerCache() {
    return explorerCache;
}
exports.getExplorerCache = getExplorerCache;
function getClusterAccessControlService() {
    return clusterAccessControlService;
}
exports.getClusterAccessControlService = getClusterAccessControlService;
//# sourceMappingURL=index.js.map