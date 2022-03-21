"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApp = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
require('module-alias/register');
// need this to be synchronous and initialized first
require('@/config/configuration').init();
// logger depends on configuration and must be setup before all other services
require('@/config/logger').init();
// loading i18n support up front simplifies usage in the rest of the app
require('@/i18n').setupi18n();
const error_handlers_1 = require("@/config/error-handlers");
const logger_1 = __importDefault(require("@/config/logger"));
const middlewares_1 = require("@/config/middlewares");
const services_1 = require("@/config/services");
const setup_env_1 = require("@/config/setup-env");
const routes_1 = __importDefault(require("@/routes"));
const express_1 = __importDefault(require("express"));
const nocache_1 = __importDefault(require("nocache"));
const path_1 = require("path");
const configuration_1 = require("./config/configuration");
const store_1 = require("./model/store");
const enums_1 = require("./typings/enums");
const { APP_NAME, APP_PORT } = configuration_1.getConfig();
const logger = logger_1.default(module);
const app = express_1.default();
setup_env_1.setupEnv(app);
function healthcheck(_req, res) {
    const { discovery } = store_1.getStore();
    const { clusters, status: discoveryStatus } = discovery;
    const noClustersFound = !clusters || Object.keys(clusters).length === 0;
    const { accessControl } = store_1.getStore();
    const { status: aclStatus, clusterAclMap } = accessControl;
    const noAclInfo = !clusterAclMap || Object.keys(clusterAclMap).length === 0;
    if (discoveryStatus === enums_1.State.LOADING || aclStatus === enums_1.State.LOADING) {
        return res.status(204).send();
    }
    else if (noClustersFound && discoveryStatus === enums_1.State.ERROR) {
        return res
            .status(500)
            .send('No clusters found and last discovery attempt failed.');
    }
    else if (noAclInfo && aclStatus === enums_1.State.ERROR) {
        return res
            .status(500)
            .send('No cluster access control information found and last retrieval attempt failed.');
    }
    else if (discoveryStatus === enums_1.State.ERROR) {
        return res.status(203).send('Last discovery attempt failed.');
    }
    else if (aclStatus === enums_1.State.ERROR) {
        return res.status(203).send('Last ACL request attempt failed.');
    }
    return res.status(200).send('OK!');
}
const appPromise = new Promise((resolve, reject) => {
    services_1.setupServices(app)
        .then(() => {
        app.get('/healthcheck', nocache_1.default(), healthcheck);
        middlewares_1.setupMiddleware(app);
        app.use('/REST', nocache_1.default(), routes_1.default);
        // serve all other routes from index.html to enable client-side routing.
        app.get('*', (req, res) => {
            if (req.url.match(/^\/static\/(js|css|fonts)\//)) {
                res.status(404).send();
            }
            else {
                res.header('Cache-Control', 'no-cache');
                res.sendFile(path_1.join(__dirname, 'public', 'index.html'));
            }
        });
        error_handlers_1.setupErrorHandlers(app);
        // don't start the server in test mode since tests are run in parallel
        // and we only need the app to be created and we can forgo the server
        if (process.env.NODE_ENV !== 'test') {
            app.listen(APP_PORT, () => {
                logger.info(`${APP_NAME} listening on port ${APP_PORT}!`);
            });
        }
        resolve(app);
    })
        .catch((err) => {
        logger.error(`Startup failed due to: ${err.message}`);
        reject();
        process.exit(1);
    });
});
// needed for tests to know when the app has started
function getApp() {
    return appPromise;
}
exports.getApp = getApp;
//# sourceMappingURL=index.js.map