"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusError_1 = __importDefault(require("./HttpStatusError"));
class DatastoreNotAvailableError extends HttpStatusError_1.default {
    constructor(datastoreType) {
        super(400, 'Datastore not available', `Datastore type "${datastoreType}" is not available.`, 'There are no clusters available for the requested datastore. Please check the list of available datastores by visiting the home page.');
    }
}
exports.default = DatastoreNotAvailableError;
//# sourceMappingURL=DatastoreNotAvailableError.js.map