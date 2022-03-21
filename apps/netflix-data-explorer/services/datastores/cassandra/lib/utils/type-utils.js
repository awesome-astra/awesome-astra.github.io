"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsType = exports.buildTypeHints = void 0;
/**
 * The client sends all query parameters as Strings due to the limitations of some clients
 * to be able to support C* data types (e.g. bigint can't be handled via native JS). as such,
 * we need to populate the list of hints with each column's data type from the schema.
 * @param schema      The table schema containing the column definitions.
 * @param columnNames The list of column names.
 * @returns Returns an Array of C* data type names to be used as hints.
 */
function buildTypeHints(schema, columnNames) {
    const schemaNameToTypeMap = {};
    schema.columns.forEach((columnSchema) => {
        schemaNameToTypeMap[columnSchema.name] = columnSchema.type;
    });
    return columnNames.map((columnName) => schemaNameToTypeMap[columnName]);
}
exports.buildTypeHints = buildTypeHints;
function getJsType(fieldType) {
    switch (fieldType) {
        case 'bigint':
        case 'counter':
        case 'decimal':
        case 'double':
        case 'float':
        case 'int':
        case 'smallint':
        case 'tinyint':
        case 'varint':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'blob':
            return 'object';
        default:
            return 'string';
    }
}
exports.getJsType = getJsType;
//# sourceMappingURL=type-utils.js.map