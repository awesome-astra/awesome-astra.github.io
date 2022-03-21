"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("@/typings/enums");
const EntityAccessControlService_1 = __importDefault(require("../EntityAccessControlService"));
describe('EntityAccessControlService', () => {
    let mockProvider;
    let entityAclService;
    beforeEach(() => {
        const MockProvider = jest.fn(() => ({
            getEntityOwners: jest.fn(),
            setEntityOwners: jest.fn(),
        }));
        mockProvider = new MockProvider();
        entityAclService = new EntityAccessControlService_1.default(mockProvider);
    });
    test('get() should delegate to provider', async () => {
        await entityAclService.getEntityOwners('cluster_a', 'test', enums_1.EntityType.KEYSPACE, 'entity_a');
        expect(mockProvider.getEntityOwners).toBeCalled();
    });
    test('set() should delegate to provider', async () => {
        await entityAclService.setEntityOwners('cluster_a', 'test', enums_1.EntityType.KEYSPACE, 'entity_a', ['owner_a', 'owner_b']);
        expect(mockProvider.setEntityOwners).toBeCalled();
    });
});
//# sourceMappingURL=EntityAccessControlService.spec.js.map