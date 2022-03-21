"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class AdminCredentialsRequiredError extends HttpStatusError_1.default {
    constructor() {
        super(401, 'Administrator Credentials Required', 'Administrator credentials are required for this operation.');
    }
}
exports.default = AdminCredentialsRequiredError;
//# sourceMappingURL=AdminCredentialsRequiredError.js.map