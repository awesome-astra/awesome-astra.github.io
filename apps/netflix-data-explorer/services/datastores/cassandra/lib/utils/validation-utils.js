"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCompletePrimaryKey = exports.checkQueryRestrictions = exports.validateName = void 0;
const errors_1 = require("@/services/datastores/cassandra/lib/errors");
const restricted_queries_1 = require("@/services/datastores/cassandra/lib/restricted-queries");
function validateName(keyspaceOrTableName, objectType) {
    const INVALID_CHARS = /[^a-zA-Z0-9_]/;
    if (keyspaceOrTableName.match(INVALID_CHARS)) {
        throw new Error(`invalid ${objectType} name ${keyspaceOrTableName}`);
    }
}
exports.validateName = validateName;
/**
 * Helper method for santizing a free form query and making sure it doesn't contain any illegal statements.
 * This method does not return anything, but simply throws a CassandraStatementNotAllowed Error if the query
 * contains illegal statements.
 * @param  query The free form query.
 * @throws CassandraStatementNotAllowed
 */
function checkQueryRestrictions(query) {
    const illegalStatements = new Array();
    restricted_queries_1.getRestrictedQueries().forEach((forbiddenQuery) => {
        const re = new RegExp(forbiddenQuery.regex, 'gi');
        if (query.match(re)) {
            illegalStatements.push(forbiddenQuery.message);
        }
    });
    if (illegalStatements.length > 0) {
        throw new errors_1.CassandraStatementNotAllowed(query, illegalStatements[0]);
    }
}
exports.checkQueryRestrictions = checkQueryRestrictions;
/**
 * Helper method for checking if a given primary key is completely specified (partition key
 * and clustering keys).
 * @param schema The schema to validate against.
 * @param keyQuery The primary key components.
 */
function checkCompletePrimaryKey(schema, keyQuery) {
    let key;
    if (keyQuery.primaryKey && keyQuery.options) {
        key = Object.entries(keyQuery.primaryKey).reduce((prev, [name, details]) => {
            prev[name] = details.value;
            return prev;
        }, {});
    }
    else {
        key = keyQuery;
    }
    if (!isCompletePrimaryKey(schema, key)) {
        throw new errors_1.CassandraPrimaryKeyMissing(schema.keyspace, schema.name);
    }
}
exports.checkCompletePrimaryKey = checkCompletePrimaryKey;
/**
 * Helper method for checking if the given primary key fully specifies all partition and clustering keys.
 * @param   schema      The table schema to test against.
 * @param   keyQuery  The primary key that should identify a single record.
 * @return  True if every key is specified. False otherwise.
 */
function isCompletePrimaryKey(schema, primaryKey) {
    const { primaryKey: pkColumns } = schema;
    const requiredFields = pkColumns.map((col) => col.name);
    const primaryKeySet = new Set(Object.keys(primaryKey));
    return requiredFields.every((key) => primaryKeySet.has(key));
}
//# sourceMappingURL=validation-utils.js.map