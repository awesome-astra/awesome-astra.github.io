"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlobColumnNames = exports.isThriftV2 = exports.isThriftV3 = exports.getWhereClause = exports.getAdditionalQueryColumnNames = exports.getAdditionalQueryColumns = exports.extractCompaction = exports.getCompressionDetails = exports.getCachingDetails = exports.getClassName = void 0;
const cluster_utils_1 = require("@/services/datastores/cassandra/lib/utils/cluster-utils");
const lodash_1 = __importDefault(require("lodash"));
const statement_utils_1 = require("./statement-utils");
/**
 * Helper method for extracting the class name from a fully qualified class name (including java package).
 * @param   fullyQualifiedClass  The fully qualified class name.
 * @returns Returns just the Class portion.
 */
function getClassName(fullyQualifiedClass) {
    const classNamePattern = new RegExp('.*\\.(.*)');
    const match = classNamePattern.exec(fullyQualifiedClass);
    return match && match.length === 2 ? match[1] : '';
}
exports.getClassName = getClassName;
function getCachingDetails(caching) {
    try {
        const result = JSON.parse(caching.replace(/'/g, '"'));
        return {
            keys: result.keys,
            rows: result.rows_per_partition,
        };
    }
    catch (err) {
        throw new Error(`Invalid caching string: "${caching}"`);
    }
}
exports.getCachingDetails = getCachingDetails;
function getCompressionDetails(compressionInfo) {
    // note, this is our attempt at handling the different C* versions as well as different property
    // names based on the driver version
    const patternMap = {
        'class|sstable_compression': 'class',
        '^chunk_length_(in_)?kb$': 'chunk_length_kb',
    };
    const compressionDetails = {};
    Object.keys(compressionInfo).forEach((key) => {
        // test to see if we have aliased this property
        const patterns = Object.keys(patternMap);
        let alias = undefined;
        for (const pattern of patterns) {
            if (new RegExp(pattern).test(key)) {
                alias = patternMap[pattern];
                break;
            }
        }
        compressionDetails[alias || key] = compressionInfo[key];
    });
    // rewrite the the 'class' property to use the the Compressor class name
    compressionDetails.class = getClassName(compressionDetails.class);
    return compressionDetails;
}
exports.getCompressionDetails = getCompressionDetails;
/**
 * Helper method for extracting the compaction strategy details for a row from the system tables. Also handles the
 * version differences between 2.x and 3.x.
 * @param  row
 * @return {{strategy: String, options: Object}}
 */
function extractCompaction(client, row) {
    let strategy;
    let options;
    if (cluster_utils_1.isVersion3(client)) {
        strategy = row.compaction.class;
        options = lodash_1.default.omit(row.compaction, 'class');
    }
    else {
        strategy = row.compaction_strategy_class;
        options = row.compaction_strategy_options;
    }
    return { strategy: getClassName(strategy), options };
}
exports.extractCompaction = extractCompaction;
/**
 * Given a schema, this helper method will generate a list of additional column queries useful for
 * including additional row metadata (e.g. TTL information).
 * @param  schema      The table schema.
 * @return Returns an array of additional column queries.
 */
function getAdditionalQueryColumns(schema) {
    const partitionKeyNameSet = new Set(schema.partitionKeys.map((col) => col.name));
    const clusteringKeyNameSet = new Set(schema.clusteringKeys.map((col) => col.name));
    const additionalColumns = schema.columns.filter((col) => {
        const isCollection = col.type.match(/.*<.*>/);
        return (!isCollection &&
            !partitionKeyNameSet.has(col.name) &&
            !clusteringKeyNameSet.has(col.name));
    });
    const ttlColumns = additionalColumns.map((col) => `TTL("${col.name}")`);
    const writeTimeColumns = additionalColumns.map((col) => `writetime("${col.name}")`);
    return new Array().concat(ttlColumns, writeTimeColumns);
}
exports.getAdditionalQueryColumns = getAdditionalQueryColumns;
/**
 * Given a schema, this helper method will generate a list of additional column queries useful for
 * including additional row metadata (e.g. TTL information).
 * @param  schema      The table schema.
 * @return Returns an array of additional column queries.
 */
function getAdditionalQueryColumnNames(schema) {
    const { partitionKeys, clusteringKeys, columns } = schema;
    const partitionKeyNameSet = new Set(partitionKeys.map((col) => col.name));
    const clusteringKeyNameSet = new Set(clusteringKeys.map((col) => col.name));
    return columns
        .filter((col) => {
        const isCollection = col.type.match(/.*<.*>/);
        return (!isCollection &&
            !partitionKeyNameSet.has(col.name) &&
            !clusteringKeyNameSet.has(col.name));
    })
        .map((column) => column.name);
}
exports.getAdditionalQueryColumnNames = getAdditionalQueryColumnNames;
/**
 * Returns an array of where clauses using the primary key components.
 * @param schema      The table schema.
 * @param primaryKey  A map of primary key pairs where the keys are the name of the primary key fields
 *                    and the values are the primary key values. This is used to locate the record to
 *                    delete.
 * @return Returns an array of where clauses.
 */
function getWhereClause(schema, query) {
    const columnMap = {};
    schema.columns.forEach((colDef) => {
        columnMap[colDef.name] = colDef;
    });
    const whereClauses = new Array();
    const { primaryKey, options } = query;
    Object.keys(primaryKey).forEach((keyName) => {
        const details = primaryKey[keyName];
        const { value } = details;
        const column = columnMap[keyName];
        const { needsQuotes, type } = column;
        let keyValue;
        if (type === 'blob' && options.encoding !== 'hex') {
            if (options.encoding === 'base64') {
                const utf8Data = Buffer.from(value, 'base64').toString('utf-8');
                const escapedValue = statement_utils_1.escapeValueString(utf8Data);
                keyValue = `textAsBlob('${escapedValue}')`;
            }
            else {
                const escapedValue = statement_utils_1.escapeValueString(value);
                keyValue = `textAsBlob('${escapedValue}')`;
            }
        }
        else if (needsQuotes) {
            keyValue = `'${value}'`;
        }
        else {
            keyValue = value;
        }
        whereClauses.push(`"${keyName}"=${keyValue}`);
    });
    return whereClauses;
}
exports.getWhereClause = getWhereClause;
/**
 * Checks the column flags for a v3 schema as stored in the "flags" column
 * of the "system_schema.tables" table.
 */
function isThriftV3(columnFlags) {
    const flags = new Set(columnFlags);
    return flags.has('super') || flags.has('dense') || !flags.has('compound');
}
exports.isThriftV3 = isThriftV3;
function isThriftV2(isDense, comparator) {
    const isComposite = comparator.indexOf('org.apache.cassandra.db.marshal.CompositeType') !== -1;
    return isDense || !isComposite;
}
exports.isThriftV2 = isThriftV2;
function getBlobColumnNames(schema, primaryKeyOnly) {
    const { columns, primaryKey } = schema;
    const includeColumns = primaryKeyOnly ? primaryKey : columns;
    return includeColumns.reduce((set, curr) => {
        const { type, name } = curr;
        if (type.includes('blob')) {
            set.add(name);
        }
        return set;
    }, new Set());
}
exports.getBlobColumnNames = getBlobColumnNames;
//# sourceMappingURL=schema-utils.js.map