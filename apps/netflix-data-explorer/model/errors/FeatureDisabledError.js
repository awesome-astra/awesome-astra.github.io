"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class FeatureDisabledError extends HttpStatusError_1.default {
    constructor(feature) {
        super(501, 'Feature Disabled', `The "${feature}" feature is disabled.`, 'The requested feature is not enabled. You may need to update the app configuration or write some custom code to implement this feature. Please check the logs for more details.');
    }
}
exports.default = FeatureDisabledError;
//# sourceMappingURL=FeatureDisabledError.js.map