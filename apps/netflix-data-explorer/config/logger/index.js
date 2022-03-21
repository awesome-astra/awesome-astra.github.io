"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const configuration_1 = require("../configuration");
const { LOGGER_PROVIDER } = configuration_1.getConfig();
const logLevel = process.env.LOG_LEVEL || 'info';
const isProd = process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test';
let logger;
/**
 * Initializes the logger. Must be called early in the startup lifecycle in order
 * for other services to use it.
 */
function init() {
    const path = `@/config/logger/providers/${LOGGER_PROVIDER}`;
    // note, we use a synchronous require rather than the standard loadClass()
    // that uses promises as it needs to be called synchronously in the startup sequence
    // before it is used.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Provider = require(path).default;
    logger = winston_1.createLogger({
        level: logLevel,
        transports: new Provider().getTransports(isProd),
    });
}
exports.init = init;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function loggerFactory(module) {
    if (!logger) {
        throw new Error('Logger not initialized. Please call initLogger() before first use.');
    }
    if (!module) {
        throw new Error('The module name is required to log.');
    }
    const rootDir = path_1.default.join(__dirname, '..', '..', '..');
    const filename = module.id.slice(rootDir.length);
    const internalLog = (level, message, metadata) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const params = { location: filename };
        if (metadata instanceof http_1.default.IncomingMessage) {
            const req = metadata;
            Object.assign(params, {
                cluster: (_b = (_a = req === null || req === void 0 ? void 0 : req.cluster) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
                datastoreType: (_c = req.datastoreType) !== null && _c !== void 0 ? _c : '',
                route: (_d = req.originalUrl) !== null && _d !== void 0 ? _d : '',
                clientApp: (_f = (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.application) !== null && _f !== void 0 ? _f : '',
                user: {
                    email: (_h = (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g.email) !== null && _h !== void 0 ? _h : '',
                },
            });
        }
        logger.log(level, message, params);
    };
    return {
        /**
         * Logs an info level message.
         * @param message     The message to be logged.
         * @param metadata    Additional metadata to be logged.
         */
        info(message, metadata) {
            internalLog('info', message, metadata);
        },
        /**
         * Logs a debug level message.
         * @param message     The message to be logged.
         * @param metadata    Additional metadata to be logged.
         */
        debug(message, metadata) {
            internalLog('debug', message, metadata);
        },
        /**
         * Logs an error level message.
         * @param message     The message to be logged.
         * @param metadata    Additional metadata to be logged.
         */
        error(message, metadata) {
            internalLog('error', message, metadata);
        },
        /**
         * Logs a warning level message
         * @param message     The message to be logged.
         * @param metadata    Additional metadata to be logged.
         */
        warn(message, metadata) {
            internalLog('warn', message, metadata);
        },
    };
}
exports.default = loggerFactory;
//# sourceMappingURL=index.js.map