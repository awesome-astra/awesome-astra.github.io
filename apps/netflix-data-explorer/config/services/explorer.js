"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupExplorerCache = void 0;
const ExplorerCache_1 = __importDefault(require("@/services/explorer/ExplorerCache"));
async function setupExplorerCache() {
    const explorerCache = new ExplorerCache_1.default();
    return explorerCache;
}
exports.setupExplorerCache = setupExplorerCache;
//# sourceMappingURL=explorer.js.map