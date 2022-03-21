"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
const enums_1 = require("@/typings/enums");
class EntityNotAuthorizedError extends HttpStatusError_1.default {
    constructor(cluster, entityType, entityName) {
        const { env, name: clusterName, region, datastoreType } = cluster;
        const entityTypeString = enums_1.EntityType[entityType].toLowerCase();
        super(403, i18n_1.t('errors.entityNotAuthorizedError.title', {
            entityType: entityTypeString,
            entityName,
        }), i18n_1.t('errors.entityNotAuthorizedError.message', {
            entityType: entityTypeString,
            entityName,
        }), i18n_1.t('errors.entityNotAuthorizedError.remediation', {
            entityType: escape(entityTypeString),
            entityName: escape(entityName),
            datastoreType: escape(datastoreType),
            clusterName: escape(clusterName.toLowerCase()),
            clusterRegion: escape(region),
            clusterEnv: escape(env),
            entityPath: entityType === enums_1.EntityType.KEYSPACE
                ? `keyspaces/${region}/${entityName}`
                : '',
        }));
    }
}
exports.default = EntityNotAuthorizedError;
//# sourceMappingURL=EntityNotAuthorizedError.js.map