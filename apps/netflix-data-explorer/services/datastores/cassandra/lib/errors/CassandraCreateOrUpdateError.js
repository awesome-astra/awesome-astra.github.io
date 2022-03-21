"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraCreateOrUpdateError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraCreateOrUpdateError extends HttpStatusError_1.default {
    constructor(reason) {
        super(400, 'Failed to create or update record', reason, 'Please check your CQL statement.');
        this.reason = reason;
    }
}
exports.CassandraCreateOrUpdateError = CassandraCreateOrUpdateError;
//# sourceMappingURL=CassandraCreateOrUpdateError.js.map