"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TableOptions_1 = __importDefault(require("@/services/datastores/cassandra/lib/modules/schema-builder/TableOptions"));
/**
 * @private
 */
class CreateTableOptions extends TableOptions_1.default {
    constructor(parentStatement, version) {
        super(parentStatement, version);
        this.keyCaching = undefined;
        this.rowCaching = undefined;
        this.compactionStrategy = undefined;
        this.compactStorageValue = false;
        this.clusterOrder = [];
    }
    caching(keyCaching, rowCaching) {
        this.keyCaching = keyCaching;
        this.rowCaching = rowCaching;
        return this;
    }
    /**
     * Specifies the clustering order for a column. Requires that the column be declared first.
     * @param   columnName      The name of the existing clustering column.
     * @param   direction       The direction to sort ('asc' or 'desc').
     * @return  The current CreateTableOptions instance.
     */
    clusteringOrder(columnName, direction) {
        if (!this.parentStatement.clusteringColumns.find((col) => col.name === columnName)) {
            throw new Error(`Clustering column ${columnName} is unknown. Did you forget to declare it first?`);
        }
        this.clusterOrder.push({
            name: columnName,
            direction,
        });
        return this;
    }
    compactionOptions(strategy) {
        this.compactionStrategy = strategy.build();
        return this;
    }
    /**
     * Enables compact storage on this table.
     */
    compactStorage() {
        this.compactStorageValue = true;
        return this;
    }
    _addSpecificOptions(options) {
        if (this.clusterOrder.length > 0) {
            const clusterOrderPart = this.clusterOrder
                .map((col) => `${col.name} ${col.direction}`)
                .join(', ');
            options.push(`CLUSTERING ORDER BY (${clusterOrderPart})`);
        }
        if (this.compactStorageValue) {
            options.push('COMPACT STORAGE');
        }
        if (this.compactionStrategy) {
            options.push(`compaction = ${this.compactionStrategy}`);
        }
        if (this.keyCaching && this.rowCaching) {
            options.push(`caching = { 'keys' : '${this.keyCaching}', 'rows_per_partition' : '${this.rowCaching}' }`);
        }
        return options;
    }
}
exports.default = CreateTableOptions;
//# sourceMappingURL=CreateTableOptions.js.map