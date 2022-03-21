"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraNoHostAvailableError extends HttpStatusError_1.default {
    constructor(clusterName) {
        super(401, 'No Hosts Available', `No hosts available for cluster ${clusterName}.`, i18n_1.t('errors.cassandraNoHostAvailableError.remediation'));
    }
}
exports.default = CassandraNoHostAvailableError;
//# sourceMappingURL=CassandraNoHostAvailableError.js.map