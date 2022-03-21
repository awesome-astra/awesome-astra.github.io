"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/config/constants");
const logger_1 = __importDefault(require("@/config/logger"));
const app_utils_1 = require("@/utils/app-utils");
const express_1 = require("express");
const lodash_1 = __importDefault(require("lodash"));
const configuration_1 = require("@/config/configuration");
const multer_1 = __importDefault(require("multer"));
const logger = logger_1.default(module);
const router = express_1.Router();
const { MAX_FILE_UPLOAD, CLUSTER_REDIRECT_HOST } = configuration_1.getConfig();
const upload = multer_1.default({
    dest: 'uploads/',
    limits: {
        fileSize: MAX_FILE_UPLOAD,
    },
});
function getRedirectHost(host, region, env) {
    return CLUSTER_REDIRECT_HOST.replace(/(:appName)|(:regionName)|(:accountName)/g, (_match, appName, regionName, accountName) => {
        if (appName)
            return host;
        if (regionName)
            return region;
        if (accountName)
            return env;
        return '';
    });
}
router.post('/astradb', upload.single('file'), (req, res) => {
    if (req.body.applicationToken && req.file.filename) {
        configuration_1.setAstraConfiguration(req.body.applicationToken, req.file.filename);
    }
    return res.json({
        success: true,
    });
});
/**
 * Fetch all the available regions as well as the name of the current environment and region.
 */
router.get('/regions', (req, res) => {
    const available = new Array();
    const knownRegions = app_utils_1.getAllKnownRegions();
    const knownEnvironments = app_utils_1.getAllKnownEnvironments();
    knownRegions.sort().forEach((regionName) => {
        knownEnvironments.forEach((envName) => {
            available.push({ env: envName, region: regionName });
        });
    });
    res.json({
        available: lodash_1.default.sortBy(available, ['env', 'region']),
        current: {
            env: app_utils_1.getEnv(req.app),
            region: app_utils_1.getRegion(req.app),
        },
    });
});
/**
 * Request to change regions.
 *
 * By POSTing to this endpoint, the caller will be redirected to the app running in the given region.
 * A session cookie will also be set with the current requester's JWT. This can be then be sent via
 * the Authorization header by your app.
 */
router.post('/regions/:regionInfo', (req, res) => {
    const datastoreType = req.body.datastoreType;
    if (!datastoreType || datastoreType.length === 0) {
        return res.status(400).json({ message: 'Datastore type is required' });
    }
    const availableEnvironments = app_utils_1.getAllKnownEnvironments();
    const availableRegions = app_utils_1.getAllKnownRegions();
    const regionInfo = req.params.regionInfo.toLowerCase();
    const re = new RegExp(`^(${availableEnvironments.join('|')})-(.*)$`);
    const matches = re.exec(regionInfo);
    if (!matches || matches.length !== 3) {
        logger.error(`Failed to switch to region ${regionInfo}. Available environments: ${JSON.stringify(availableEnvironments)}; available regions: ${JSON.stringify(availableRegions)}`);
        return res
            .status(400)
            .json({ message: `Invalid region info: '${regionInfo}'` });
    }
    const envName = matches[1];
    const regionName = matches[2];
    if (availableRegions.indexOf(regionName) < 0) {
        return res
            .status(404)
            .json({ message: `Could not find given region: ${regionName}` });
    }
    const optionalCluster = req.body.cluster
        ? `/clusters/${req.body.cluster}`
        : '';
    let url;
    if (process.env.NODE_ENV === 'development') {
        logger.info(`DEV MODE - switching server region/env to: ${regionName}/${envName}.`, req);
        req.app.set(constants_1.APP_ENV, envName);
        req.app.set(constants_1.APP_REGION, regionName);
        url = `${req.headers.origin}/${datastoreType}${optionalCluster}`;
    }
    else {
        const cluster = app_utils_1.getAppStack(req.app);
        const redirectHost = getRedirectHost(cluster, regionName, envName);
        url = `${redirectHost}/${datastoreType}${optionalCluster}`;
    }
    res.setHeader('location', url);
    res.json({ location: url });
});
/**
 * Fetches the list of environment/region combinations for a given cluster.
 */
router.get('/regions/:datastoreType/:clusterName', (req, res, next) => {
    try {
        const availableClusters = app_utils_1.getAvailableClusters(req.params.datastoreType);
        const items = availableClusters
            .filter((item) => item.name === req.params.clusterName)
            .map((item) => ({ region: item.region, env: item.env }));
        res.json(lodash_1.default.sortBy(items, ['env', 'region']));
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map