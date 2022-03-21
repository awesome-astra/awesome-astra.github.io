"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapResultRow = void 0;
const schema_utils_1 = require("./schema-utils");
/**
 * Maps
 * @param row The result row returned by the driver.
 * @param columnNames The column names to include in the results.
 * @param schema The table schema.
 * @param options The retrieval options.
 */
function mapResultRow(row, columnNames, schema, options) {
    const { encoding, decodeValues } = options;
    const blobColumns = schema_utils_1.getBlobColumnNames(schema, false);
    const blobPKs = schema_utils_1.getBlobColumnNames(schema, true);
    return columnNames.reduce((prev, columnName) => {
        let rowValue = row.get(columnName);
        if (blobColumns.has(columnName)) {
            if (!encoding || (!blobPKs.has(columnName) && !decodeValues)) {
                return prev;
            }
            if (rowValue) {
                const stringBuffer = rowValue.toString(encoding);
                rowValue = encoding === 'hex' ? `0x${stringBuffer}` : stringBuffer;
            }
            else {
                rowValue = '';
            }
        }
        prev[columnName] = rowValue;
        return prev;
    }, {});
}
exports.mapResultRow = mapResultRow;
//# sourceMappingURL=row-utils.js.map