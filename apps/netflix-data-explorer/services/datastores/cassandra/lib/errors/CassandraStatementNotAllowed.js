"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraStatementNotAllowed = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraStatementNotAllowed extends HttpStatusError_1.default {
    constructor(query, remediation) {
        super(400, 'Statement Not Allowed', `The query includes statements that are not permitted: "${query.trim()}"`, remediation);
    }
}
exports.CassandraStatementNotAllowed = CassandraStatementNotAllowed;
//# sourceMappingURL=CassandraStatementNotAllowed.js.map