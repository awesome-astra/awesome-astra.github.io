"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class ClusterNotAuthorizedError extends HttpStatusError_1.default {
    constructor(username, cluster) {
        const name = cluster.name.toLowerCase();
        super(403, 'User does not have access to cluster', `User ${username} does not have access to cluster ${name}`, i18n_1.t('errors.clusterNotAuthorizedError.remediation', {
            clusterName: escape(name),
            clusterEnv: escape(cluster.env),
            datastoreType: escape(cluster.datastoreType),
        }));
    }
}
exports.default = ClusterNotAuthorizedError;
//# sourceMappingURL=ClusterNotAuthorizedError.js.map