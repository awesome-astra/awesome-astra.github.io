"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeveledCompactionStrategyOptions = void 0;
const CompactionOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/compaction/CompactionOptions"));
class LeveledCompactionStrategyOptions extends CompactionOptions_1.default {
    constructor() {
        super(LeveledCompactionStrategyOptions.NAME);
        this.ssTableSizeInMBValue = undefined;
    }
    static get NAME() {
        return 'LeveledCompactionStrategy';
    }
    ssTableSizeInMB(size) {
        this.ssTableSizeInMBValue = size;
        return this;
    }
    buildSpecificOptions() {
        const options = new Array();
        if (this.ssTableSizeInMBValue) {
            options.push(`'sstable_size_in_mb' : ${this.ssTableSizeInMBValue}`);
        }
        return options;
    }
}
exports.LeveledCompactionStrategyOptions = LeveledCompactionStrategyOptions;
//# sourceMappingURL=LeveledCompactionStrategyOptions.js.map