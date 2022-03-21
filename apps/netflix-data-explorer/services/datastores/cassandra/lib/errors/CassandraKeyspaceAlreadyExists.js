"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraKeyspaceAlreadyExists = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraKeyspaceAlreadyExists extends HttpStatusError_1.default {
    constructor(keyspace) {
        super(409, 'Keyspace already exists', `The keyspace "${keyspace}" already exists.`, 'Please choose a different name for the new keyspace.');
    }
}
exports.CassandraKeyspaceAlreadyExists = CassandraKeyspaceAlreadyExists;
//# sourceMappingURL=CassandraKeyspaceAlreadyExists.js.map