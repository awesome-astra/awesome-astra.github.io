"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClusterSchema = exports.mapColumn = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const cassandra_driver_1 = require("cassandra-driver");
const cluster_utils_1 = require("../utils/cluster-utils");
const query_utils_1 = require("../utils/query-utils");
const type_utils_1 = require("../utils/type-utils");
const query_builder_1 = require("./query-builder");
const tables_1 = require("./tables");
const logger = logger_1.default(module);
/**
 * The following types require quotes when used in where clauses.
 */
const QUOTED_TYPE_SET = new Set([
    'ascii',
    'inet',
    'text',
    'time',
    'timestamp',
    'varchar',
]);
function mapColumn(column) {
    const type = cassandra_driver_1.types.getDataTypeNameByCode(column.type);
    const dataType = type_utils_1.getJsType(type);
    return {
        name: column.name,
        type,
        dataType,
        options: column.type.options,
        needsQuotes: QUOTED_TYPE_SET.has(type),
    };
}
exports.mapColumn = mapColumn;
async function getClusterSchema(client, keyspace) {
    await client.connect();
    const standardColumns = ['keyspace_name', 'column_name'];
    let queryBuilder = new query_builder_1.Select.Builder();
    if (cluster_utils_1.isVersion3(client)) {
        queryBuilder
            .columns([
            ...standardColumns,
            'table_name',
            new query_builder_1.Alias('kind', 'key_type'),
        ])
            .from('system_schema', 'columns');
    }
    else {
        queryBuilder
            .columns([
            ...standardColumns,
            new query_builder_1.Alias('columnfamily_name', 'table_name'),
            new query_builder_1.Alias('type', 'key_type'),
        ])
            .from('system', 'schema_columns');
    }
    if (keyspace) {
        queryBuilder = queryBuilder.where(['keyspace_name']);
    }
    const query = queryBuilder.build();
    try {
        const [allTables, allSchemaItems] = await Promise.all([
            tables_1.getTables(client, undefined),
            query_utils_1.streamAllResults(client, query, {
                keyspace_name: keyspace,
            }, (row) => ({
                keyspace: row.keyspace_name,
                table: row.table_name,
                column: row.column_name,
                type: row.key_type ? row.key_type.replace('_key', '') : null,
                isThrift: false,
            })),
        ]);
        const tableThriftMap = allTables.reduce((prev, curr) => prev.set(curr.name, curr.isThrift), new Map());
        return allSchemaItems.map((item) => {
            var _a;
            const isThrift = (_a = tableThriftMap.get(item.table)) !== null && _a !== void 0 ? _a : false;
            return { ...item, isThrift };
        });
    }
    catch (err) {
        logger.info(`failed to fetch all cluster schema entries: ${err.message}`);
        throw err;
    }
}
exports.getClusterSchema = getClusterSchema;
//# sourceMappingURL=columns.js.map