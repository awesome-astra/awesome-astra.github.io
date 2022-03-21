"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const enums_1 = require("@/typings/enums");
const logger = logger_1.default(module);
class EntityAccessControlService {
    constructor(provider) {
        this.provider = provider;
    }
    async getEntityOwners(clusterName, env, type, entityName) {
        return this.provider.getEntityOwners(clusterName, env, type, entityName);
    }
    async setEntityOwners(clusterName, env, type, entityName, owners) {
        try {
            const res = await this.provider.setEntityOwners(clusterName, env, type, entityName, owners);
            logger.info(`Updated entity ownership on cluster ${clusterName}.${env} for
        ${enums_1.EntityType[type]} "${entityName}" with owners: ${JSON.stringify(owners)}.`);
            return res;
        }
        catch (err) {
            logger.error(`Failed to update entity ownership on cluster ${clusterName}.${env} for
      ${enums_1.EntityType[type]} "${entityName}" with owners: ${JSON.stringify(owners)}.`, err);
            throw err;
        }
    }
}
exports.default = EntityAccessControlService;
//# sourceMappingURL=EntityAccessControlService.js.map