"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const services_1 = require("@/config/services");
const keyspaces_1 = __importDefault(require("@/routes/datastores/cassandra/clusters/keyspaces"));
const metrics_1 = __importDefault(require("@/routes/datastores/cassandra/clusters/metrics"));
const query_1 = __importDefault(require("@/routes/datastores/cassandra/clusters/query"));
const ClusterNotFoundError_1 = __importDefault(require("@/services/datastores/base/errors/ClusterNotFoundError"));
const cassandra_1 = __importDefault(require("@/services/datastores/cassandra"));
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const app_utils_1 = require("@/utils/app-utils");
const class_loader_utils_1 = require("@/utils/class-loader-utils");
const express_1 = require("express");
const logger = logger_1.default(module);
const router = express_1.Router();
const { CASSANDRA_CLIENT_OPTIONS_PROVIDER } = configuration_1.getConfig();
let cassandraDatastoreService;
async function getCassandraDatastoreService() {
    if (!cassandraDatastoreService) {
        const providerName = CASSANDRA_CLIENT_OPTIONS_PROVIDER;
        logger.info(`setting up Cassandra datastore service using provider: ${providerName}`);
        const ProviderClass = await class_loader_utils_1.loadClass(`@/services/datastores/cassandra/lib/providers/client/${providerName}`);
        const provider = new ProviderClass();
        cassandraDatastoreService = new cassandra_1.default(provider);
    }
    return cassandraDatastoreService;
}
/**
 * Handles /:cluster parameters in the request. Responsible for fetching an existing connection or establishing a
 * new connection to the given cluster.
 */
router.param('cluster', async (req, res, next, clusterName) => {
    if (!clusterName) {
        return res
            .status(400)
            .json({ message: 'clusterName must be provided in path param.' });
    }
    const datastoreType = enums_1.DatastoreType.CASSANDRA;
    try {
        const region = app_utils_1.getRegion(req.app);
        const env = app_utils_1.getEnv(req.app);
        const cluster = app_utils_1.getCluster(req.app, datastoreType, clusterName);
        if (!cluster) {
            throw new ClusterNotFoundError_1.default(clusterName, region, env);
        }
        req.datastoreType = datastoreType;
        req.cluster = cluster;
        acl_utils_1.verifyUserCanAccessCluster(req.user, req.cluster);
        const explorerCache = services_1.getExplorerCache();
        req.cassandraApi = (await explorerCache.getExplorer(datastoreType, clusterName, region, env, async (clusterDef) => {
            const clusterDescription = `${clusterName}.${region}.${env}`;
            const service = await getCassandraDatastoreService();
            const params = {
                clusterDescription,
                clusterName,
                env,
                instances: clusterDef.instances,
                region,
            };
            return service.connect(params);
        }));
        return next();
    }
    catch (err) {
        return next(err);
    }
});
router.get('/:cluster/info', async (req, res, next) => {
    try {
        const info = await req.cassandraApi.getClusterInfo();
        res.json(info);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:cluster/datacenters', async (req, res, next) => {
    try {
        const datacenters = await req.cassandraApi.getDatacenters();
        res.json(datacenters);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:cluster/schema', async (req, res, next) => {
    try {
        const schema = await req.cassandraApi.getClusterSchema();
        if (app_utils_1.isClusterShared(req.cluster.name)) {
            const keyspaceNames = schema.map((schemaRow) => schemaRow.keyspace);
            const userKeyspaceSet = await acl_utils_1.filterAccessibleEntities(req.user, req.cluster, enums_1.EntityType.KEYSPACE, keyspaceNames);
            const userSchemas = schema.filter((schemaRow) => userKeyspaceSet.has(schemaRow.keyspace));
            res.json(userSchemas);
        }
        else {
            res.json(schema);
        }
    }
    catch (err) {
        next(err);
    }
});
router.use('/:cluster/keyspaces', keyspaces_1.default);
router.use('/:cluster/metrics', metrics_1.default);
router.use('/:cluster/query', query_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map