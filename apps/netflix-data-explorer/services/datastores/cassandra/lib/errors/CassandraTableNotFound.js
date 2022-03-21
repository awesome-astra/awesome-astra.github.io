"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraTableNotFound = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraTableNotFound extends HttpStatusError_1.default {
    constructor(keyspace, table) {
        super(404, 'Table Not Found', `The table "${keyspace}"."${table}" could not be found.`, 'Please check the keyspace and table name. Note, some drivers permit creation of case-sensitive keyspace ' +
            'and table names. Please ensure you have the exact case-sensitive spelling.');
    }
}
exports.CassandraTableNotFound = CassandraTableNotFound;
//# sourceMappingURL=CassandraTableNotFound.js.map