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
const constants_1 = require("@/config/constants");
const logger_1 = __importDefault(require("@/config/logger"));
const services_1 = require("@/config/services");
const store_1 = require("@/model/store");
const enums_1 = require("@/typings/enums");
const appUtils = __importStar(require("@/utils/app-utils"));
const express_1 = require("express");
const logger = logger_1.default(module);
const router = express_1.Router();
/**
 * Get application status information at runtime.
 */
router.get('/status', async (req, res) => {
    const app = req.app;
    const cache = services_1.getEntityAccessControlCache();
    if (req.query.refresh === 'true') {
        await cache.refresh();
    }
    const { accessControl, discovery } = store_1.getStore();
    const { status: aclStatus, clusterAclMap } = accessControl;
    const { status: discoveryStatus } = discovery;
    const availableClustersWithConnections = buildClustersWithConnectionInfo();
    logger.info('querying admin status', req);
    res.json({
        currentRegion: appUtils.getRegion(app),
        currentEnv: appUtils.getEnv(app),
        state: {
            discovery: discoveryStatus,
            acl: aclStatus,
        },
        acl: clusterAclMap,
        available: {
            environments: app.get(constants_1.APP_AVAIL_ENVIRONMENTS),
            regions: app.get(constants_1.APP_AVAIL_REGIONS),
            clusters: availableClustersWithConnections,
        },
        cache: cache.values(),
        userCache: services_1.getUserGroupCache().values(),
    });
});
function buildClustersWithConnectionInfo() {
    const availableClustersWithConnections = {};
    const { discovery } = store_1.getStore();
    const availableClusters = discovery.clusters;
    if (availableClusters) {
        const datastoreTypes = Object.keys(availableClusters);
        datastoreTypes.forEach((type) => {
            availableClustersWithConnections[type] = availableClusters[type].map(mapCluster);
        });
    }
    return availableClustersWithConnections;
}
function mapCluster(cluster) {
    const datastoreType = enums_1.DatastoreType[cluster.datastoreType.toUpperCase()];
    const explorerCache = services_1.getExplorerCache();
    const explorer = explorerCache.peekExplorer(datastoreType, cluster.name, cluster.region, cluster.env);
    return {
        ...cluster,
        hasConnection: !!explorer,
    };
}
exports.default = router;
//# sourceMappingURL=index.js.map