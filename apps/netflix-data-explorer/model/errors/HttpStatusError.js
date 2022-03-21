"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpStatusError extends Error {
    /**
     *
     * @param status The HTTP status code.
     * @param title Message title.
     * @param message Error message.
     * @param remediation Remediation details. NOTE: will be rendered unescaped to users. If passing user-provided strings, make sure to escape them.
     */
    constructor(status, title, message, remediation) {
        super(message);
        this.status = status;
        this.title = title;
        this.remediation = remediation;
        this.title = title;
        this.status = status;
        this.remediation = remediation;
    }
    getStatus() {
        return this.status;
    }
}
exports.default = HttpStatusError;
//# sourceMappingURL=HttpStatusError.js.map