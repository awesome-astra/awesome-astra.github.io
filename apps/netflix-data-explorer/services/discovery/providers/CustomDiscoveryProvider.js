"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscoveryProvider_1 = __importDefault(require("./BaseDiscoveryProvider"));
class CustomDiscoveryProvider extends BaseDiscoveryProvider_1.default {
    start() {
        // e.g. make a REST call to another service then call
        //
        // ```
        // try {
        //   this.clusters = [/* my clusters */];
        //   this.environments = [/* my environments */];
        //   this.regions = [/* my regions */];
        // } catch (err) {
        //   this.error = err;
        // }
        // ```
        throw new Error('CustomDiscoveryProvider must implement start()');
    }
}
exports.default = CustomDiscoveryProvider;
//# sourceMappingURL=CustomDiscoveryProvider.js.map