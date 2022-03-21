"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const blob_1 = require("./modules/blob");
const columns_1 = require("./modules/columns");
const keys_1 = require("./modules/keys");
const keyspaces_1 = require("./modules/keyspaces");
const schema_1 = require("./modules/schema");
const statement_1 = require("./modules/statement");
const tables_1 = require("./modules/tables");
const types_1 = require("./modules/types");
const cluster_utils_1 = require("./utils/cluster-utils");
const logger = logger_1.default(module);
class CassandraExplorer {
    /**
     * Create an instance of the CassandraExplorer by wrapping an existing cassandra driver client instance.
     * @param client
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Fetches the list of datacenters (regions) this cluster spans. Each datacenter returned will
     * include the list of racks (AZs).
     * @returns Returns an array of datacenters.
     */
    async getDatacenters() {
        logger.info('fetching cluster regions');
        await this.client.connect();
        const datacenters = this.client.metadata.datacenters;
        return Object.keys(datacenters)
            .sort()
            .map((datacenter) => ({
            name: datacenter,
            racks: datacenters[datacenter].racks.toArray(),
        }));
    }
    /**
     * Creates a new Keyspace.
     * @param keyspaceName    Name of the new keyspace.
     * @param datacenters     Map of datacenter names to az count (e.g. { "us-east": 1 }).
     * @returns Returns a Promise that will be resolved with the value of
     *          true if successful. Rejects with error if the request fails.
     */
    async createKeyspace(keyspaceName, datacenters) {
        return schema_1.createKeyspace(this.client, keyspaceName, datacenters);
    }
    /**
     * Permanently and irreversibly destroys a table schema and all data.
     * @param keyspaceName Keyspace containing the table to drop.
     * @param tableName Name of the table to drop.
     */
    async dropTable(keyspaceName, tableName) {
        return schema_1.dropTable(this.client, keyspaceName, tableName);
    }
    /**
     * Permanently and irreversibly destroys all data in a table.
     * @param keyspaceName Keyspace containing the table to truncate.
     * @param tableName Name of the table to truncate.
     */
    async truncateTable(keyspaceName, tableName) {
        return schema_1.truncateTable(this.client, keyspaceName, tableName);
    }
    /**
     * Generates a CREATE TABLE statement which can be passed to the driver to execute.
     * @param  tableOptions The table options.
     * @return Returns a Promise that will resolve with the generated CREATE TABLE statement.
     */
    async generateCreateStatement(tableOptions) {
        return schema_1.generateCreateStatement(this.client, tableOptions);
    }
    /**
     * Executes a CREATE TABLE statement using the given table options.
     * @param  options The creation options
     * @return Returns a Promise containing the result of the table creation operation.
     */
    async createTable(options, clusterAcccess) {
        return schema_1.createTable(this.client, options, clusterAcccess);
    }
    /**
     * Executes a CREATE TABLE statement using the given table options.
     * @param  options The creation options
     * @return Returns a Promise containing the result of the table creation operation.
     */
    async createTableAdvanced(keyspace, table, createStatement, clusterAcccess) {
        return schema_1.createTableAdvanced(this.client, keyspace, table, createStatement, clusterAcccess);
    }
    async getClusterInfo() {
        return {
            version: cluster_utils_1.getVersion(this.client),
        };
    }
    /**
     * Fetches the complete list of defined keyspaces.
     * @returns Returns a Promise that resolves with the list of keyspaces.
     */
    async getKeyspaces() {
        return keyspaces_1.getKeyspaces(this.client);
    }
    /**
     * Fetches a given keyspace by name.
     * @param keyspaceName    Keyspace name.
     * @returns  Returns a Promise that resolves with the keyspace if found.
     */
    async getKeyspace(keyspaceName) {
        return keyspaces_1.getKeyspace(this.client, keyspaceName);
    }
    /**
     * Fetches the list of tables for the current cluster. Can be optionally scoped by keyspace.
     * @param   keyspace    Optionally can be used to scope the results to a specific keyspace.
     * @returns Returns a promise that resolves with the list of tables.
     */
    async getTables(keyspace) {
        return tables_1.getTables(this.client, keyspace);
    }
    /**
     * A batch style query for fetching the entire schema for the current cluster. This will return a mapping
     * of keyspaces to tables and from tables to columns. Includes column type information.
     *
     * This is a fairly expensive operation and is intended for clients to cache the data and call this API
     * infrequently in order to refresh the cache.
     *
     * @param   keyspace Optional keyspace to filter by.
     * @returns Returns a flat array of column definitions per table, per keyspace.
     */
    async getClusterSchema(keyspace) {
        return columns_1.getClusterSchema(this.client, keyspace);
    }
    /**
     * Fetches the schema definition for a given table.
     * @param   keyspace      The name of the keyspace that contains the table.
     * @param   table         The name of the table.
     * @returns Returns a promise that will be resolved with the table metadata.
     */
    async getTable(keyspace, table) {
        return tables_1.getTable(this.client, keyspace, table);
    }
    /**
     * The data types supported by a C* cluster varies depending on the version and keyspace (since UDTs are scoped
     * by keyspace).
     * @param   keyspaceName    The name of the keyspace.
     * @return  {Promise.<{standard: Array.<*>, user}>}     Returns a Promise that will be resolved with an object
     *                                                      containing the standard and user types.
     */
    async getTypes(keyspaceName) {
        return types_1.getTypes(this.client, keyspaceName);
    }
    /**
     * Executes a freeform query. Expects the query to include the fully qualified table name (i.e. <keyspace>.<table>).
     * @param query                    The query string to submit.
     * @param clusterAccess
     * @param logMetadata              Optional object to include in logger messages.
     * @returns Returns a Promise that will resolve with the statement result.
     */
    async execute(query, clusterAccess, logMetadata, options) {
        return statement_1.execute(this.client, query, clusterAccess, logMetadata, options);
    }
    /**
     * Fetches results by keys.
     * @param   {String}        keyspace    The keyspace name.
     * @param   {String}        table       The table name.
     * @param   {Object}        params      Parameterized object containing the fields to filter by.
     * @param   {String}        pageState   An optional existing cursor.
     * @param   {Object}        logMetadata Optional object to include in logger messages.
     * @returns {Promise.<TResult>|*}
     */
    async getKeys(keyspace, table, params, pageState, logMetadata) {
        return keys_1.getKeys(this.client, keyspace, table, params, pageState, logMetadata);
    }
    generateInsertStatement(schema, fields, encoding) {
        return keys_1.generateInsertStatement(schema, fields, encoding);
    }
    async getBinaryValue(keyspace, table, keyQuery, binaryColumnName) {
        return blob_1.getBinaryValue(this.client, keyspace, table, keyQuery, binaryColumnName);
    }
    /**
     * Updates an existing record.
     *
     * @param   keyspace         The name of the keyspace the table belongs to.
     * @param   table            The name of the table to perform the UPDATE on.
     * @param   key       A map of primary key pairs where the keys are the name of the primary key fields
     *                           and the values are the primary key values. This is used to locate the record to
     *                           update.
     * @param   updateFields     A map of the fields to update. The keys are the names of the columns and the
     *                                    values are the values for each of the columns. Must be non-empty.
     * @param   logMetadata      Additional log metadata to include (optional).
     * @returns Returns true if the record was updated. False indicates ta
     */
    async updateKey(keyspace, table, key, updateFields, logMetadata) {
        return keys_1.updateKey(this.client, keyspace, table, key, updateFields, logMetadata);
    }
    /**
     * Inserts a new record.
     * @param keyspace    The keyspace name.
     * @param table       The table to insert into.
     * @param fields      The map of fields to values.
     * @param logMetadata Additional log metadata to include (optional).
     */
    async insertKey(keyspace, table, row, logMetadata) {
        return keys_1.insertKey(this.client, keyspace, table, row, logMetadata);
    }
    /**
     * Deletes an existing record.
     *
     * @param   keyspace         The name of the keyspace the table belongs to.
     * @param   table            The name of the table to perform the UPDATE on.
     * @param   key              A map of primary key pairs where the keys are the name of the primary key fields
     *                           and the values are the primary key values. This is used to locate the record to
     *                           delete.
     * @param   logMetadata      Additional log metadata to include (optional).
     * @return  Returns true if the record was deleted successfully.
     */
    async deleteKey(keyspace, table, key, logMetadata) {
        return keys_1.deleteKey(this.client, keyspace, table, key, logMetadata);
    }
    shutdown() {
        return this.client.shutdown();
    }
}
exports.default = CassandraExplorer;
//# sourceMappingURL=CassandraExplorer.js.map