"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClusterAccessControlProvider_1 = __importDefault(require("./ClusterAccessControlProvider"));
class DefaultClusterAccessControlProvider extends ClusterAccessControlProvider_1.default {
    async getClusterAccessControl(_options) {
        return {};
    }
}
exports.default = DefaultClusterAccessControlProvider;
//# sourceMappingURL=DefaultClusterAccessControlProvider.js.map