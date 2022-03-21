"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyExistsError = void 0;
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class KeyExistsError extends HttpStatusError_1.default {
    constructor(key) {
        super(409, 'Key Already Exists', `Key already exists with name: "${key}".`, 'Please provide a unique name to create a new key.');
    }
}
exports.KeyExistsError = KeyExistsError;
//# sourceMappingURL=KeyExistsError.js.map