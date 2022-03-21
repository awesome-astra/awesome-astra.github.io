"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaStatement_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/SchemaStatement"));
/**
 * Encapsulates some of the options used for creating new tables.
 *
 * Constructor expects to be passed the original SQL statement used to create the table (the `parentStatement`).
 * When ready to generate the query, the user is expected to call `getQueryString()` of the table options.
 */
class TableOptions extends SchemaStatement_1.default {
    constructor(parentStatement, version) {
        super();
        this.parentStatement = parentStatement;
        this.version = version;
        this.bloomFilterFPChance = undefined;
        this.cacheStrategy = undefined;
        this.commentOption = undefined;
        this.compressionStrategy = undefined;
        this.gcGraceSecondsValue = undefined;
        this.defaultTtlValue = undefined;
        this.memTableFlushValue = undefined;
        this.readRepairChanceValue = undefined;
        this.speculativeRetryValue = undefined;
    }
    /**
     * Sets the bloom filter positive chance.
     * @param   bloomFilterFalsePositiveChance    The FP value.
     * @return  Returns this instance.
     */
    bloomFilterFalsePositiveChance(bloomFilterFPChance) {
        this.bloomFilterFPChance = bloomFilterFPChance;
        return this;
    }
    /**
     * Sets the value to use for this table's caching strategy.
     * @param  cacheValue      The caching strategy to use.
     * @return Returns this instance.
     */
    useCacheStrategy(cacheStrategy) {
        this.cacheStrategy = cacheStrategy;
        return this;
    }
    /**
     * Sets the comment for this table.
     * @param  comment         The comment string.
     * @return Returns this instance.
     */
    comment(comment) {
        this.commentOption = comment;
        return this;
    }
    compression(compression) {
        this.compressionStrategy = compression.build();
        return this;
    }
    gcGraceSeconds(gcGraceSecondsValue) {
        this.gcGraceSecondsValue = gcGraceSecondsValue;
        return this;
    }
    defaultTtl(defaultTtlValue) {
        this.defaultTtlValue = defaultTtlValue;
        return this;
    }
    memtableFlushPeriod(memTableFlushValue) {
        this.memTableFlushValue = memTableFlushValue;
        return this;
    }
    readRepairChance(readRepairChanceValue) {
        this.readRepairChanceValue = readRepairChanceValue;
        return this;
    }
    speculativeRetry(speculativeRetryValue) {
        this.speculativeRetryValue = speculativeRetryValue;
        return this;
    }
    /**
     * Generates the entire query string for the original statement plus any additional table options.
     * @return Returns the query string suitable to passing to the driver for execution.
     */
    getQueryString() {
        let combinedStatement = this.parentStatement.getQueryString();
        const options = this._buildCommonOptions();
        this._addSpecificOptions(options);
        if (options.length > 0) {
            combinedStatement += `${this.STATEMENT_START}WITH `;
            combinedStatement += options.sort().join(`${this.STATEMENT_START}AND `);
        }
        return combinedStatement;
    }
    _buildCommonOptions() {
        const options = [];
        if (this.bloomFilterFPChance !== undefined) {
            options.push(`bloom_filter_fp_chance = ${this.bloomFilterFPChance}`);
        }
        if (this.cacheStrategy !== undefined) {
            options.push(`caching = '${this.cacheStrategy}'`);
        }
        if (this.commentOption !== undefined) {
            options.push(`comment = '${this.commentOption}'`);
        }
        if (this.compressionStrategy !== undefined) {
            options.push(`compression = ${this.compressionStrategy}`);
        }
        if (this.defaultTtlValue !== undefined) {
            options.push(`default_time_to_live = ${this.defaultTtlValue}`);
        }
        if (this.gcGraceSecondsValue !== undefined) {
            options.push(`gc_grace_seconds = ${this.gcGraceSecondsValue}`);
        }
        if (this.memTableFlushValue !== undefined) {
            options.push(`memtable_flush_period_in_ms = ${this.memTableFlushValue}`);
        }
        if (this.readRepairChanceValue !== undefined) {
            options.push(`read_repair_chance = ${this.readRepairChanceValue}`);
        }
        if (this.speculativeRetryValue !== undefined) {
            options.push(`speculative_retry = '${this.speculativeRetryValue}'`);
        }
        return options;
    }
}
exports.default = TableOptions;
//# sourceMappingURL=TableOptions.js.map