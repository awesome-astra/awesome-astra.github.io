"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_utils_1 = require("@/services/datastores/cassandra/lib/utils/export-utils");
const response_utils_1 = require("@/utils/response-utils");
// tslint:disable:max-classes-per-file
/**
 * Provides a way to generate an exported version a C* result set.
 * Supports downloading as a file in serveral formats or generating
 * the CQL INSERT statements for the given result set.
 */
class CassandraResultsExporter {
    constructor(schema, cluster, cassandraApi) {
        this.schema = schema;
        this.cluster = cluster;
        this.cassandraApi = cassandraApi;
        this.columns = [];
        this.rows = [];
        this.keyQuery = undefined;
    }
    build(columns, rows, filter) {
        // only include columns available in the schema (this excludes function output)
        const columnNames = new Set(this.schema.columns.map((col) => col.name));
        this.columns = columns.filter((column) => columnNames.has(column.name));
        this.rows = rows;
        this.keyQuery = filter;
        return new CassandraResultsStream(this);
    }
}
exports.default = CassandraResultsExporter;
class CassandraResultsStream {
    constructor(exporter) {
        this.exporter = exporter;
    }
    /**
     * Send the output of the exporter to the user.
     * @param res The Express Response object.
     * @param format The output format.
     * @param sendAsFile True to send the response as a file download. The file will include the cluster/keyspace/table name.
     */
    send(res, format, sendAsFile) {
        const { cassandraApi, columns, rows, schema, keyQuery } = this.exporter;
        if (!keyQuery) {
            throw new Error('KeyQuery missing from Exporter');
        }
        let records = [];
        let content;
        const { encoding } = keyQuery.options;
        if (format === 'cql') {
            records = export_utils_1.generateCqlStatements(schema, rows, cassandraApi, encoding);
            content = [...records, ''].join(';\n');
        }
        else if (format === 'csv') {
            content = export_utils_1.generateCsv(schema, columns, rows);
        }
        else {
            throw new Error('Unsupported export format');
        }
        if (sendAsFile) {
            const filename = `${this.generateFilename(format)}.${format}`;
            response_utils_1.sendFile(res, 'text/plain', filename, Buffer.from(content, 'utf-8'));
        }
        else {
            res.json({ records });
        }
    }
    generateFilename(format) {
        const { cluster, keyQuery, schema } = this.exporter;
        const { keyspace, name } = schema;
        const pieces = [cluster.name.toUpperCase(), `${keyspace}.${name}`];
        if (keyQuery && Object.keys(keyQuery.primaryKey).length > 0) {
            pieces.push(Object.entries(keyQuery.primaryKey)
                .map(([key, details]) => `${key}.${details.value}`)
                .join('__'));
        }
        if (format === 'cql') {
            pieces.push('insert');
        }
        return pieces.join('____');
    }
}
//# sourceMappingURL=CassandraResultsExporter.js.map