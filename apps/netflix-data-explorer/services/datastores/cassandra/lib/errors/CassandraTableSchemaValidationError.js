"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraTableSchemaValidationError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraTableSchemaValidationError extends HttpStatusError_1.default {
    constructor(columnName, columnType, message, remediation) {
        super(400, 'Table validation error', message, remediation);
        this.columnName = columnName;
        this.columnType = columnType;
    }
}
exports.CassandraTableSchemaValidationError = CassandraTableSchemaValidationError;
//# sourceMappingURL=CassandraTableSchemaValidationError.js.map