"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const config = __importStar(require("@/services/datastores/cassandra/lib/cassandra-config"));
const errors_1 = require("../errors");
const statement_utils_1 = require("../utils/statement-utils");
const validation_utils_1 = require("../utils/validation-utils");
const columns_1 = require("./columns");
const tables_1 = require("./tables");
const row_utils_1 = require("../utils/row-utils");
const logger = logger_1.default(module);
/**
 * Executes a CQL statement.
 * @param client Existing client connection.
 * @param query The CQL statement to execute.
 * @param clusterAccess If cluster access is to be enforced, pass the cluster access configuration for the current user.
 * @param logMetadata Additional metadata to include in log entries.
 * @param options Statement execution options. Note: depending on the type of query, some options may be required.
 */
async function execute(client, query, clusterAccess, logMetadata, options = {
    includeSchema: false,
    enforceQueryRestrictions: true,
}) {
    if (!query) {
        throw new Error('invalid query');
    }
    if (options && options.enforceQueryRestrictions) {
        validation_utils_1.checkQueryRestrictions(query);
    }
    const queryOptions = {
        pageState: options.cursor,
        fetchSize: config.fetchSize || 100,
        consistency: options.consistency,
    };
    const re = new RegExp('(from|into|update|create table)\\s+["]?([a-zA-Z0-9_-]*?)["]?\\.["]?([a-zA-Z0-9_-]*)["]?[\\s]?[;]?', 'i');
    const matches = re.exec(query);
    let keyspace = undefined;
    let table = undefined;
    if (matches && matches.length === 4) {
        keyspace = matches[2];
        table = matches[3];
    }
    if (clusterAccess) {
        const { isShared, userKeyspaceNames } = clusterAccess;
        if (keyspace && isShared && !userKeyspaceNames.has(keyspace)) {
            throw new errors_1.CassandraKeyspaceNotAccessible(keyspace);
        }
    }
    const isSelect = statement_utils_1.isSelectQuery(query);
    let schema;
    const blobColumns = new Set();
    if (options && options.includeSchema) {
        if (!keyspace || !table) {
            throw new errors_1.CassandraStatementUnparseableError(query);
        }
        schema = await tables_1.getTable(client, keyspace, table);
        if (isSelect) {
            schema.columns.forEach((column) => {
                if (column.type.includes('blob')) {
                    blobColumns.add(column.name);
                }
            });
        }
    }
    else {
        schema = undefined;
    }
    logger.info('starting query');
    const startTime = Date.now();
    let trimmedQuery = query.trim();
    if (trimmedQuery.endsWith(';')) {
        trimmedQuery = trimmedQuery.substr(0, trimmedQuery.length - 1);
    }
    const queryToSubmit = statement_utils_1.limitSelectQuery(statement_utils_1.makeQueryCaseSensitive(trimmedQuery, keyspace, table), config.fetchSize);
    logger.info(`freeform query: ${queryToSubmit} with fetchSize: ${queryOptions.fetchSize}`, logMetadata);
    try {
        const result = await client.execute(queryToSubmit, undefined, queryOptions);
        logger.info(`query completed: ${queryToSubmit}, with fetchSize: ${queryOptions.fetchSize}, elapsed: ${Date.now() - startTime} ms`, logMetadata);
        const columns = result.columns || [];
        const rows = result.rows || [];
        if (rows.length > 0 && (!schema || !options.keyQueryOptions)) {
            throw new Error('Statement produced results, but schema or keyQueryOptions not set.');
        }
        const columnNames = columns.map((column) => column.name);
        return {
            columns: columns.map(columns_1.mapColumn),
            rows: rows.map((row) => row_utils_1.mapResultRow(row, columnNames, schema, options.keyQueryOptions)),
            pageState: result.pageState,
            warnings: result.info.warnings,
            schema,
            truncatedColumns: [],
        };
    }
    catch (err) {
        logger.error(`Failed to execute: ${queryToSubmit} with fetchSize: ${queryOptions.fetchSize}, due to: "${err.message}"`, logMetadata);
        throw new errors_1.CassandraQueryError(query, err.message);
    }
}
exports.execute = execute;
//# sourceMappingURL=statement.js.map