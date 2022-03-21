"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class ClusterAclsNotLoadedError extends HttpStatusError_1.default {
    constructor(clusterName) {
        super(403, `Access control information was not loaded for cluster ${clusterName}`, `Access control information was not loaded for cluster ${clusterName}`, `Cluster access control information is not available for cluster ${clusterName}. If this is a newly created
            cluster, you may need to wait for the ACL information to propagate.`);
    }
}
exports.default = ClusterAclsNotLoadedError;
//# sourceMappingURL=ClusterAclsNotLoadedError.js.map