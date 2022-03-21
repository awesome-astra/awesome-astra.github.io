"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraKeyspaceNotFound = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraKeyspaceNotFound extends HttpStatusError_1.default {
    constructor(keyspace) {
        super(404, 'Keyspace Not Found', `The keyspace "${keyspace}" could not be found.`, 'Please check the keyspace name. Note, some drivers permit creation of case-sensitive keyspace ' +
            'and table names. Please ensure you have the exact case-sensitive spelling.');
    }
}
exports.CassandraKeyspaceNotFound = CassandraKeyspaceNotFound;
//# sourceMappingURL=CassandraKeyspaceNotFound.js.map