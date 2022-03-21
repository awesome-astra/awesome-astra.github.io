"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClusterNotFoundError_1 = __importDefault(require("@/services/datastores/base/errors/ClusterNotFoundError"));
const enums_1 = require("@/typings/enums");
const ExplorerCache_1 = __importDefault(require("../ExplorerCache"));
jest.useFakeTimers();
const mockGet = jest.fn();
const mockPeek = jest.fn();
const mockPrune = jest.fn();
const mockSet = jest.fn();
jest.mock('lru-cache', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get: mockGet,
            peek: mockPeek,
            prune: mockPrune,
            set: mockSet,
        };
    });
});
describe('ExplorerCache suite', () => {
    const type = enums_1.DatastoreType.CASSANDRA;
    const clusterName = 'cluster_a';
    const region = 'us-east-1';
    const env = 'test';
    const cacheKey = `${type}:::${env}:::${region}:::${clusterName}`;
    let explorerCache;
    beforeEach(() => {
        mockPeek.mockClear();
        mockGet.mockClear();
        mockSet.mockClear();
        explorerCache = new ExplorerCache_1.default();
        explorerCache.updateClusters(type, [
            {
                env,
                instances: [],
                name: clusterName,
                region,
                datastoreType: 'cassandra',
            },
        ]);
    });
    test('peekExplorer() should return undefined', () => {
        expect(explorerCache.peekExplorer(type, clusterName, region, env)).toBeUndefined();
        expect(mockPeek).toBeCalled();
    });
    test('peekExplorer() should throw if cluster not loaded', () => {
        expect(() => explorerCache.peekExplorer(type, 'unknown_cluster', region, env)).toThrowError(ClusterNotFoundError_1.default);
    });
    test('getExplorer() should throw if cluster not loaded', () => {
        return expect(explorerCache.getExplorer(type, 'unknown_cluster', region, env, jest.fn())).rejects.toThrowError(ClusterNotFoundError_1.default);
    });
    test('getExplorer() should create a new explorer and add it to the cache on a cache miss', async () => {
        const mockExplorer = {
            shutdown: jest.fn(),
        };
        const mockCb = jest.fn().mockResolvedValue(mockExplorer);
        const explorer = await explorerCache.getExplorer(type, clusterName, region, env, mockCb);
        expect(explorer).toBe(mockExplorer);
        expect(mockGet).toBeCalledWith(cacheKey);
        expect(mockSet).toBeCalledWith(cacheKey, mockExplorer);
    });
    test('should return an existing explorer on cache hit', async () => {
        const mockExplorer = { shutdown: jest.fn() };
        const mockCb = jest.fn();
        mockGet.mockResolvedValue(mockExplorer);
        const explorer = await explorerCache.getExplorer(type, clusterName, region, env, mockCb);
        expect(mockCb).not.toBeCalled();
        expect(explorer).toBe(mockExplorer);
    });
    test('should prune cache on a timer', () => {
        jest.clearAllTimers();
        new ExplorerCache_1.default();
        expect(mockPrune).not.toBeCalled();
        jest.runOnlyPendingTimers();
        expect(mockPrune).toBeCalled();
    });
});
//# sourceMappingURL=ExplorerCache.spec.js.map