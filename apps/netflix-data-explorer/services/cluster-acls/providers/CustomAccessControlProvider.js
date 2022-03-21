"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClusterAccessControlProvider_1 = __importDefault(require("./ClusterAccessControlProvider"));
class CustomAccessControlProvider extends ClusterAccessControlProvider_1.default {
    getClusterAccessControl(_options) {
        throw new Error('Method not implemented.');
    }
}
exports.default = CustomAccessControlProvider;
//# sourceMappingURL=CustomAccessControlProvider.js.map