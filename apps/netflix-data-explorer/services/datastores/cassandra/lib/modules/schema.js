"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateTable = exports.dropTable = exports.createTableAdvanced = exports.createTable = exports.generateCreateStatement = exports.createKeyspace = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const SchemaBuilder_1 = require("@/services/datastores/cassandra/lib/modules/schema-builder/SchemaBuilder");
const cassandra_driver_1 = require("cassandra-driver");
const errors_1 = require("../errors");
const CassandraKeyspaceAndTableRequired_1 = require("../errors/CassandraKeyspaceAndTableRequired");
const CassandraTableDropError_1 = require("../errors/CassandraTableDropError");
const CassandraTableTruncateError_1 = require("../errors/CassandraTableTruncateError");
const cluster_utils_1 = require("../utils/cluster-utils");
const statement_1 = require("./statement");
const logger = logger_1.default(module);
/**
 * Creates a new Keyspace.
 * @param keyspaceName    Name of the new keyspace.
 * @param datacenters     Map of datacenter names to az count (e.g. { "us-east": 1 }).
 * @returns Returns a Promise that will be resolved with the value of
 *          true if successful. Rejects with error if the request fails.
 */
async function createKeyspace(client, keyspaceName, datacenters) {
    const replicationParams = { class: 'NetworkTopologyStrategy' };
    const datacenterNames = Object.keys(datacenters);
    if (datacenterNames.length === 0) {
        throw new Error(`Unable to create keyspace ${keyspaceName}. At least one datacenter must be specified.`);
    }
    Object.keys(datacenters).forEach((datacenter) => {
        const rackCount = datacenters[datacenter];
        if (rackCount < 1) {
            throw new Error(`Invalid rack value for datacenter: ${datacenter}`);
        }
        replicationParams[datacenter] = rackCount;
    });
    // tslint:disable
    const stmt = `
                CREATE KEYSPACE "${keyspaceName}"
                WITH REPLICATION = ${JSON.stringify(replicationParams).replace(/"/g, "'")}
                AND DURABLE_WRITES = true`;
    // tslint:enable
    logger.debug(`Creating new keyspace using: "${stmt}"`);
    try {
        await client.execute(stmt.trim());
        return true;
    }
    catch (e) {
        if (e.message.toLowerCase().indexOf('cannot add existing keyspace') >= 0) {
            throw new errors_1.CassandraKeyspaceAlreadyExists(keyspaceName);
        }
        throw e;
    }
}
exports.createKeyspace = createKeyspace;
/**
 * Generates a CREATE TABLE statement which can be passed to the driver to execute.
 * @param  tableOptions The table options.
 * @return Returns a Promise that will resolve with the generated CREATE TABLE statement.
 */
async function generateCreateStatement(client, tableOptions) {
    const { keyspace, table } = tableOptions;
    logger.debug(`Generating create statement for new table: ${keyspace}.${table}`);
    await client.connect();
    const SchemaBuilder = cluster_utils_1.isVersion3(client) ? SchemaBuilder_1.v3x : SchemaBuilder_1.v2x;
    const createStatement = SchemaBuilder.createTableWithOptions(tableOptions).getQueryString();
    logger.debug(createStatement);
    return createStatement;
}
exports.generateCreateStatement = generateCreateStatement;
/**
 * Executes a CREATE TABLE statement using the given table options.
 * @param  options The creation options
 * @return Returns a Promise containing the result of the table creation operation.
 */
async function createTable(client, options, clusterAcccess) {
    const { keyspace, table } = options;
    const createStatement = await generateCreateStatement(client, options);
    logger.info(`Creating new table: ${keyspace}.${table}`);
    logger.info(createStatement);
    try {
        return await statement_1.execute(client, createStatement, clusterAcccess, undefined, {
            includeSchema: false,
            enforceQueryRestrictions: false,
        });
    }
    catch (err) {
        throw new errors_1.CassandraTableCreationError(keyspace, table, err.reason || err.message);
    }
}
exports.createTable = createTable;
/**
 * Executes a CREATE TABLE statement using the given table options.
 * @param  options The creation options
 * @return Returns a Promise containing the result of the table creation operation.
 */
async function createTableAdvanced(client, keyspace, table, createStatement, clusterAccess) {
    logger.info('Creating new table with free-form query');
    logger.info(createStatement);
    if (!createStatement.toLowerCase().match(/^\s*create\s*table\s*/)) {
        throw new Error('Invalid create table statement');
    }
    try {
        return await statement_1.execute(client, createStatement, clusterAccess, undefined, {
            includeSchema: false,
            enforceQueryRestrictions: false,
        });
    }
    catch (err) {
        throw new errors_1.CassandraTableCreationError(keyspace, table, err.message);
    }
}
exports.createTableAdvanced = createTableAdvanced;
function validateKeyspaceAndTableName(keyspace, table) {
    if (!keyspace || !table) {
        throw new CassandraKeyspaceAndTableRequired_1.CassandraKeyspaceAndTableRequired();
    }
}
async function dropTable(client, keyspace, table) {
    validateKeyspaceAndTableName(keyspace, table);
    logger.info(`Dropping table "${keyspace}"."${table}"`);
    const stmt = `DROP TABLE "${keyspace}"."${table}"`;
    try {
        return await statement_1.execute(client, stmt, undefined, undefined, {
            enforceQueryRestrictions: false,
        });
    }
    catch (err) {
        throw new CassandraTableDropError_1.CassandraTableDropError(keyspace, table, err.message);
    }
}
exports.dropTable = dropTable;
async function truncateTable(client, keyspace, table) {
    validateKeyspaceAndTableName(keyspace, table);
    logger.info(`Truncating table "${keyspace}"."${table}"`);
    const stmt = `TRUNCATE TABLE "${keyspace}"."${table}"`;
    try {
        return await statement_1.execute(client, stmt, undefined, undefined, {
            enforceQueryRestrictions: false,
            consistency: cassandra_driver_1.types.consistencies.all,
        });
    }
    catch (err) {
        throw new CassandraTableTruncateError_1.CassandraTableTruncateError(keyspace, table, err.message);
    }
}
exports.truncateTable = truncateTable;
//# sourceMappingURL=schema.js.map