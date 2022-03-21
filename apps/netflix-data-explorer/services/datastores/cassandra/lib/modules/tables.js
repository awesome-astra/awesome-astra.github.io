"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTable = exports.getTables = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const errors_1 = require("../errors");
const cluster_utils_1 = require("../utils/cluster-utils");
const query_utils_1 = require("../utils/query-utils");
const schema_utils_1 = require("../utils/schema-utils");
const validation_utils_1 = require("../utils/validation-utils");
const columns_1 = require("./columns");
const query_builder_1 = require("./query-builder");
const logger = logger_1.default(module);
async function getTables(client, keyspace) {
    await client.connect();
    const standardColumns = [
        'keyspace_name',
        'comment',
        'caching',
        'gc_grace_seconds',
        'default_time_to_live',
        'speculative_retry',
    ];
    const isV3 = cluster_utils_1.isVersion3(client);
    let queryBuilder = new query_builder_1.Select.Builder();
    if (isV3) {
        queryBuilder
            .columns([
            ...standardColumns,
            new query_builder_1.Alias('table_name', 'name'),
            'compaction',
            'compression',
            'flags',
        ])
            .from('system_schema', 'tables');
    }
    else {
        queryBuilder
            .columns([
            ...standardColumns,
            new query_builder_1.Alias('columnfamily_name', 'name'),
            'compaction_strategy_class',
            'compaction_strategy_options',
            'compression_parameters',
            'comparator',
            'is_dense',
        ])
            .from('system', 'schema_columnfamilies');
    }
    if (keyspace) {
        queryBuilder = queryBuilder.where(['keyspace_name']);
    }
    const query = queryBuilder.build();
    logger.info(`fetching all tables: ${query}`);
    try {
        const allTables = await query_utils_1.streamAllResults(client, query, { keyspace_name: keyspace }, (row) => {
            let isThrift;
            let compression = {};
            if (isV3) {
                isThrift = schema_utils_1.isThriftV3(row.flags);
                compression = row.compression;
            }
            else {
                isThrift = schema_utils_1.isThriftV2(!!row.is_dense, row.comparator);
                compression = JSON.parse(row.compression_parameters);
            }
            return {
                keyspace: row.keyspace_name,
                name: row.name,
                description: row.comment,
                compaction: schema_utils_1.extractCompaction(client, row),
                isThrift,
                properties: {
                    caching: row.caching,
                    compression: schema_utils_1.getCompressionDetails(compression),
                    defaultTtl: row.default_time_to_live,
                    gcGraceSeconds: row.gc_grace_seconds,
                    speculativeRetry: row.speculative_retry,
                },
            };
        });
        return allTables;
    }
    catch (err) {
        logger.error(`Failed to fetch all tables for keyspace: ${keyspace}, due to: ${err.message}`);
        throw err;
    }
}
exports.getTables = getTables;
async function getTable(client, keyspace, table) {
    validation_utils_1.validateName(keyspace, 'keyspace');
    validation_utils_1.validateName(table, 'table');
    await client.connect();
    const tableInfo = await client.metadata.getTable(keyspace, table);
    if (!tableInfo) {
        throw new errors_1.CassandraTableNotFound(keyspace, table);
    }
    logger.info(`retrieved table metadata for: ${tableInfo.name}`);
    const partitionKeys = tableInfo.partitionKeys.map(columns_1.mapColumn);
    const clusteringKeys = tableInfo.clusteringKeys.map(columns_1.mapColumn);
    const info = {
        keyspace,
        name: tableInfo.name,
        clusteringKeys,
        clusteringOrder: tableInfo.clusteringOrder,
        columns: tableInfo.columns.map(columns_1.mapColumn),
        indexes: tableInfo.indexes,
        partitionKeys,
        primaryKey: [...partitionKeys, ...clusteringKeys],
        isThrift: tableInfo.isCompact,
        properties: {
            bloomFilterFalsePositiveChance: tableInfo.bloomFilterFalsePositiveChance,
            caching: schema_utils_1.getCachingDetails(tableInfo.caching),
            comment: tableInfo.comment,
            compression: schema_utils_1.getCompressionDetails(tableInfo.compression),
            defaultTtl: tableInfo.defaultTtl,
            gcGraceSeconds: tableInfo.gcGraceSeconds,
            memtableFlushPeriod: tableInfo.memtableFlushPeriod,
            populateCacheOnFlush: tableInfo.populateCacheOnFlush,
            readRepairChance: tableInfo.readRepairChance,
            replicateOnWrite: tableInfo.replicateOnWrite,
            speculativeRetry: tableInfo.speculativeRetry,
            compaction: {
                class: schema_utils_1.getClassName(tableInfo.compactionClass),
                options: tableInfo.compactionOptions,
            },
        },
    };
    return info;
}
exports.getTable = getTable;
//# sourceMappingURL=tables.js.map