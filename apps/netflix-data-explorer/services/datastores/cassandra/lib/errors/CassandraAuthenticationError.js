"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraAuthenticationError extends HttpStatusError_1.default {
    constructor(clusterName) {
        super(401, 'Authentication Failure', `Cluster ${clusterName} requires authentication.`, i18n_1.t('errors.cassandraAuthenticationError.remediation'));
    }
}
exports.default = CassandraAuthenticationError;
//# sourceMappingURL=CassandraAuthenticationError.js.map