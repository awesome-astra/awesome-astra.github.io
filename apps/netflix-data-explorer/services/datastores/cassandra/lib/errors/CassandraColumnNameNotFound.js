"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraColumnNameNotFound = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraColumnNameNotFound extends HttpStatusError_1.default {
    constructor(keyspace, table, columnName) {
        super(400, `Column name ${columnName} not found`, `Operation on table "${keyspace}"."${table}" failed due to missing column "${columnName}".`, 'Please check the statement to ensure a valid primary key was provided. The primary key consists of ' +
            'all partition keys and clustering columns.');
    }
}
exports.CassandraColumnNameNotFound = CassandraColumnNameNotFound;
//# sourceMappingURL=CassandraColumnNameNotFound.js.map