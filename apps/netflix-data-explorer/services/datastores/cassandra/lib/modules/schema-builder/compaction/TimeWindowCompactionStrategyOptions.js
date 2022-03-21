"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeWindowCompactionStrategyOptions = void 0;
const CompactionOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/compaction/CompactionOptions"));
class TimeWindowCompactionStrategyOptions extends CompactionOptions_1.default {
    constructor() {
        super(TimeWindowCompactionStrategyOptions.NAME);
        this.compactionWindowUnitValue = undefined;
        this.compactionWindowSizeValue = undefined;
    }
    static get NAME() {
        return 'TimeWindowCompactionStrategy';
    }
    compactionWindowUnit(unit) {
        this.compactionWindowUnitValue = unit;
        return this;
    }
    compactionWindowSize(size) {
        this.compactionWindowSizeValue = size;
        return this;
    }
    buildSpecificOptions() {
        const options = new Array();
        if (this.compactionWindowUnitValue) {
            options.push(`'compaction_window_unit' : '${this.compactionWindowUnitValue}'`);
        }
        if (this.compactionWindowSizeValue) {
            options.push(`'compaction_window_size' : ${this.compactionWindowSizeValue}`);
        }
        return options;
    }
}
exports.TimeWindowCompactionStrategyOptions = TimeWindowCompactionStrategyOptions;
//# sourceMappingURL=TimeWindowCompactionStrategyOptions.js.map