"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const cassandra_driver_1 = require("cassandra-driver");
const { retry } = cassandra_driver_1.policies;
const { RetryPolicy } = retry;
const logger = logger_1.default(module);
/**
 * Custom retry policy that explicitly prevents retries.
 */
class NoRetryPolicy extends RetryPolicy {
    onReadTimeout(requestInfo, _consistency, _received, _blockFor, _isDataPresent) {
        const query = requestInfo ? requestInfo.query : 'N/A';
        logger.error(`readTimeout: ${query}`);
        return this.rethrowResult();
    }
    onUnavailable(requestInfo, _consistency, _required, _alive) {
        const query = requestInfo ? requestInfo.query : 'N/A';
        logger.error(`unavailable: ${query}`);
        return this.rethrowResult();
    }
    onWriteTimeout(requestInfo, _consistency, _received, _blockFor, _writeType) {
        const query = requestInfo ? requestInfo.query : 'N/A';
        logger.error(`writeTimeout: ${query}`);
        return this.rethrowResult();
    }
}
exports.default = NoRetryPolicy;
//# sourceMappingURL=NoRetryPolicy.js.map