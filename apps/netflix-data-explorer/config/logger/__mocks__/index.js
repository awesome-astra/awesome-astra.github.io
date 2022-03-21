"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
function init() {
    // no-op
}
exports.init = init;
const TEST_LOGGING_ENABLED = false;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function loggerFactory(_module) {
    return {
        debug(message) {
            TEST_LOGGING_ENABLED && console.debug(message);
        },
        warn(message) {
            TEST_LOGGING_ENABLED && console.warn(message);
        },
        info(message) {
            TEST_LOGGING_ENABLED && console.info(message);
        },
        error(message) {
            TEST_LOGGING_ENABLED && console.error(message);
        },
    };
}
exports.default = loggerFactory;
//# sourceMappingURL=index.js.map