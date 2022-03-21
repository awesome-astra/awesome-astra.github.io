"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.latest = exports.v3x = exports.v2x = void 0;
const compaction_1 = require("@/services/datastores/cassandra/lib/modules/schema-builder/compaction");
const CompressionOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/CompressionOptions"));
const Create_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/Create"));
const Version_1 = require("@/services/datastores/cassandra/lib/modules/schema-builder/Version");
const lodash_1 = require("lodash");
/**
 * Returns a SchemaBuilder class that is suitable for the given version.
 * @param   version         The C* version to target.
 * @return  Returns a bound SchemaBuilder for the target version.
 */
function getSchemaBuilderClass(version) {
    return class SchemaBuilder {
        static get KEY_CACHING_STRATEGY() {
            return {
                NONE: 'NONE',
                ALL: 'ALL',
            };
        }
        static get ROW_CACHING_STRATEGY() {
            return {
                NONE: 'NONE',
                ALL: 'ALL',
            };
        }
        /**
         * Returns a new Create Table Statement. Callers can use the fluent interface, similar to the Java driver,
         * for setting all the available options.
         * @param keyspaceName
         * @param tableName
         */
        static createTable(keyspaceName, tableName) {
            return new Create_1.default(keyspaceName, tableName, version);
        }
        /**
         * Returns a new Create Table Statement that has all the properties populated.
         * This is an alternative to the standard Fluent interface.
         * @param   createOptions   All create options.
         * @returns
         * @see {@link Version}
         */
        static createTableWithOptions(createOptions) {
            const createOptionsClone = JSON.parse(JSON.stringify(createOptions));
            const { keyspace, table, partitionColumns = [], clusteringColumns = [], staticColumns = [], options = {}, } = createOptionsClone;
            const createTableStmt = SchemaBuilder.createTable(keyspace, table);
            // setup to add options
            const createWithOptions = createTableStmt.withOptions();
            partitionColumns.forEach((key) => createTableStmt.addPartitionColumn(key.name, key.type));
            clusteringColumns.forEach((col) => {
                createTableStmt.addClusteringColumn(col.name, col.type);
                if (col.sort) {
                    createWithOptions.clusteringOrder(col.name, col.sort);
                }
            });
            staticColumns.forEach((col) => createTableStmt.addStaticColumn(col.name, col.type));
            // add remaining options
            Object.keys(options).forEach((optionName) => {
                const { class: className, options: strategyOptions } = options[optionName];
                switch (optionName) {
                    case 'compaction': {
                        if (className) {
                            const strategy = SchemaBuilder.compactionStrategyByName(className);
                            SchemaBuilder._setStrategyOptions(strategy, strategyOptions);
                            createWithOptions.compactionOptions(strategy);
                        }
                        break;
                    }
                    case 'compression':
                        const optionValue = options[optionName];
                        if (optionValue) {
                            const { class: strategyName, ...compressionOptions } = optionValue;
                            createWithOptions.compression(SchemaBuilder.compressionStrategyByName(strategyName, compressionOptions));
                        }
                        break;
                    case 'order':
                        if (options.order) {
                            options.order.forEach((col) => createWithOptions.clusteringOrder(col.name, col.direction));
                        }
                        break;
                    case 'caching': {
                        if (options.caching) {
                            const { keys, rows } = options.caching;
                            if (!keys || !rows) {
                                throw new Error(`Invalid caching value: "${options.caching}"`);
                            }
                            createWithOptions.caching(keys, rows);
                        }
                        break;
                    }
                    default:
                        if (typeof createWithOptions[optionName] === 'function') {
                            const optionValue = options[optionName];
                            createWithOptions[optionName](optionValue);
                        }
                        else {
                            // tslint:disable-next-line
                            console.error(`unknown table option: ${optionName}`);
                        }
                }
            });
            return createWithOptions;
        }
        static _setStrategyOptions(strategy, options) {
            if (options) {
                Object.keys(options).forEach((strategyOption) => {
                    const strategyOptionValue = options[strategyOption];
                    strategy[strategyOption](strategyOptionValue);
                });
            }
        }
        static leveledStrategy() {
            return new compaction_1.LeveledCompactionStrategyOptions();
        }
        static sizeTieredStrategy() {
            return new compaction_1.SizeTieredCompactionStrategyOptions();
        }
        static timeWindowStrategy() {
            return new compaction_1.TimeWindowCompactionStrategyOptions();
        }
        static compactionStrategyByName(name) {
            switch (name) {
                case compaction_1.LeveledCompactionStrategyOptions.NAME:
                    return SchemaBuilder.leveledStrategy();
                case compaction_1.SizeTieredCompactionStrategyOptions.NAME:
                    return SchemaBuilder.sizeTieredStrategy();
                case compaction_1.TimeWindowCompactionStrategyOptions.NAME:
                    return SchemaBuilder.timeWindowStrategy();
                default:
                    throw new Error(`Unknown compaction strategy ${name}`);
            }
        }
        static noCompression() {
            return new CompressionOptions_1.default(CompressionOptions_1.default.ALGORITHMS.NONE, version);
        }
        static lz4() {
            return new CompressionOptions_1.default(CompressionOptions_1.default.ALGORITHMS.LZ4, version);
        }
        static snappy() {
            return new CompressionOptions_1.default(CompressionOptions_1.default.ALGORITHMS.SNAPPY, version);
        }
        static deflate() {
            return new CompressionOptions_1.default(CompressionOptions_1.default.ALGORITHMS.DEFLATE, version);
        }
        static compressionStrategyByName(name, options) {
            let compressionStrategy;
            switch (name) {
                case CompressionOptions_1.default.ALGORITHMS.NONE:
                    compressionStrategy = SchemaBuilder.noCompression();
                    break;
                case CompressionOptions_1.default.ALGORITHMS.LZ4:
                    compressionStrategy = SchemaBuilder.lz4();
                    break;
                case CompressionOptions_1.default.ALGORITHMS.SNAPPY:
                    compressionStrategy = SchemaBuilder.snappy();
                    break;
                case CompressionOptions_1.default.ALGORITHMS.DEFLATE:
                    compressionStrategy = SchemaBuilder.deflate();
                    break;
                default:
                    throw new Error(`Unknown compression strategy ${name}`);
            }
            if (options) {
                // since properties are passed in using the table property format returned by the driver
                // (e.g. "chunk_length_kb", we try to call the "chunkLengthKb() method on the given
                // CompressionStrategy class).
                Object.keys(options).forEach((optionName) => {
                    const methodName = lodash_1.camelCase(optionName);
                    const optionValue = options[optionName];
                    if (compressionStrategy[methodName]) {
                        compressionStrategy[methodName](optionValue);
                    }
                    else {
                        throw new Error(`"${optionName}" is not a valid option for compression strategy: "${name}"`);
                    }
                });
            }
            return compressionStrategy;
        }
    };
}
exports.v2x = getSchemaBuilderClass(Version_1.Versions.v2x);
exports.v3x = getSchemaBuilderClass(Version_1.Versions.v3x);
exports.latest = exports.v3x;
//# sourceMappingURL=SchemaBuilder.js.map