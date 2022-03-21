"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionRowValueAsString = exports.isCollectionType = exports.collectionTypes = void 0;
const collectionMap = {
    list: {
        re: /^list<(.*)>$/,
        startWith: '[',
        endWith: ']',
        format: (quoteKey, key) => (quoteKey ? `'${key}'` : key),
    },
    map: {
        re: /^map<(.*),\s*(.*)>$/,
        startWith: '{',
        endWith: '}',
        format: (quoteKey, key, quoteValue, value) => `${quoteKey ? `'${key}'` : key}: ${quoteValue ? `'${value}'` : value}`,
    },
    set: {
        re: /^set<(.*)>$/,
        startWith: '{',
        endWith: '}',
        format: (quoteKey, key) => (quoteKey ? `'${key}'` : key),
    },
};
exports.collectionTypes = new Set(Object.keys(collectionMap));
/**
 * Tests a column type to see if it is a collection type.
 * @param columnType The type of this column (e.g. 'bigint', 'map<int, varchar>').
 */
function isCollectionType(columnType) {
    return Object.values(collectionMap).some(({ re }) => re.test(columnType));
}
exports.isCollectionType = isCollectionType;
/**
 * Helper method for returning a string representation of a collection.
 * @param columnType The C* data type (e.g. 'list<varchar>', 'map<int, varchar>', etc.).
 * @param rowValue The value returned by the driver for the column.
 */
function getCollectionRowValueAsString(columnType, rowValue) {
    if (!rowValue) {
        return '';
    }
    const needsQuotes = ['ascii', 'text', 'varchar'];
    for (const [collectionType, config] of Object.entries(collectionMap)) {
        if (columnType.includes(collectionType)) {
            const { re, format, startWith, endWith } = config;
            const matches = re.exec(columnType);
            if (matches) {
                const [, keyType, valueType] = matches;
                needsQuotes.includes(keyType);
                const quoteKey = needsQuotes.includes(keyType);
                let content;
                if (valueType) {
                    const quoteValue = !!valueType && needsQuotes.includes(valueType);
                    content = Object.entries(rowValue)
                        .map(([key, value]) => format(quoteKey, key, quoteValue, value))
                        .join(', ');
                }
                else {
                    content = rowValue
                        .map((value) => format(quoteKey, value))
                        .join(', ');
                }
                return `${startWith} ${content} ${endWith}`;
            }
        }
    }
    return rowValue;
}
exports.getCollectionRowValueAsString = getCollectionRowValueAsString;
//# sourceMappingURL=collection-utils.js.map