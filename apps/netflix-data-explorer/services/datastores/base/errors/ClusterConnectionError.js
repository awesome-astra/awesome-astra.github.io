"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class ClusterConnectionError extends HttpStatusError_1.default {
    constructor(clusterName, currentAppName) {
        super(503, 'Unable to Connect to Cluster', `Could not connect to cluster: ${clusterName}`, `Unable to connect to ${clusterName}. Please ensure all server groups for cluster
            ${clusterName} permits security group access for this application ("${currentAppName}").`);
    }
}
exports.default = ClusterConnectionError;
//# sourceMappingURL=ClusterConnectionError.js.map