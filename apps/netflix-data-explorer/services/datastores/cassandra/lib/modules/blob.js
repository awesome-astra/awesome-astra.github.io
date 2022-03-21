"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryValue = void 0;
const errors_1 = require("../errors");
const schema_utils_1 = require("../utils/schema-utils");
const tables_1 = require("./tables");
async function getBinaryValue(client, keyspace, table, keyQuery, binaryColumnName) {
    const schema = await tables_1.getTable(client, keyspace, table);
    if (!keyQuery || Object.keys(keyQuery.primaryKey).length === 0) {
        throw new errors_1.CassandraPrimaryKeyMissing(keyspace, table);
    }
    if (!binaryColumnName) {
        throw new Error('Blob column name is required');
    }
    const column = schema.columns.find((col) => col.name.toLowerCase() === binaryColumnName.toLowerCase());
    if (!column) {
        throw new errors_1.CassandraColumnNameNotFound(keyspace, table, binaryColumnName);
    }
    if (column.type !== 'blob') {
        throw new errors_1.CassandraIncorrectColumnType(keyspace, table, binaryColumnName, column.type, 'blob');
    }
    const whereClauses = schema_utils_1.getWhereClause(schema, keyQuery);
    const query = `
            SELECT "${binaryColumnName}"
            FROM "${keyspace}"."${table}"
            WHERE ${whereClauses.join(' AND ')}`;
    const { rows } = await client.execute(query);
    if (rows.length === 0) {
        throw new Error('Could not find a matching record. This record may have already been deleted.');
    }
    if (rows.length > 1) {
        throw new Error('Expected a single result. This is likely to occur if an invalid primary key was specified');
    }
    const row = rows[0];
    return row[binaryColumnName];
}
exports.getBinaryValue = getBinaryValue;
//# sourceMappingURL=blob.js.map