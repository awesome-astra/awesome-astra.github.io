"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDatastoreSupport = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const logger = logger_1.default(module);
async function loadDatastore(datastoreName) {
    const DatastoreServiceClass = await class_loader_utils_1.loadClass(`@/services/datastores/${datastoreName}`);
    return new DatastoreServiceClass();
}
/**
 * Setup our support for the various types of datastores.
 * @param supportedDatastores Array of supported datastore types.
 */
async function setupDatastoreSupport(supportedDatastores) {
    const services = await Promise.all(supportedDatastores.map((datastoreName) => loadDatastore(datastoreName)));
    logger.info('all datstores loaded');
    return services;
}
exports.setupDatastoreSupport = setupDatastoreSupport;
//# sourceMappingURL=datastores.js.map