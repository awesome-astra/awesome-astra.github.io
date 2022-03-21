"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeValueString = exports.getColumnsFromSelect = exports.isSelectQuery = exports.limitSelectQuery = exports.makeQueryCaseSensitive = exports.deleteStatement = exports.updateStatement = exports.buildInsertStatement = void 0;
const schema_utils_1 = require("@/services/datastores/cassandra/lib/utils/schema-utils");
/**
 * Generates a CQL INSERT statement from the given input.
 */
function buildInsertStatement(keyspace, table, row) {
    const fieldNames = Object.keys(row).map((field) => `"${field}"`);
    return `
    INSERT INTO "${keyspace}"."${table}"
    (${fieldNames.join(',')})
    VALUES (${fieldNames.map(() => '?').join(',')})`.trim();
}
exports.buildInsertStatement = buildInsertStatement;
/**
 * Generates a CQL UPDATE statement from the given input.
 */
function updateStatement(keyspace, table, schema, primaryKey, updateFields) {
    const whereClauses = schema_utils_1.getWhereClause(schema, primaryKey);
    const columnMap = schema.columns.reduce((prev, curr) => prev.set(curr.name, curr), new Map());
    const setStatements = new Array();
    Object.entries(updateFields).forEach(([fieldName, details]) => {
        const column = columnMap.get(fieldName);
        if (column && column.type === 'counter') {
            // only include a set statement for counters of the form `columnName+1`
            if (typeof details.value === 'string' &&
                details.value.indexOf(fieldName) >= 0) {
                setStatements.push(`${fieldName}=${details.value}`);
            }
        }
        else {
            setStatements.push(`${fieldName}=?`);
        }
    });
    return `
    UPDATE "${keyspace}"."${table}"
    SET ${setStatements.join(', ')}
    WHERE ${whereClauses.join(' AND ')}`.trim();
}
exports.updateStatement = updateStatement;
/**
 * Generates a CQL DELETE statement from the given input.
 */
function deleteStatement(keyspace, table, schema, primaryKey) {
    const whereClauses = schema_utils_1.getWhereClause(schema, primaryKey);
    return `
    DELETE FROM "${keyspace}"."${table}"
    WHERE ${whereClauses.join(' AND ')}`.trim();
}
exports.deleteStatement = deleteStatement;
/**
 * Since difference C* drivers allow case-sensitive keyspaces/tables,
 * quotes must be applied to the keyspace and table names.
 *
 * e.g.
 * ```
 * const result = makeQueryCaseSensitive('select * from keyspaceA.tableB', 'KeySpaceA', 'TABLEb')
 * // select * from "KeySpaceA"."TABLEb"
 * ```
 */
function makeQueryCaseSensitive(query, keyspace, table) {
    return keyspace && table
        ? query.replace(/["]?([a-zA-Z0-9_-]*?)["]?\.["]?([a-zA-Z0-9_-]*)["]?/, `"${keyspace}"."${table}"`)
        : query;
}
exports.makeQueryCaseSensitive = makeQueryCaseSensitive;
/**
 * Limits a SELECT query to the specified number of results. Note, if a LIMIT is already specified
 * it will be used if it is less than the provided limit value. If the original query LIMIT is higher,
 * it will be rewritten with the provided (lower) value.
 * @param query The user's SELECT query which may or may not include a LIMIT.
 * @param limit The limit to apply.
 * @returns If the query is a SELECT, then a new string is returned with the given limit applied.
 * If the query is not a SELECT (e.g. INSERT or UPDATE), then the original query is returned unmodified.
 */
function limitSelectQuery(query, limit) {
    if (!isSelectQuery(query)) {
        return query;
    }
    const newLimit = `LIMIT ${limit}`;
    const matches = query.match(new RegExp(/^.*\s(limit\s(\d+))\s*$/, 'i'));
    if (matches) {
        const [, limitString, limitValue] = matches;
        if (parseInt(limitValue, 10) <= limit) {
            return query;
        }
        return query.replace(limitString, newLimit);
    }
    else {
        return `${query} ${newLimit}`;
    }
}
exports.limitSelectQuery = limitSelectQuery;
/**
 * Helper function for identifying SELECT queries.
 */
function isSelectQuery(query) {
    return !!query.match(new RegExp(/^\s*select\s+.*$/, 'i'));
}
exports.isSelectQuery = isSelectQuery;
function getColumnsFromSelect(query) {
    if (!isSelectQuery(query)) {
        return [];
    }
    const matches = query.match(new RegExp(/^\s*select\s+(.+)\s+from/, 'i'));
    if (matches) {
        const [, columns] = matches;
        return columns.split(',').map((columnName) => columnName.trim());
    }
    return [];
}
exports.getColumnsFromSelect = getColumnsFromSelect;
function escapeValueString(value) {
    return value.replace(/'/g, "''");
}
exports.escapeValueString = escapeValueString;
//# sourceMappingURL=statement-utils.js.map