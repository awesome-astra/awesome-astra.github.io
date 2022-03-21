"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
const alias_1 = require("./alias");
class Select {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static get Builder() {
        // tslint:disable:max-classes-per-file
        class Builder {
            constructor() {
                this.allColumns = false;
                this.limitValue = undefined;
                this.columnNames = new Array();
                this.keyspace = undefined;
                this.table = undefined;
                this.whereColumns = undefined;
                this.columnsTtlNames = new Array();
                this.columnsWriteTimeNames = new Array();
            }
            from(keyspace, table) {
                this.keyspace = keyspace;
                this.table = table;
                return this;
            }
            all() {
                this.allColumns = true;
                return this;
            }
            /**
             * Columns can be the
             * @param columns The column names or aliases to include in your query.
             */
            columns(columns) {
                this.columnNames = columns;
                return this;
            }
            /**
             * Include the column names to fetch TTL information.
             * @param columns The column names to fetch TTL info.
             */
            columnsTtl(columns) {
                this.columnsTtlNames = columns;
                return this;
            }
            /**
             * Include the column names to fetch write time information.
             * @param columns The column names to fetch write time.
             */
            columnsWriteTime(columns) {
                this.columnsWriteTimeNames = columns;
                return this;
            }
            where(columns) {
                this.whereColumns = columns;
                return this;
            }
            limit(n) {
                if (n !== undefined) {
                    this.limitValue = n;
                }
                return this;
            }
            build() {
                const statementPieces = ['SELECT'];
                // include columns
                if (this.allColumns) {
                    statementPieces.push('*');
                }
                else {
                    statementPieces.push([
                        ...this.columnNames.map((name) => {
                            if (name instanceof alias_1.Alias) {
                                return `"${name.columnName}" as "${name.alias}"`;
                            }
                            else {
                                return `"${name}"`;
                            }
                        }),
                        ...this.columnsTtlNames.map((column) => `TTL("${column}")`),
                        ...this.columnsWriteTimeNames.map((column) => `writetime("${column}")`),
                    ].join(', '));
                }
                // FROM
                statementPieces.push(`FROM "${this.keyspace}"."${this.table}"`);
                // add where clause
                if (this.whereColumns !== undefined && this.whereColumns.length > 0) {
                    if (this.whereColumns.some((column) => !column)) {
                        throw new Error(`All columns in WHERE clause must be valid strings. Received: ${JSON.stringify(this.whereColumns)}`);
                    }
                    statementPieces.push('WHERE', this.whereColumns.map((column) => `"${column}"=?`).join(' AND '));
                }
                // LIMIT
                if (this.limitValue !== undefined) {
                    statementPieces.push(`LIMIT ${this.limitValue}`);
                }
                return statementPieces.join(' ');
            }
        }
        return Builder;
    }
}
exports.Select = Select;
//# sourceMappingURL=select.js.map