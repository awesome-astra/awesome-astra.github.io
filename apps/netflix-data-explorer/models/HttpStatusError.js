"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusError = void 0;
class HttpStatusError extends Error {
    constructor(status, title, message, remediation) {
        super(message);
        this.status = status;
        this.title = title;
        this.remediation = remediation;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpStatusError);
        }
        Object.setPrototypeOf(this, HttpStatusError.prototype);
    }
}
exports.HttpStatusError = HttpStatusError;
//# sourceMappingURL=HttpStatusError.js.map