"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraTableDropError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraTableDropError extends HttpStatusError_1.default {
    constructor(keyspace, table, detail) {
        super(500, 'Failed to drop table', `The table "${keyspace}"."${table}" could not be dropped.`, detail);
    }
}
exports.CassandraTableDropError = CassandraTableDropError;
//# sourceMappingURL=CassandraTableDropError.js.map