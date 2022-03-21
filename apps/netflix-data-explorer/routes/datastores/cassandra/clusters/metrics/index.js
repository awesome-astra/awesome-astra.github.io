"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const FeatureDisabledError_1 = __importDefault(require("@/model/errors/FeatureDisabledError"));
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const express_1 = require("express");
const { CASSANDRA_METRICS_PROVIDER, CASSANDRA_METRICS_SUPPORT } = configuration_1.getConfig();
const router = express_1.Router();
async function getCassandraMetricsProvider() {
    const providerName = CASSANDRA_METRICS_PROVIDER;
    if (!providerName) {
        return undefined;
    }
    const ProviderClass = await class_loader_utils_1.loadClass(`@/services/datastores/cassandra/lib/providers/metrics/${providerName}`);
    const provider = new ProviderClass();
    return provider;
}
router.use((_req, _res, next) => {
    if (CASSANDRA_METRICS_SUPPORT === false) {
        throw new FeatureDisabledError_1.default('metrics');
    }
    next();
});
router.get('/keyspaces', async (req, res, next) => {
    try {
        const metricsProvider = await getCassandraMetricsProvider();
        let result = new Array();
        if (metricsProvider) {
            result = await metricsProvider.getClusterKeyspacesMetrics(req.cluster);
        }
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/keyspaces/:keyspace/tables', async (req, res, next) => {
    try {
        const range = (req.query.range || 'week');
        const step = (req.query.step || 'day');
        const metricsProvider = await getCassandraMetricsProvider();
        let result = new Array();
        if (metricsProvider) {
            result = await metricsProvider.getKeyspaceTablesMetrics(req.cluster, req.params.keyspace, range, step);
        }
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/keyspaces/:keyspace/tables/:table', async (req, res, next) => {
    try {
        const range = (req.query.range || 'week');
        const step = (req.query.step || 'day');
        const metricsProvider = await getCassandraMetricsProvider();
        let result = undefined;
        if (metricsProvider) {
            result = await metricsProvider.getTableMetrics(req.cluster, req.params.keyspace, req.params.table, range, step);
        }
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map