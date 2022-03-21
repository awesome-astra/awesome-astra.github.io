"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("./HttpStatusError"));
class FileUploadError extends HttpStatusError_1.default {
    constructor(e) {
        const title = 'Failed to upload file';
        let status;
        let message;
        let remediation;
        switch (e.code) {
            case 'LIMIT_FILE_SIZE':
                status = 400;
                message = 'File upload too large';
                remediation = i18n_1.t('errors.fileUploadError.tooLargeRemediation');
                break;
            default:
                status = 500;
                message = title;
                remediation = i18n_1.t('errors.fileUploadError.defaultRemediation');
        }
        super(status, title, message, remediation);
    }
}
exports.default = FileUploadError;
//# sourceMappingURL=FileUploadError.js.map