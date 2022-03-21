"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class FeatureNotImplementedError extends HttpStatusError_1.default {
    constructor(featureName) {
        super(501, 'Feature Not Implemented', `The "${featureName}" feature is not implemented.`, 'The requested feature is not implemented. You may need to update the app configuration or write some custom code to implement this feature. Please check the logs for more details.');
    }
}
exports.default = FeatureNotImplementedError;
//# sourceMappingURL=FeatureNotImplementedError.js.map