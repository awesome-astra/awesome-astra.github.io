"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("./HttpStatusError"));
class AuthenticationError extends HttpStatusError_1.default {
    constructor(message, remediation) {
        super(401, 'Failed to authenticate', message, remediation);
    }
}
exports.default = AuthenticationError;
//# sourceMappingURL=AuthenticationError.js.map