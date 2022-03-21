"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
class NoClustersAvailableError extends HttpStatusError_1.default {
    constructor(datastoreType) {
        super(500, 'No Clusters Available', `No clusters available for datastore ${datastoreType}`, 'There are no clusters available for the selected datastore. The server may still be starting. Please try your request again.');
    }
}
exports.default = NoClustersAvailableError;
//# sourceMappingURL=NoClustersAvailableErrors.js.map