"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents an abstract Schema statement.
 */
class SchemaStatement {
    get STATEMENT_START() {
        return '\n\t';
    }
    get COLUMN_FORMAT() {
        return '\n\t\t';
    }
    getQueryString() {
        throw new Error('Subclasses must override getQueryString()');
    }
}
exports.default = SchemaStatement;
//# sourceMappingURL=SchemaStatement.js.map