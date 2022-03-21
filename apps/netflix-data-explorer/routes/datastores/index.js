"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const store_1 = require("@/model/store");
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const app_utils_1 = require("@/utils/app-utils");
const request_utils_1 = require("@/utils/request-utils");
const express_1 = require("express");
const lodash_1 = require("lodash");
const { SUPPORTED_DATASTORE_TYPES } = configuration_1.getConfig();
const router = express_1.Router();
const logger = logger_1.default(module);
const supportedDatstores = SUPPORTED_DATASTORE_TYPES;
const supportedDatastoreRegex = supportedDatstores.join('|');
logger.info(`setting up sub-routes for supported datastores: ${JSON.stringify(supportedDatstores)}`);
router.param('datastoreType', (req, res, next) => {
    // store the datastore type on the request (used for logging)
    req.datastoreType =
        enums_1.DatastoreType[req.params.datastoreType.toUpperCase()];
    next();
});
/**
 * Fetches the list of all datastore clusters the current user has access to.
 */
router.get('/', (req, res, next) => {
    try {
        const allDatastoreClusters = lodash_1.flatten(Object.values(store_1.getStore().discovery.clusters || [])).map((clusterDef) => ({
            env: clusterDef.env,
            isShared: app_utils_1.isClusterShared(clusterDef.name),
            name: clusterDef.name,
            region: clusterDef.region,
            type: clusterDef.datastoreType,
        }));
        if (!allDatastoreClusters || allDatastoreClusters.length === 0) {
            return res.status(204).json({ message: 'No clusters available.' });
        }
        const userAccessibleClusters = allDatastoreClusters.filter((cluster) => acl_utils_1.canUserAccessCluster(req.user, cluster));
        return res.json(userAccessibleClusters);
    }
    catch (err) {
        next(err);
    }
});
/**
 * Fetches the list of Datastore clusters in the current region for this application.
 */
router.get(`/:datastoreType(${supportedDatastoreRegex})/clusters`, (req, res, next) => {
    try {
        const clusters = app_utils_1.getAvailableClusters(req.params.datastoreType);
        if (!clusters || clusters.length === 0) {
            return res.status(204).json({ message: 'No clusters available.' });
        }
        const match = request_utils_1.getQueryAsString(req, 'match', '*');
        const accessibleClusters = new Set();
        clusters.forEach((cluster) => {
            const isAccessible = app_utils_1.isRegionAccessible(req.app, cluster.region, cluster.env);
            const nameMatches = match.trim() === '*' ||
                cluster.name
                    .toLowerCase()
                    .indexOf(match.toLowerCase().replace(/\*/g, '')) >= 0;
            if (isAccessible &&
                nameMatches &&
                acl_utils_1.canUserAccessCluster(req.user, cluster)) {
                accessibleClusters.add({
                    name: cluster.name,
                    isShared: app_utils_1.isClusterShared(cluster.name),
                });
            }
        });
        return res.json(Array.from(accessibleClusters));
    }
    catch (err) {
        next(err);
    }
});
/**
 * Intended to be a fast endpoint that simply checks the existence of a cluster and returns a 200 or 404.
 */
router.head(`/:datastoreType(${supportedDatastoreRegex})/clusters/:name`, (req, res, next) => {
    try {
        const clusters = app_utils_1.getAvailableClusters(req.params.datastoreType);
        const clusterExists = clusters.some((cluster) => cluster.name === req.params.name);
        res.status(clusterExists ? 204 : 404).send();
    }
    catch (err) {
        next(err);
    }
});
router.get('/types', (_req, res, _next) => {
    res.json(supportedDatstores);
});
supportedDatstores.forEach(async (datastore) => {
    const datastoreRoute = await Promise.resolve().then(() => __importStar(require(`./${datastore}`)));
    router.use(`/${datastore}`, datastoreRoute.default);
});
exports.default = router;
//# sourceMappingURL=index.js.map