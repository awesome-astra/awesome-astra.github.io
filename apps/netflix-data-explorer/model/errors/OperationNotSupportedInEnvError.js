"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const HttpStatusError_1 = __importDefault(require("./HttpStatusError"));
class OperationNotSupportedInEnvError extends HttpStatusError_1.default {
    constructor(operation, env) {
        super(400, 'Operation Not Supported in this Environment', `"${operation}" is not supported in environment ${env} `, i18n_1.t('errors.operationNotSupportedInEnvError.remediation', {
            env: escape(env),
        }));
    }
}
exports.default = OperationNotSupportedInEnvError;
//# sourceMappingURL=OperationNotSupportedInEnvError.js.map