"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class ClusterMissingAclsError extends HttpStatusError_1.default {
    constructor(clusterName) {
        super(403, `Access control information not available for cluster ${clusterName}`, `Access control information not available for cluster ${clusterName}`, `Cluster access control information is not defined for cluster ${clusterName}. Please ensure this cluster
            has a designated owner.`);
    }
}
exports.default = ClusterMissingAclsError;
//# sourceMappingURL=ClusterMissingAclsError.js.map