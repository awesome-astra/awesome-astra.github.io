"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@/config/services");
const fields_1 = __importDefault(require("@/routes/datastores/dynomite/clusters/fields"));
const keys_1 = __importDefault(require("@/routes/datastores/dynomite/clusters/keys"));
const dynomite_1 = __importDefault(require("@/services/datastores/dynomite"));
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const app_utils_1 = require("@/utils/app-utils");
const express_1 = require("express");
const router = express_1.Router();
const dynomiteDatastoreService = new dynomite_1.default();
/**
 * Extracts the cluster name from the path parameter (e.g. .../clusters/<my_cluster>/...).
 * Sets up an instance of the DynomiteExplorer API and attaches it to the request so downstream
 * requests can easily access it via req.dynomiteApi.
 */
router.param('cluster', async (req, res, next, clusterName) => {
    if (!clusterName) {
        return res
            .status(400)
            .json({ message: 'clusterName must be provided in path param.' });
    }
    const datastoreType = enums_1.DatastoreType.DYNOMITE;
    req.datastoreType = datastoreType;
    req.cluster = app_utils_1.getCluster(req.app, req.datastoreType, clusterName);
    try {
        acl_utils_1.verifyUserCanAccessCluster(req.user, req.cluster);
        const explorerCache = services_1.getExplorerCache();
        req.dynomiteApi = (await explorerCache.getExplorer(datastoreType, clusterName, app_utils_1.getRegion(req.app), app_utils_1.getEnv(req.app), (cluster) => {
            return dynomiteDatastoreService.connect(cluster);
        }));
        return next();
    }
    catch (err) {
        return next(err);
    }
});
/**
 * Fetch cluster information.
 */
router.get('/:cluster', async (req, res, next) => {
    try {
        const keyCount = await req.dynomiteApi.getKeyCount();
        res.json({ totalKeys: keyCount });
    }
    catch (err) {
        next(err);
    }
});
router.use('/:cluster/keys', keys_1.default);
router.use('/:cluster/fields', fields_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map