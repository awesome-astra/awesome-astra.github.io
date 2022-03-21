"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraNoFieldsToUpdate = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraNoFieldsToUpdate extends HttpStatusError_1.default {
    constructor(keyspace, table) {
        super(400, 'No fields to update', `No updates provided. No changes have been made to "${keyspace}"."${table}".`, 'Please check the statement to ensure you have provided the necessary updated fields.');
    }
}
exports.CassandraNoFieldsToUpdate = CassandraNoFieldsToUpdate;
//# sourceMappingURL=CassandraNoFieldsToUpdate.js.map