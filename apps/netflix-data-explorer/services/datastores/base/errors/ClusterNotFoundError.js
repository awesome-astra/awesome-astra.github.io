"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class ClusterNotFoundError extends HttpStatusError_1.default {
    constructor(clusterName, region, env) {
        super(404, 'Cluster Not Found', `Could not find cluster: ${clusterName}.${region}.${env}`, `Cluster ${clusterName} (in region ${region} and env ${env}) could not be found in the list
      of discovered clusters.
      Please make sure you have selected the correct region for your cluster. Additionally,
      if the cluster was recently added, you may have to wait until the
      connection list is refreshed.`);
    }
}
exports.default = ClusterNotFoundError;
//# sourceMappingURL=ClusterNotFoundError.js.map