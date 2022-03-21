"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraPrimaryKeyMissing = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraPrimaryKeyMissing extends HttpStatusError_1.default {
    constructor(keyspace, table) {
        super(400, 'Primary key missing', `Unable to perform updates to table "${keyspace}"."${table}" due to missing primary key.`, 'Please check the statement to ensure a valid primary key was provided. The primary key consists of ' +
            'all partition keys and clustering columns.');
    }
}
exports.CassandraPrimaryKeyMissing = CassandraPrimaryKeyMissing;
//# sourceMappingURL=CassandraPrimaryKeyMissing.js.map