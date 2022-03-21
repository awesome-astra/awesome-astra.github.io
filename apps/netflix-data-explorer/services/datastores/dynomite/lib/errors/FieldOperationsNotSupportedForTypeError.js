"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldOperationsNotSupportedForTypeError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class FieldOperationsNotSupportedForTypeError extends HttpStatusError_1.default {
    constructor(key, keyType, supportedKeyTypes) {
        super(400, 'Field Operations Not Supported on Key Type', `Field level operations are not supported for key "${key}" of type "${keyType}".
      Key must be of one of the following types "${JSON.stringify(supportedKeyTypes)}".`, 'Please provide a unique name to create a new key.');
    }
}
exports.FieldOperationsNotSupportedForTypeError = FieldOperationsNotSupportedForTypeError;
//# sourceMappingURL=FieldOperationsNotSupportedForTypeError.js.map