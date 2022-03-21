"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaBuilder_1 = require("../SchemaBuilder");
describe('schema builder', () => {
    it('should create a basic table statement', () => {
        const table = SchemaBuilder_1.latest.createTable('keyspaceA', 'tableB')
            .addPartitionColumn('account', 'int')
            .addStaticColumn('name', 'varchar');
        expect(table.getQueryString()).toEqual(`
\tCREATE TABLE "keyspaceA"."tableB" (
\t\taccount int,
\t\tname varchar,
\t\tPRIMARY KEY (account)
\t)`);
    });
    it('should generate a create statement with Leveled Compaction', () => {
        const table = SchemaBuilder_1.latest.createTable('keyspaceA', 'tableB')
            .addPartitionColumn('account', 'int')
            .addClusteringColumn('firstName', 'varchar')
            .addClusteringColumn('lastName', 'varchar')
            .addStaticColumn('address', 'varchar')
            .addStaticColumn('state', 'varchar')
            .withOptions()
            .clusteringOrder('firstName', 'DESC')
            .compactionOptions(SchemaBuilder_1.latest.leveledStrategy().ssTableSizeInMB(500))
            .gcGraceSeconds(8000)
            .bloomFilterFalsePositiveChance(0.01)
            .defaultTtl(100);
        expect(table.getQueryString()).toEqual(`
\tCREATE TABLE "keyspaceA"."tableB" (
\t\taccount int,
\t\tfirstName varchar,
\t\tlastName varchar,
\t\taddress varchar,
\t\tstate varchar,
\t\tPRIMARY KEY (account, firstName, lastName)
\t)
\tWITH CLUSTERING ORDER BY (firstName DESC)
\tAND bloom_filter_fp_chance = 0.01
\tAND compaction = { 'class': 'LeveledCompactionStrategy', 'sstable_size_in_mb' : 500 }
\tAND default_time_to_live = 100
\tAND gc_grace_seconds = 8000`);
    });
    it('should generate a create statement with TWCS', () => {
        const table = SchemaBuilder_1.latest.createTable('keyspaceA', 'tableB')
            .addPartitionColumn('account', 'int')
            .addClusteringColumn('firstName', 'varchar')
            .addClusteringColumn('lastName', 'varchar')
            .addStaticColumn('address', 'varchar')
            .addStaticColumn('state', 'varchar')
            .withOptions()
            .caching(SchemaBuilder_1.latest.KEY_CACHING_STRATEGY.ALL, SchemaBuilder_1.latest.ROW_CACHING_STRATEGY.NONE)
            .compactionOptions(SchemaBuilder_1.latest.timeWindowStrategy()
            .compactionWindowUnit('milliseconds')
            .compactionWindowSize(500))
            .clusteringOrder('firstName', 'DESC')
            .compression(SchemaBuilder_1.latest.snappy().chunkLengthKb(256).crcCheckChance(10))
            .gcGraceSeconds(8000)
            .bloomFilterFalsePositiveChance(0.01)
            .defaultTtl(100);
        expect(table.getQueryString()).toEqual(`
\tCREATE TABLE "keyspaceA"."tableB" (
\t\taccount int,
\t\tfirstName varchar,
\t\tlastName varchar,
\t\taddress varchar,
\t\tstate varchar,
\t\tPRIMARY KEY (account, firstName, lastName)
\t)
\tWITH CLUSTERING ORDER BY (firstName DESC)
\tAND bloom_filter_fp_chance = 0.01
\tAND caching = { 'keys' : 'ALL', 'rows_per_partition' : 'NONE' }
\tAND compaction = { 'class': 'TimeWindowCompactionStrategy', 'compaction_window_unit' : 'milliseconds', 'compaction_window_size' : 500 }
\tAND compression = { 'class': 'SnappyCompressor', 'chunk_length_kb' : 256, 'crc_check_chance' : 10 }
\tAND default_time_to_live = 100
\tAND gc_grace_seconds = 8000`);
    });
    it('should generate a v2 create statement without compression', () => {
        const table = SchemaBuilder_1.v2x.createTable('keyspaceA', 'tableC')
            .addPartitionColumn('account', 'int')
            .addClusteringColumn('firstName', 'varchar')
            .addClusteringColumn('lastName', 'varchar')
            .withOptions()
            .compression(SchemaBuilder_1.v2x.noCompression());
        expect(table.getQueryString()).toEqual(`
\tCREATE TABLE "keyspaceA"."tableC" (
\t\taccount int,
\t\tfirstName varchar,
\t\tlastName varchar,
\t\tPRIMARY KEY (account, firstName, lastName)
\t)
\tWITH compression = { 'sstable_compression' : '' }`);
    });
    it('should generate a v3 create statement without compression', () => {
        const table = SchemaBuilder_1.v3x.createTable('keyspaceA', 'tableC')
            .addPartitionColumn('account', 'int')
            .addClusteringColumn('firstName', 'varchar')
            .addClusteringColumn('lastName', 'varchar')
            .withOptions()
            .compression(SchemaBuilder_1.v3x.noCompression());
        expect(table.getQueryString()).toEqual(`
\tCREATE TABLE "keyspaceA"."tableC" (
\t\taccount int,
\t\tfirstName varchar,
\t\tlastName varchar,
\t\tPRIMARY KEY (account, firstName, lastName)
\t)
\tWITH compression = { 'enabled': false }`);
    });
});
//# sourceMappingURL=SchemaBuilder.spec.js.map