"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyTooLargeError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class KeyTooLargeError extends HttpStatusError_1.default {
    constructor(key, keyCharacters) {
        super(413, 'Key Too Large', `Key value is too large (${keyCharacters} characters) to be returned: ${key}.`, 'Please use another means to load this key.');
    }
}
exports.KeyTooLargeError = KeyTooLargeError;
//# sourceMappingURL=KeyTooLargeError.js.map