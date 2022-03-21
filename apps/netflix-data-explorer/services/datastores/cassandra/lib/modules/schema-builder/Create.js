"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateTableOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/CreateTableOptions"));
const SchemaStatement_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/SchemaStatement"));
const Version_1 = require("@/services/datastores/cassandra/lib/modules/schema-builder/Version");
const CassandraTableSchemaValidationError_1 = require("../../errors/CassandraTableSchemaValidationError");
/**
 * Primary class for creating a new Table.
 */
class Create extends SchemaStatement_1.default {
    constructor(keyspaceName, tableName, version) {
        super();
        this.keyspaceName = keyspaceName;
        this.tableName = tableName;
        this.version = version;
        if (!keyspaceName || keyspaceName.length === 0) {
            throw new Error('keyspaceName is required');
        }
        if (!tableName || tableName.length === 0) {
            throw new Error('tableName is required');
        }
        if (!version || !(version instanceof Version_1.Version)) {
            throw new Error('version is required and must be an instance of Version');
        }
        this.partitionColumns = [];
        this.clusteringColumns = [];
        this.staticColumns = [];
    }
    static _validatePrimaryKey(columnName, columnType) {
        if (!columnName || columnName.length === 0) {
            throw new CassandraTableSchemaValidationError_1.CassandraTableSchemaValidationError(columnName, columnType, 'Primary key name must be non-empty string.', 'Column name is required.');
        }
        if (!columnType || columnType.length === 0) {
            throw new CassandraTableSchemaValidationError_1.CassandraTableSchemaValidationError(columnName, columnType, `Primary key component "${columnName}" must specify a valid C* data type.`, `Please check the data type of column ${columnName}`);
        }
        if (columnType.match(/(list|map|set|tuple)<.*>/gi)) {
            throw new CassandraTableSchemaValidationError_1.CassandraTableSchemaValidationError(columnName, columnType, `Invalid collection type for primary key component "${columnName}".`, 'The primary key cannot contain any collection types.');
        }
    }
    addPartitionColumn(columnName, columnType) {
        Create._validatePrimaryKey(columnName, columnType);
        this.partitionColumns.push({
            name: columnName,
            type: columnType,
        });
        return this;
    }
    addClusteringColumn(columnName, columnType) {
        Create._validatePrimaryKey(columnName, columnType);
        this.clusteringColumns.push({
            name: columnName,
            type: columnType,
        });
        return this;
    }
    addStaticColumn(columnName, columnType) {
        this.staticColumns.push({
            name: columnName,
            type: columnType,
        });
        return this;
    }
    withOptions() {
        return new CreateTableOptions_1.default(this, this.version);
    }
    getQueryString() {
        if (this.partitionColumns.length === 0) {
            throw new Error(`There should be at least one partition key defined for the table: ${this.tableName}`);
        }
        let stmt = this.STATEMENT_START;
        stmt += `CREATE TABLE "${this.keyspaceName}"."${this.tableName}"`;
        stmt += ' (';
        stmt += this.COLUMN_FORMAT;
        const allColumns = new Array().concat(this.partitionColumns, this.clusteringColumns, this.staticColumns);
        const partitionKeyNames = this.partitionColumns.map((col) => col.name);
        const clusteringKeyNames = this.clusteringColumns.map((col) => col.name);
        const partitionKeyPart = partitionKeyNames.length === 1
            ? partitionKeyNames[0]
            : `(${partitionKeyNames.join(', ')})`;
        const primaryKeyPart = [partitionKeyPart]
            .concat(clusteringKeyNames)
            .join(', ');
        // add all the column definitions
        stmt += this._buildColumns(allColumns);
        // append the primary key
        stmt += `,${this.COLUMN_FORMAT}`;
        stmt += `PRIMARY KEY (${primaryKeyPart})`;
        stmt += this.STATEMENT_START;
        stmt += ')';
        return stmt;
    }
    _buildColumns(columns) {
        return columns
            .map((entry) => `${entry.name} ${entry.type}`)
            .join(`,${this.COLUMN_FORMAT}`);
    }
}
exports.default = Create;
//# sourceMappingURL=Create.js.map