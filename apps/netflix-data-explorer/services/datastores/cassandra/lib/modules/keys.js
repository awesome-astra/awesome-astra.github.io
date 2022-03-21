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
exports.generateInsertStatement = exports.updateKey = exports.insertKey = exports.deleteKey = exports.getKeys = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const config = __importStar(require("../cassandra-config"));
const errors_1 = require("../errors");
const schema_utils_1 = require("../utils/schema-utils");
const statement_utils_1 = require("../utils/statement-utils");
const type_utils_1 = require("../utils/type-utils");
const validation_utils_1 = require("../utils/validation-utils");
const columns_1 = require("./columns");
const query_builder_1 = require("./query-builder");
const tables_1 = require("./tables");
const row_utils_1 = require("../utils/row-utils");
const CassandraCreateOrUpdateError_1 = require("../errors/CassandraCreateOrUpdateError");
const logger = logger_1.default(module);
async function getKeys(client, keyspace, table, params, pageState, logMetadata) {
    const INVALID_CHARS = /[^a-zA-Z0-9_]/;
    if (keyspace.match(INVALID_CHARS)) {
        throw new Error(`invalid keyspace name ${keyspace}`);
    }
    if (table.match(INVALID_CHARS)) {
        throw new Error(`invalid table name ${table}`);
    }
    const schema = await tables_1.getTable(client, keyspace, table);
    const includedColumns = getIncludedColumns(schema, params.options);
    const options = {
        pageState,
        fetchSize: config.fetchSize || 100,
        prepare: false,
        isIdempotent: true,
    };
    const { columns, values } = getValueBindings(schema, params.primaryKey);
    // if query parameters have been provided, build the WHERE clause
    if (columns.length > 0) {
        options.prepare = true;
        options.hints = type_utils_1.buildTypeHints(schema, columns);
    }
    const additionalColumns = schema_utils_1.getAdditionalQueryColumnNames(schema);
    const query = new query_builder_1.Select.Builder()
        .columns(includedColumns.map((column) => column.name))
        .columnsTtl(additionalColumns)
        .columnsWriteTime(additionalColumns)
        .from(keyspace, table)
        .where(Object.keys(params.primaryKey))
        .limit(options.fetchSize) // append a LIMIT in addition to using fetchSize to guard against fetchSize being ignored by the driver.
        .build();
    logger.info(`prepared query: ${query} with bindings: ${JSON.stringify(values)} and fetchSize: ${options.fetchSize}`, logMetadata);
    const queryStartTime = Date.now();
    try {
        const { columns, rows, pageState, info } = await client.execute(query, values, options);
        logger.info(`elapsed query: ${Date.now() - queryStartTime} ms -- query: ${query} with bindings: ${JSON.stringify(values)} and fetchSize: ${options.fetchSize}`, logMetadata);
        const columnNames = columns.map((column) => column.name);
        return {
            columns: columns.map(columns_1.mapColumn),
            rows: rows.map((row) => row_utils_1.mapResultRow(row, columnNames, schema, params.options)),
            pageState,
            warnings: info.warnings,
            truncatedColumns: [],
        };
    }
    catch (err) {
        logger.error(`Failed to execute: ${query} with bindings: ${JSON.stringify(values)}
        and fetchSize: ${options.fetchSize}, due to: "${err.message}"`, logMetadata);
        throw new errors_1.CassandraQueryError(query, err.message);
    }
}
exports.getKeys = getKeys;
/**
 * Fetches the set of columns to include in a query based on the retrieval options
 * and the column types.
 */
function getIncludedColumns(schema, options) {
    const { columns, primaryKey } = schema;
    const { encoding, decodeValues } = options;
    let includedColumns;
    if (encoding) {
        if (decodeValues) {
            includedColumns = columns;
        }
        else {
            const pkSet = primaryKey.reduce((set, key) => set.add(key.name), new Set());
            includedColumns = columns.filter(({ name, type }) => !type.includes('blob') || pkSet.has(name));
        }
    }
    else {
        includedColumns = columns.filter((col) => !col.type.includes('blob'));
    }
    return includedColumns;
}
async function deleteKey(client, keyspace, table, key, logMetadata) {
    const schema = await tables_1.getTable(client, keyspace, table);
    // safety check, ensure someone doesn't craft a URL to delete by partition key only.
    validation_utils_1.checkCompletePrimaryKey(schema, key);
    const command = statement_utils_1.deleteStatement(keyspace, table, schema, key);
    logger.info(`deleting record: ${command}`, logMetadata);
    await client.execute(command);
    logger.info('deleted record successfully', logMetadata);
    return true;
}
exports.deleteKey = deleteKey;
async function insertKey(client, keyspace, table, row, logMetadata) {
    const schema = await tables_1.getTable(client, keyspace, table);
    if (Object.keys(row).length === 0) {
        throw new errors_1.CassandraNoFieldsToUpdate(keyspace, table);
    }
    const insertStatement = statement_utils_1.buildInsertStatement(keyspace, table, row);
    logger.info(`performing insert: ${insertStatement}`, logMetadata);
    const { columns, values } = getValueBindings(schema, row);
    try {
        await client.execute(insertStatement, values, {
            hints: type_utils_1.buildTypeHints(schema, columns),
        });
        logger.info('updated record successfully .', logMetadata);
    }
    catch (err) {
        throw new CassandraCreateOrUpdateError_1.CassandraCreateOrUpdateError(err.message);
    }
    return true;
}
exports.insertKey = insertKey;
async function updateKey(client, keyspace, table, key, updateFields, logMetadata) {
    const schema = await tables_1.getTable(client, keyspace, table);
    const { primaryKey } = key;
    if (Object.keys(primaryKey).length === 0) {
        throw new errors_1.CassandraPrimaryKeyMissing(keyspace, table);
    }
    validation_utils_1.checkCompletePrimaryKey(schema, key);
    if (Object.keys(updateFields).length === 0) {
        throw new errors_1.CassandraNoFieldsToUpdate(keyspace, table);
    }
    const stmt = statement_utils_1.updateStatement(keyspace, table, schema, key, updateFields);
    logger.info(`performing update: ${stmt}`, logMetadata);
    const { columns, values } = getValueBindings(schema, updateFields, true);
    await client.execute(stmt, values, {
        hints: type_utils_1.buildTypeHints(schema, columns),
    });
    logger.info('updated record successfully .', logMetadata);
    return true;
}
exports.updateKey = updateKey;
function generateInsertStatement(schema, fields, encoding) {
    const builder = new query_builder_1.Insert.Builder().into(schema).encoding(encoding);
    for (const [column, value] of Object.entries(fields)) {
        builder.value(column, value);
    }
    return builder.build();
}
exports.generateInsertStatement = generateInsertStatement;
/**
 * Extracts the columns and values
 * @param row The row details
 */
function getValueBindings(schema, row, skipCounters = false) {
    const columnMap = schema.columns.reduce((prev, curr) => prev.set(curr.name, curr), new Map());
    return Object.entries(row).reduce((prev, [key, details]) => {
        var _a;
        if (skipCounters && ((_a = columnMap.get(key)) === null || _a === void 0 ? void 0 : _a.type) === 'counter') {
            return prev;
        }
        const { value, options } = details;
        const { encoding } = options;
        prev.columns.push(key);
        if (encoding && value !== undefined) {
            if (encoding === 'hex' &&
                typeof value === 'string' &&
                value.startsWith('0x')) {
                prev.values.push(Buffer.from(value.substring(2), encoding));
            }
            else {
                prev.values.push(Buffer.from(value, encoding));
            }
        }
        else {
            prev.values.push(value);
        }
        return prev;
    }, {
        columns: new Array(),
        values: new Array(),
    });
}
//# sourceMappingURL=keys.js.map