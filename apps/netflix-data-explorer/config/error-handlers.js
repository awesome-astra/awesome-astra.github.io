"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandlers = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
const FileUploadError_1 = __importDefault(require("@/model/errors/FileUploadError"));
const HttpStatusError_1 = __importDefault(require("@/model/errors/HttpStatusError"));
const ClusterConnectionError_1 = __importDefault(require("@/services/datastores/base/errors/ClusterConnectionError"));
const CassandraAuthenticationError_1 = __importDefault(require("@/services/datastores/cassandra/lib/errors/CassandraAuthenticationError"));
const CassandraNoHostAvailableError_1 = __importDefault(require("@/services/datastores/cassandra/lib/errors/CassandraNoHostAvailableError"));
const app_utils_1 = require("@/utils/app-utils");
const cassandra_driver_1 = require("cassandra-driver");
const multer_1 = __importDefault(require("multer"));
const logger = logger_1.default(module);
function buildErrorResponse(req, err, isDevMode = false) {
    let e = err;
    if (e.message.indexOf('Connection is closed') >= 0) {
        logger.info('Caught a Redis connection error');
        e = new ClusterConnectionError_1.default(req.cluster.name, app_utils_1.getAppName(req.app));
    }
    if (e instanceof multer_1.default.MulterError) {
        e = new FileUploadError_1.default(e);
    }
    if (e instanceof cassandra_driver_1.types.DriverError) {
        if (e.message.toLowerCase().indexOf('authentication provider not set') >= 0) {
            e = new CassandraAuthenticationError_1.default(req.cluster.name);
        }
        else if (e.name === 'NoHostAvailableError') {
            e = new CassandraNoHostAvailableError_1.default(req.cluster.name);
        }
    }
    if (isDevMode) {
        // use console logger here to make stack traces easier to read in dev mode
        // tslint:disable-next-line
        console.error(e);
    }
    return {
        status: e.status || 500,
        title: e.title,
        message: e.message,
        remediation: e.remediation,
        error: isDevMode ? e.stack : {},
    };
}
function setupErrorHandlers(app) {
    // catch 404 and forward to error handler
    app.use((_req, _res, next) => {
        next(new HttpStatusError_1.default(404, 'Not Found', 'Not Found'));
    });
    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use((err, req, res, _next) => {
            const errResp = buildErrorResponse(req, err, true);
            res.status(errResp.status || 500).json(errResp);
        });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, _next) => {
        const status = err.status;
        if (status && status >= 400 && status <= 499) {
            logger.info(err.message);
        }
        else {
            logger.error(err.message);
        }
        const errResp = buildErrorResponse(req, err, false);
        res.status(errResp.status || 500).json(errResp);
    });
}
exports.setupErrorHandlers = setupErrorHandlers;
//# sourceMappingURL=error-handlers.js.map