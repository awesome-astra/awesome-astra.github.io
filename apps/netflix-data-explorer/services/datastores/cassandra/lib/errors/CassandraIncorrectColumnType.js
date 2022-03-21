"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraIncorrectColumnType = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraIncorrectColumnType extends HttpStatusError_1.default {
    constructor(keyspace, table, columnName, columnType, expectedType) {
        super(400, 'Incorrect column type', `Operation on table "${keyspace}"."${table}" failed due to incorrect column type. Column ${columnName}
      is of type ${columnType} and was expected to be of type ${expectedType}.`, 'Please check the statement to ensure a valid primary key was provided. The primary key consists of ' +
            'all partition keys and clustering columns.');
    }
}
exports.CassandraIncorrectColumnType = CassandraIncorrectColumnType;
//# sourceMappingURL=CassandraIncorrectColumnType.js.map