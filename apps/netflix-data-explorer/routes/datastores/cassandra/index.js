"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clusters_1 = __importDefault(require("@/routes/datastores/cassandra/clusters"));
const features_1 = __importDefault(require("@/routes/datastores/cassandra/features"));
const express_1 = require("express");
const router = express_1.Router();
router.use('/clusters', clusters_1.default);
router.use('/features', features_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map