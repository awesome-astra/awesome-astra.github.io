"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerCache = exports.getUserGroupCache = exports.__setUserGroups = exports.setupServices = void 0;
const ExplorerCache_1 = __importDefault(require("@/services/explorer/ExplorerCache"));
jest.mock('@/services/explorer/ExplorerCache');
exports.setupServices = jest
    .fn()
    .mockResolvedValue(() => Promise.resolve());
const DEFAULT_USER_GROUPS = ['all@netflix.com'];
const __getUserGroups = jest.fn();
__getUserGroups.mockResolvedValue(DEFAULT_USER_GROUPS);
/**
 * Call this function in tests in a beforeAll()/beforeEach() to change the
 * user's groups for a request. You can then call it again in
 * afterAll()/afterEach() to reset the values to the default.
 */
function __setUserGroups(userGroups = DEFAULT_USER_GROUPS) {
    __getUserGroups.mockResolvedValue(userGroups);
}
exports.__setUserGroups = __setUserGroups;
exports.getUserGroupCache = jest.fn().mockImplementation(() => {
    return {
        getUserGroups: () => {
            return __getUserGroups();
        },
    };
});
const explorerCache = new ExplorerCache_1.default();
const getExplorerCache = () => {
    return explorerCache;
};
exports.getExplorerCache = getExplorerCache;
//# sourceMappingURL=index.js.map