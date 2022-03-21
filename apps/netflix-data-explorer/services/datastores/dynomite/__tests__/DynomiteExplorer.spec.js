"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRedisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dynomite_constants_1 = require("../lib/dynomite-constants");
const DynomiteCluster_1 = __importDefault(require("../lib/DynomiteCluster"));
const DynomiteExplorer_1 = __importDefault(require("../lib/DynomiteExplorer"));
const errors_1 = require("../lib/errors");
jest.mock('../lib/DynomiteCluster');
jest.mock('ioredis');
const azCount = 3;
exports.mockRedisConnection = new ioredis_1.default();
jest.mock('../lib/DynomiteCluster', () => {
    return jest.fn().mockImplementation(() => ({
        getConnection: async () => exports.mockRedisConnection,
        executeCommandInSingleZone: async (cb) => {
            return Promise.all(Array.from(new Array(azCount)).map((_) => cb(exports.mockRedisConnection)));
        },
    }));
});
describe('DynomiteExplorer suite', () => {
    let explorer;
    beforeEach(() => {
        DynomiteCluster_1.default.mockClear();
        explorer = new DynomiteExplorer_1.default({
            env: 'test',
            instances: [],
            name: 'test_cluster',
            region: 'us-east-1',
            datastoreType: 'dynomite',
        });
    });
    describe('getValue() tests', () => {
        describe('string type tests', () => {
            const defaultType = 'string';
            const defaultTtl = 10000;
            beforeEach(() => {
                exports.mockRedisConnection.type = jest.fn().mockResolvedValue(defaultType);
                exports.mockRedisConnection.ttl = jest.fn().mockResolvedValue(defaultTtl);
            });
            it('should get a string value', async () => {
                const value = {
                    name: 'string-key',
                    ttl: defaultTtl,
                    type: defaultType,
                    value: 'cat',
                };
                exports.mockRedisConnection.get.mockResolvedValue(value.value);
                const result = await explorer.getValue(value.name);
                expect(result).toEqual(value);
                expect(exports.mockRedisConnection.get).toBeCalledTimes(1);
            });
            it('should throw if key value is too long', () => {
                exports.mockRedisConnection.strlen = jest
                    .fn()
                    .mockResolvedValue(dynomite_constants_1.MAX_KEY_STRING_SIZE_CHARS + 1);
                return expect(explorer.getValue('long-key')).rejects.toThrowError(errors_1.KeyTooLargeError);
            });
        });
        describe('list type tests', () => {
            const defaultType = 'list';
            const defaultTtl = 10000;
            beforeEach(() => {
                exports.mockRedisConnection.type = jest.fn().mockResolvedValue(defaultType);
                exports.mockRedisConnection.ttl = jest.fn().mockResolvedValue(defaultTtl);
            });
            it('should get a list value', async () => {
                const value = {
                    name: 'list-key',
                    ttl: defaultTtl,
                    type: defaultType,
                    value: '[a, b, c]',
                };
                exports.mockRedisConnection.lrange.mockResolvedValue(value.value);
                const result = await explorer.getValue(value.name);
                expect(result).toEqual(value);
                expect(exports.mockRedisConnection.lrange).toBeCalledTimes(1);
            });
        });
        describe('set type tests', () => {
            beforeEach(() => {
                exports.mockRedisConnection.type = jest.fn().mockResolvedValue('set');
            });
            it('should get a list value', async () => {
                const value = {
                    name: 'set-key',
                    ttl: 10000,
                    type: 'set',
                    value: '[a, b, c]',
                };
                exports.mockRedisConnection.smembers.mockResolvedValue(value.value);
                const result = await explorer.getValue(value.name);
                expect(result).toEqual(value);
                expect(exports.mockRedisConnection.smembers).toBeCalledTimes(1);
            });
        });
        describe('zset type tests', () => {
            beforeEach(() => {
                exports.mockRedisConnection.type = jest.fn().mockResolvedValue('zset');
            });
            it('should get a list value', async () => {
                const value = {
                    name: 'zset-key',
                    ttl: 10000,
                    type: 'zset',
                    value: '[a, 1, b, 2, c, 3]',
                };
                exports.mockRedisConnection.zrange.mockResolvedValue(value.value);
                const result = await explorer.getValue(value.name);
                expect(result).toEqual(value);
                expect(exports.mockRedisConnection.zrange).toBeCalledTimes(1);
            });
        });
        describe('hash type tests', () => {
            beforeEach(() => {
                exports.mockRedisConnection.type = jest.fn().mockResolvedValue('hash');
            });
            it('should get a list value', async () => {
                const value = {
                    name: 'zset-key',
                    ttl: 10000,
                    type: 'hash',
                    value: '[a, 1, b, 2, c, 3]',
                };
                exports.mockRedisConnection.hgetall.mockResolvedValue(value.value);
                const result = await explorer.getValue(value.name);
                expect(result).toEqual(value);
                expect(exports.mockRedisConnection.hgetall).toBeCalledTimes(1);
            });
        });
        it('should throw if key not found', () => {
            exports.mockRedisConnection.type = jest.fn().mockResolvedValue('none');
            return expect(explorer.getValue('missing-key')).rejects.toThrowError(errors_1.KeyNotFoundError);
        });
        it('should throw on unsupported key type', () => {
            exports.mockRedisConnection.type = jest.fn().mockResolvedValue('new-key-type');
            return expect(explorer.getValue('missing-key')).rejects.toThrow();
        });
    });
    describe('setValue() tests', () => {
        it('should call set value', () => {
            exports.mockRedisConnection.set = jest.fn().mockResolvedValue('OK');
            return expect(explorer.setValue('test-key', 'test-value')).resolves.toEqual('OK');
        });
    });
    describe('deleteKey() tests', () => {
        beforeEach(() => {
            exports.mockRedisConnection.del.mockReset();
        });
        it('should throw KeyNotFoundError', () => {
            exports.mockRedisConnection.del.mockResolvedValue(0);
            return expect(explorer.deleteKey('missing-key')).rejects.toThrow(errors_1.KeyNotFoundError);
        });
        it('should return the deleted key count', () => {
            const deletedCount = 1;
            exports.mockRedisConnection.del.mockResolvedValue(deletedCount);
            return expect(explorer.deleteKey('missing-key')).resolves.toEqual({
                count: deletedCount,
            });
        });
    });
    describe('getInfo and getKeyCount()', () => {
        const keyCount = 12345;
        const keyString = `keys=${keyCount},expires=1400,avg_ttl=123`;
        const infoResponse = `# Server\r
key1:value1\r
key2:value2\r
# Clients\r
key3:value3\r
# Keyspace\r
db0:keys=${keyCount},expires=1400,avg_ttl=123\r
`;
        beforeEach(() => {
            exports.mockRedisConnection.info.mockResolvedValue(infoResponse);
        });
        it('should return info', () => {
            return expect(explorer.getInfo()).resolves.toEqual(Array.from(new Array(azCount)).map((_) => ({
                Clients: {
                    key3: 'value3',
                },
                Keyspace: {
                    db0: keyString,
                },
                Server: {
                    key1: 'value1',
                    key2: 'value2',
                },
            })));
        });
        it('should return keyCount', () => {
            return expect(explorer.getKeyCount()).resolves.toEqual(keyCount * azCount);
        });
    });
});
//# sourceMappingURL=DynomiteExplorer.spec.js.map