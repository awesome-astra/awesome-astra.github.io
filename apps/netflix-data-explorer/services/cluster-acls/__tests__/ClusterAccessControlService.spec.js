"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClusterAccessControlService_1 = __importDefault(require("@/services/cluster-acls/ClusterAccessControlService"));
describe('ClusterAccessControlService', () => {
    describe('test without provider', () => {
        it('must have a provider set', () => {
            const clusterAclService = new ClusterAccessControlService_1.default();
            expect(() => clusterAclService.start()).toThrow();
        });
    });
    describe('test mock provider', () => {
        let clusterAclService;
        let mockProvider;
        beforeEach(() => {
            jest.useFakeTimers();
            const MockProvider = jest.fn(() => ({
                currentEnvironment: 'test',
                currentRegion: 'us-east-1',
                regions: ['us-east-1'],
                environments: ['test'],
                getClusterAccessControl: jest.fn(),
            }));
            mockProvider = new MockProvider();
            clusterAclService = new ClusterAccessControlService_1.default();
            clusterAclService.use(mockProvider);
        });
        test('should use given provider', async () => {
            await clusterAclService.refresh();
            expect(mockProvider.getClusterAccessControl).toBeCalled();
        });
        test('starting the service should setup a timer to poll', async () => {
            await clusterAclService.start();
            expect(mockProvider.getClusterAccessControl).toBeCalled();
            expect(setTimeout).toBeCalled();
        });
    });
});
//# sourceMappingURL=ClusterAccessControlService.spec.js.map