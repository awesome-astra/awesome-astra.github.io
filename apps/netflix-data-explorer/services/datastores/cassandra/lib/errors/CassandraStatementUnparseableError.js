"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraStatementUnparseableError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraStatementUnparseableError extends HttpStatusError_1.default {
    constructor(query) {
        super(400, 'Unable to parse keyspace and table name', `Unable to parse the keyspace and table from "${query}"`, 'Please check your CQL statement.');
        this.query = query;
    }
}
exports.CassandraStatementUnparseableError = CassandraStatementUnparseableError;
//# sourceMappingURL=CassandraStatementUnparseableError.js.map