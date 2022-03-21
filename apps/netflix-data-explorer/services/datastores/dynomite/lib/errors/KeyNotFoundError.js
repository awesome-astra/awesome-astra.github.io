"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyNotFoundError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class KeyNotFoundError extends HttpStatusError_1.default {
    constructor(key) {
        super(404, 'Key Not Found', `Could not find key: "${key}".`, 'Please verify the key name. The key may have been deleted.');
    }
}
exports.KeyNotFoundError = KeyNotFoundError;
//# sourceMappingURL=KeyNotFoundError.js.map