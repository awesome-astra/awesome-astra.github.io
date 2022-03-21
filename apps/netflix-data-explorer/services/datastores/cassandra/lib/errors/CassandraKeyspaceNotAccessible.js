"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CassandraKeyspaceNotAccessible = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class CassandraKeyspaceNotAccessible extends HttpStatusError_1.default {
    constructor(keyspace) {
        super(403, 'Keyspace is not accessible', `Operation on keyspace "${keyspace}" is not permitted.`, `You are not authorized to access the keyspace "${keyspace}" on this cluster.`);
        this.keyspace = keyspace;
    }
}
exports.CassandraKeyspaceNotAccessible = CassandraKeyspaceNotAccessible;
//# sourceMappingURL=CassandraKeyspaceNotAccessible.js.map