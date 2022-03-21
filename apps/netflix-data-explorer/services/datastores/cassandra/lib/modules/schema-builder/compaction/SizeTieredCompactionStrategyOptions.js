"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeTieredCompactionStrategyOptions = void 0;
const CompactionOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/compaction/CompactionOptions"));
class SizeTieredCompactionStrategyOptions extends CompactionOptions_1.default {
    constructor() {
        super(SizeTieredCompactionStrategyOptions.NAME);
        this.minThresholdValue = undefined;
        this.maxThresholdValue = undefined;
        this.minSSTableSizeValue = undefined;
    }
    static get NAME() {
        return 'SizeTieredCompactionStrategy';
    }
    minThreshold(min) {
        this.minThresholdValue = min;
        return this;
    }
    maxThreshold(max) {
        this.maxThresholdValue = max;
        return this;
    }
    minSSTableSize(minSizeInBytes) {
        this.minSSTableSizeValue = minSizeInBytes;
        return this;
    }
    buildSpecificOptions() {
        const options = new Array();
        if (this.minThresholdValue !== undefined) {
            options.push(`'min_threshold' : ${this.minThresholdValue}`);
        }
        if (this.maxThresholdValue !== undefined) {
            options.push(`'max_threshold' : ${this.maxThresholdValue}`);
        }
        if (this.minSSTableSizeValue !== undefined) {
            options.push(`'min_sstable_size' : ${this.minSSTableSizeValue}`);
        }
        return options;
    }
}
exports.SizeTieredCompactionStrategyOptions = SizeTieredCompactionStrategyOptions;
//# sourceMappingURL=SizeTieredCompactionStrategyOptions.js.map