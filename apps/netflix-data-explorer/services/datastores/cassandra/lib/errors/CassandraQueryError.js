"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraQueryError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraQueryError extends HttpStatusError_1.default {
    constructor(query, reason) {
        super(400, 'Failed to execute query', reason, 'Please check your CQL statement.');
        this.query = query;
        this.reason = reason;
    }
}
exports.CassandraQueryError = CassandraQueryError;
//# sourceMappingURL=CassandraQueryError.js.map