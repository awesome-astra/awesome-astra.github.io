"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const express_1 = require("express");
const { CASSANDRA_REQUIRE_METRICS_FOR_DESTRUCTIVE_OPERATIONS, CASSANDRA_METRICS_SUPPORT, CASSANDRA_ALLOW_DROP_TABLE, CASSANDRA_ALLOW_TRUNCATE_TABLE, CASSANDRA_ENVIRONMENTS_ALLOWING_DESTRUCTIVE_OPERATIONS, } = configuration_1.getConfig();
const router = express_1.Router();
router.get('/', (_req, res) => {
    const featureMap = {
        metrics: CASSANDRA_METRICS_SUPPORT,
        metricsRequiredForDestructiveOperations: CASSANDRA_REQUIRE_METRICS_FOR_DESTRUCTIVE_OPERATIONS,
        allowDrop: CASSANDRA_ALLOW_DROP_TABLE,
        allowTruncate: CASSANDRA_ALLOW_TRUNCATE_TABLE,
        envsAllowingDestructiveOperations: CASSANDRA_ENVIRONMENTS_ALLOWING_DESTRUCTIVE_OPERATIONS,
    };
    res.json(featureMap);
});
exports.default = router;
//# sourceMappingURL=index.js.map