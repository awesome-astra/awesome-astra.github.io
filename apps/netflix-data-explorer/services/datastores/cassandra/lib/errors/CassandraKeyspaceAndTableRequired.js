"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraKeyspaceAndTableRequired = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraKeyspaceAndTableRequired extends HttpStatusError_1.default {
    constructor() {
        super(400, 'Fully qualified keyspace and table name is required', 'This operation requires a fully qualified keyspace and table name (case-sensitive).', 'Please check your keyspace and table name.');
    }
}
exports.CassandraKeyspaceAndTableRequired = CassandraKeyspaceAndTableRequired;
//# sourceMappingURL=CassandraKeyspaceAndTableRequired.js.map