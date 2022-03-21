"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
const enums_1 = require("@/typings/enums");
class EntityMissingAclOwners extends HttpStatusError_1.default {
    constructor(clusterName, entityType, entityName) {
        const entityTypeString = enums_1.EntityType[entityType].toString();
        super(403, 'Entity Access control information missing', `Entity Access control is required for ${entityTypeString} "${entityName}"
      on cluster ${clusterName}`, `Please specify ownership information for ${entityTypeString} "${entityName}".`);
    }
}
exports.default = EntityMissingAclOwners;
//# sourceMappingURL=EntityMissingAclOwners.js.map