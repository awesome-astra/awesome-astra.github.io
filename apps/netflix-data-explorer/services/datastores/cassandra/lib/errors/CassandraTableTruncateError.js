"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraTableTruncateError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraTableTruncateError extends HttpStatusError_1.default {
    constructor(keyspace, table, detail) {
        super(500, 'Failed to truncate table', `The table "${keyspace}"."${table}" could not be truncated.`, detail);
    }
}
exports.CassandraTableTruncateError = CassandraTableTruncateError;
//# sourceMappingURL=CassandraTableTruncateError.js.map