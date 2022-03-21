"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const services_1 = require("@/config/services");
const EntityMissingAclOwners_1 = __importDefault(require("@/model/errors/EntityMissingAclOwners"));
const tables_1 = __importDefault(require("@/routes/datastores/cassandra/clusters/keyspaces/tables"));
const types_1 = __importDefault(require("@/routes/datastores/cassandra/clusters/keyspaces/types"));
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const app_utils_1 = require("@/utils/app-utils");
const cde_utils_1 = require("@/utils/cde-utils");
const express_1 = require("express");
const logger = logger_1.default(module);
const router = express_1.Router();
/**
 * Fetch all keyspaces.
 */
router.get('/', async (req, res, next) => {
    logger.info('fetching all keyspaces', req);
    try {
        const allKeyspaces = await req.cassandraApi.getKeyspaces();
        const clusterAccess = await cde_utils_1.getCassandraAccess(req.user, req.cluster, allKeyspaces);
        if (clusterAccess.isShared) {
            const userKeyspaceNames = clusterAccess.userKeyspaceNames;
            res.json(allKeyspaces.filter((keyspace) => userKeyspaceNames.has(keyspace.name)));
        }
        else {
            res.json(allKeyspaces);
        }
    }
    catch (err) {
        next(err);
    }
});
/**
 * Creates a new keyspace. Expects POST body to include:
 *  {
 *      "name": "keyspace-name",
 *      "datacenters": {
 *          "us-east": 2,
 *          "eu-west": 2
 *      },
 *      "owners": ["jack@netflix.com", "jill@netflix.com"]
 *  }
 */
router.post('/', async (req, res, next) => {
    const { name: keyspaceName, owners = [], datacenters = {} } = req.body;
    logger.info(`creating new keyspace: "${keyspaceName}"`, req);
    const cluster = req.cluster.name;
    const env = app_utils_1.getEnv(req.app);
    const type = enums_1.EntityType.KEYSPACE;
    const isShared = app_utils_1.isClusterShared(cluster);
    if (isShared && owners.length === 0) {
        throw new EntityMissingAclOwners_1.default(cluster, type, keyspaceName);
    }
    let createKeyspaceResult;
    try {
        createKeyspaceResult = await req.cassandraApi.createKeyspace(keyspaceName, datacenters);
    }
    catch (err) {
        return next(err);
    }
    // if the cluster is shared, then update entity ownership information
    if (isShared) {
        try {
            const entityAccessControlService = services_1.getEntityAccessControlService();
            await entityAccessControlService.setEntityOwners(cluster, env, type, keyspaceName, owners);
        }
        catch (err) {
            return next(err);
        }
    }
    // refresh the cache of cluster/entities to ensure the user has access to the newly created keyspace
    services_1.getEntityAccessControlCache().refresh();
    res.json(createKeyspaceResult);
});
router.param('keyspace', async (req, res, next, keyspaceName) => {
    try {
        // attempt to fetch the keyspace (throws if it cannot be found).
        await req.cassandraApi.getKeyspace(keyspaceName);
        await acl_utils_1.verifyUserAccessEntity(req.user, req.cluster, enums_1.EntityType.KEYSPACE, keyspaceName, false);
        req.keyspaceName = keyspaceName;
        next();
    }
    catch (err) {
        next(err);
    }
});
/**
 * Fetches a keyspace by name. Note, keyspaces are case-sensitive.
 */
router.get('/:keyspace', async (req, res, next) => {
    logger.info(`fetching keyspace: "${req.keyspaceName}"`, req);
    try {
        const keyspace = await req.cassandraApi.getKeyspace(req.keyspaceName);
        res.json(keyspace);
    }
    catch (err) {
        next(err);
    }
});
router.use('/:keyspace/tables', tables_1.default);
router.use('/:keyspace/types', types_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map