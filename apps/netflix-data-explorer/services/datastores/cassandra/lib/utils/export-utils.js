"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCsv = exports.generateCqlStatements = void 0;
const collection_utils_1 = require("@/shared/cassandra/collection-utils");
function generateCqlStatements(schema, rows, cassandraApi, encoding) {
    return rows.map((row) => {
        const rowWithoutSpecialFields = Object.entries(row).reduce((prev, curr) => {
            const [columnName, value] = curr;
            // ignore fields like `TTL(column)` and `writetime(column)`
            if (columnName.indexOf('(') === -1) {
                prev[columnName] = value;
            }
            return prev;
        }, {});
        return cassandraApi.generateInsertStatement(schema, rowWithoutSpecialFields, encoding);
    });
}
exports.generateCqlStatements = generateCqlStatements;
function generateCsv(schema, columns, rows, columnDelimiter = '\t', lineDelimiter = '\n') {
    const columnMap = new Map();
    schema.columns.map((col) => columnMap.set(col.name, col));
    const sortedColumns = sortTableColumns(schema, columns);
    const columnNames = sortedColumns.map((column) => column.name);
    let tsv = `${columnNames.join(columnDelimiter)}${lineDelimiter}`;
    rows.forEach((row) => {
        const cell = columnNames
            .map((columnName) => {
            const { type } = columnMap.get(columnName);
            const value = row[columnName];
            if (value === null) {
                return '';
            }
            else if (collection_utils_1.isCollectionType(type)) {
                return collection_utils_1.getCollectionRowValueAsString(type, value);
            }
            else if (type === 'timestamp' && value) {
                return value.toISOString();
            }
            return value;
        })
            .join(columnDelimiter);
        tsv += `${cell}${lineDelimiter}`;
    });
    return tsv;
}
exports.generateCsv = generateCsv;
function sortTableColumns(schema, columns) {
    const partitionKeyMap = new Map();
    const clusteringKeyMap = new Map();
    schema.partitionKeys.forEach((key, index) => partitionKeyMap.set(key.name, index));
    schema.clusteringKeys.forEach((key, index) => clusteringKeyMap.set(key.name, index));
    const sortedColumns = columns.sort((a, b) => {
        const aIsPartitionKey = partitionKeyMap.has(a.name);
        const bIsPartitionKey = partitionKeyMap.has(b.name);
        const aIsClusteringKey = clusteringKeyMap.has(a.name);
        const bIsClusteringKey = clusteringKeyMap.has(b.name);
        if (aIsPartitionKey && !bIsPartitionKey) {
            return -1;
        }
        else if (!aIsPartitionKey && bIsPartitionKey) {
            return 1;
        }
        else if (aIsPartitionKey && bIsPartitionKey) {
            return partitionKeyMap.get(a.name) - partitionKeyMap.get(b.name);
        }
        if (aIsClusteringKey && !bIsClusteringKey) {
            return -1;
        }
        else if (!aIsClusteringKey && bIsClusteringKey) {
            return 1;
        }
        else if (aIsClusteringKey && bIsClusteringKey) {
            return clusteringKeyMap.get(a.name) - clusteringKeyMap.get(b.name);
        }
        if (a.name < b.name) {
            return -1;
        }
        else if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return sortedColumns;
}
//# sourceMappingURL=export-utils.js.map