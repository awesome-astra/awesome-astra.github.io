"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntityAccessControlCache_1 = __importDefault(require("@/services/entity-acls/EntityAccessControlCache"));
const enums_1 = require("@/typings/enums");
const MockLoader = jest.fn(() => ({
    fetchAllEntities: jest.fn(),
    fetchEntity: jest.fn(),
}));
describe('EntityAccessControlCache', () => {
    let loader;
    let cache;
    let sampleEntities;
    beforeEach(() => {
        loader = new MockLoader();
        cache = new EntityAccessControlCache_1.default(loader);
        sampleEntities = Array.from(new Array(5)).map((_item, index) => ({
            clusterName: `cluster_${index}`,
            env: 'test',
            name: `name_${index}`,
            type: 'KEYSPACE',
            owners: [`owner_${index}`],
        }));
    });
    it('should fetch all entities from loader on cache refresh', () => {
        cache.refresh();
        expect(loader.fetchAllEntities).toBeCalled();
    });
    it('should cause loader to fetch on cache miss', () => {
        const clusterName = 'cluster_a';
        const env = 'test';
        const type = enums_1.EntityType.KEYSPACE;
        const entityName = 'keyspace_name';
        cache.get(clusterName, env, type, entityName);
        expect(loader.fetchEntity).toBeCalledWith(clusterName, env, type, entityName);
    });
    it('should not call the loader when cache.getIfPresent() is called', () => {
        cache.getIfPresent('cluster_b', 'test', enums_1.EntityType.KEYSPACE, 'keyspace');
        expect(loader.fetchEntity).not.toBeCalled();
    });
    it('subsequent requests for the sample item, should hit the cache', async () => {
        const MAX_LOADER_REQUESTS = 1;
        const sampleEntity = {
            clusterName: 'cluster_c',
            env: 'test',
            name: 'entity_name',
            owners: ['user@netflix.com'],
            type: 'KEYSPACE',
        };
        loader.fetchEntity = jest.fn().mockResolvedValue(sampleEntity);
        // make first request
        expect(await cache.get(sampleEntity.clusterName, sampleEntity.env, enums_1.EntityType[sampleEntity.type], sampleEntity.name)).toEqual(sampleEntity);
        expect(loader.fetchEntity).toBeCalledTimes(MAX_LOADER_REQUESTS);
        // request the same item again (loader should only be called once)
        expect(await cache.get(sampleEntity.clusterName, sampleEntity.env, enums_1.EntityType[sampleEntity.type], sampleEntity.name)).toEqual(sampleEntity);
        expect(loader.fetchEntity).toBeCalledTimes(MAX_LOADER_REQUESTS);
    });
    it('should fetch all values from local cache', () => {
        cache.values();
        expect(loader.fetchAllEntities).not.toBeCalled();
        expect(loader.fetchEntity).not.toBeCalled();
    });
    it('refreshing the cache then calling values()', async () => {
        loader.fetchAllEntities = jest.fn().mockResolvedValue(sampleEntities);
        await cache.refresh();
        expect(cache.values().sort((a, b) => a.clusterName.localeCompare(b.clusterName))).toEqual(sampleEntities);
    });
    it('should iterate the cache in order of recentness', async () => {
        loader.fetchAllEntities = jest.fn().mockResolvedValue(sampleEntities);
        await cache.refresh();
        // the cache will populate the items with the most recent items last
        const items = new Array();
        cache.forEach((item, _index) => items.splice(0, 0, item));
        expect(items).toEqual(sampleEntities);
    });
});
//# sourceMappingURL=EntityAccessControlCache.spec.js.map