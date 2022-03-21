"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypes = void 0;
const cassandra_driver_1 = require("cassandra-driver");
const config = __importStar(require("../cassandra-config"));
const cluster_utils_1 = require("../utils/cluster-utils");
const query_builder_1 = require("./query-builder");
/**
 * For v2 variants, the column types are returned as Java class names, so we need to do some
 * reverse mapping of the exposed built-in types to build a map of `className` -> `builtInType`.
 */
const { dataTypes } = cassandra_driver_1.types;
const singleTypeNames = {
    'org.apache.cassandra.db.marshal.UTF8Type': dataTypes.varchar,
    'org.apache.cassandra.db.marshal.AsciiType': dataTypes.ascii,
    'org.apache.cassandra.db.marshal.UUIDType': dataTypes.uuid,
    'org.apache.cassandra.db.marshal.TimeUUIDType': dataTypes.timeuuid,
    'org.apache.cassandra.db.marshal.Int32Type': dataTypes.int,
    'org.apache.cassandra.db.marshal.BytesType': dataTypes.blob,
    'org.apache.cassandra.db.marshal.FloatType': dataTypes.float,
    'org.apache.cassandra.db.marshal.DoubleType': dataTypes.double,
    'org.apache.cassandra.db.marshal.BooleanType': dataTypes.boolean,
    'org.apache.cassandra.db.marshal.InetAddressType': dataTypes.inet,
    'org.apache.cassandra.db.marshal.SimpleDateType': dataTypes.date,
    'org.apache.cassandra.db.marshal.TimeType': dataTypes.time,
    'org.apache.cassandra.db.marshal.ShortType': dataTypes.smallint,
    'org.apache.cassandra.db.marshal.ByteType': dataTypes.tinyint,
    'org.apache.cassandra.db.marshal.DateType': dataTypes.timestamp,
    'org.apache.cassandra.db.marshal.TimestampType': dataTypes.timestamp,
    'org.apache.cassandra.db.marshal.LongType': dataTypes.bigint,
    'org.apache.cassandra.db.marshal.DecimalType': dataTypes.decimal,
    'org.apache.cassandra.db.marshal.IntegerType': dataTypes.varint,
    'org.apache.cassandra.db.marshal.CounterColumnType': dataTypes.counter,
};
const dataTypeInverseMap = Object.entries(dataTypes).reduce((prev, [name, index]) => prev.set(index, name), new Map());
const v2TypeMap = Object.entries(singleTypeNames).reduce((prev, [className, dataTypeIndex]) => prev.set(className, dataTypeInverseMap.get(dataTypeIndex)), new Map());
async function getTypes(client, keyspaceName) {
    const unsupportedTypes = new Set(config.unsupportedTypes);
    const v3Types = new Set(config.version3Types);
    await client.connect();
    const isV3 = cluster_utils_1.isVersion3(client);
    // filter for included standard types
    const keyspaceTypes = Object.keys(cassandra_driver_1.types.dataTypes).filter((key) => {
        const value = cassandra_driver_1.types.dataTypes[key];
        if (value instanceof Function ||
            (v3Types.has(key) && !isV3) ||
            unsupportedTypes.has(key)) {
            return false;
        }
        return true;
    });
    // fetch UDTs
    const keyspace = isV3 ? 'system_schema' : 'system';
    const table = isV3 ? 'types' : 'schema_usertypes';
    const query = new query_builder_1.Select.Builder()
        .all()
        .from(keyspace, table)
        .where(['keyspace_name'])
        .build();
    const results = await client.execute(query, [keyspaceName], {
        prepare: true,
    });
    return {
        standard: keyspaceTypes.sort(),
        user: results.rows.map((udt) => ({
            name: udt.type_name,
            fields: udt.field_names
                .map((name, index) => {
                let type = udt.field_types[index];
                if (!isV3) {
                    type = v2TypeMap.get(type) || type; // if we don't have a mapped type return the class name
                }
                return { name, type };
            })
                .sort((field) => field.name),
        })),
    };
}
exports.getTypes = getTypes;
//# sourceMappingURL=types.js.map