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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.getConfig = exports.loadConfig = exports.__resetConfig = exports.__updateConfig = void 0;
const baseConfig = __importStar(require("../base-config"));
const currentConfig = jest
    .fn()
    .mockReturnValue(JSON.parse(JSON.stringify(baseConfig)));
// tslint:disable:jsdoc-format
/**
 * Allows modification of the loaded test configuration in tests.
 *
 * Example usage
 ```
  describe('sample suite', () => {
    beforeAll(() => {
      const MockConfiguration = (await import('@/config/configuration')) as any;
      MockConfiguration.__updateConfig({
        REQUIRE_AUTHENTICATION: true,
      });
    }
    // ...
  })
 ```
 * @param testConfig New test configuration to apply on top of the base config.
 */
function __updateConfig(testConfig = {}) {
    currentConfig.mockReturnValue(Object.assign({}, baseConfig, testConfig));
}
exports.__updateConfig = __updateConfig;
function __resetConfig() {
    currentConfig.mockReturnValue(baseConfig);
}
exports.__resetConfig = __resetConfig;
function loadConfig(configModule) {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const customConfig = require(configModule);
    __updateConfig(customConfig);
    const newConfig = JSON.parse(JSON.stringify(getConfig()));
    __resetConfig();
    return newConfig;
}
exports.loadConfig = loadConfig;
function getConfig() {
    return currentConfig();
}
exports.getConfig = getConfig;
function init() {
    // no op
}
exports.init = init;
//# sourceMappingURL=configuration.js.map