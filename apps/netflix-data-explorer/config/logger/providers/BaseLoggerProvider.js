"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const lodash_1 = __importDefault(require("lodash"));
class BaseLoggerProvider {
    getTransports(isProd) {
        const { combine, timestamp, printf } = winston_1.format;
        const consoleTransportFormatters = [
            timestamp(),
            printf((options) => {
                var _a;
                const time = options.timestamp;
                const msg = options.message;
                let level = options.level.toUpperCase();
                let user = ((_a = options === null || options === void 0 ? void 0 : options.user) === null || _a === void 0 ? void 0 : _a.email) || '';
                let location = options.location || '';
                let formattedMsg;
                if (isProd) {
                    const clusterName = options.cluster || '';
                    const datastoreType = options.datastoreType || '';
                    // note, these JSON fields must match what's defined in the filebeat JSON mapping file.
                    formattedMsg = JSON.stringify({
                        time,
                        level,
                        user,
                        location,
                        cluster: clusterName,
                        datastoreType,
                        message: msg,
                    });
                }
                else {
                    level = lodash_1.default.padStart(level, 5);
                    user = this.truncateAndPad(user, 24, false);
                    location = this.truncateAndPad(location, 30, true);
                    formattedMsg = `${time} [${level}] [${user}] [${location}] ${msg}`;
                }
                return formattedMsg;
            }),
        ];
        return [
            new winston_1.transports.Console({
                format: combine(...consoleTransportFormatters),
            }),
        ];
    }
    /**
     * Helper for truncating a string and returning the string in padded form.
     * @param msg             The string to truncate.
     * @param padding         The amount of padding required.
     * @param ellipsisAtStart True to apply truncate and apply ellipsis to the start of the string.
     *                        False to truncate and apply ellipsis to the end of the string. Defaults to
     *                        false.
     * Returns a string that has exactly "padding" number of characters. If the
     * string required truncation, the returned string will include ellipsis at
     * either the beginning or the end of the string.
     * @private
     */
    truncateAndPad(msg, padding, ellipsisAtStart = false) {
        let result = msg;
        if (msg.length >= padding) {
            if (ellipsisAtStart) {
                result = `...${msg.slice(-padding + 3)}`;
            }
            else {
                result = lodash_1.default.truncate(msg, { length: padding });
            }
        }
        result = lodash_1.default.padStart(result, padding);
        return result;
    }
}
exports.default = BaseLoggerProvider;
//# sourceMappingURL=BaseLoggerProvider.js.map