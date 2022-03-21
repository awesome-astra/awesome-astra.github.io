"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyspace = exports.getKeyspaces = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
const schema_utils_1 = require("../utils/schema-utils");
const logger = logger_1.default(module);
function mapKeyspace(keyspace) {
    const { name, strategy, strategyOptions } = keyspace;
    return { name, strategy: schema_utils_1.getClassName(strategy), strategyOptions };
}
async function getKeyspaces(client) {
    logger.info('fetching keyspaces');
    await client.connect();
    logger.info('fetched all keyspaces');
    const keyspaces = Object.values(client.metadata.keyspaces).map(mapKeyspace);
    return lodash_1.sortBy(keyspaces, 'name');
}
exports.getKeyspaces = getKeyspaces;
async function getKeyspace(client, keyspaceName) {
    logger.info(`fetching keyspace: ${keyspaceName}`);
    await client.connect();
    const keyspace = client.metadata.keyspaces[keyspaceName]; // TODO cast required until driver types are updated https://datastax-oss.atlassian.net/browse/NODEJS-558
    if (!keyspace) {
        throw new errors_1.CassandraKeyspaceNotFound(keyspaceName);
    }
    logger.info(`fetched keyspace "${keyspaceName}"`);
    return mapKeyspace(keyspace);
}
exports.getKeyspace = getKeyspace;
//# sourceMappingURL=keyspaces.js.map