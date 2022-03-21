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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("@/model/__mocks__/store");
const EntityNotAuthorizedError_1 = __importDefault(require("@/model/errors/EntityNotAuthorizedError"));
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const entity_helper_1 = require("./helpers/entity-helper");
const user_helper_1 = require("./helpers/user-helper");
jest.mock('@/model/store');
jest.mock('@/config/services', () => {
    const MockCache = jest.genMockFromModule('../../services/entity-acls/EntityAccessControlCache').default;
    return {
        getEntityAccessControlCache: () => new MockCache(undefined),
    };
});
describe('Entity Access Control', () => {
    const netflixDL = 'all@netflix.com';
    const teamDL = 'teamA@netflix.com';
    const teamKeyspaceName = 'team_keyspace';
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const teamKeyspace = entity_helper_1.createTestKeyspace(store_1.sharedCluster.cluster.name, store_1.sharedCluster.cluster.env, teamKeyspaceName, [teamDL]);
    const generalKeyspaceName = 'general_keyspace';
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const generalKeyspace = entity_helper_1.createTestKeyspace(store_1.sharedCluster.cluster.name, store_1.sharedCluster.cluster.env, generalKeyspaceName, [netflixDL]);
    const teamUser = user_helper_1.createTestUser('jill@netflix.com', [
        teamDL,
        netflixDL,
    ]);
    describe('Filtering Accessible Entities', () => {
        it('Should not filter entities on dedicated cluster', () => {
            expect.assertions(1);
            const keyspaceNames = [teamKeyspaceName, 'other_keyspace_name'];
            return expect(acl_utils_1.filterAccessibleEntities(teamUser, store_1.privateCluster.cluster, enums_1.EntityType.KEYSPACE, keyspaceNames)).resolves.toEqual(new Set(keyspaceNames));
        });
    });
    describe('Verify User Access', () => {
        const opsTeam = 'ops-team@netflix.com';
        const generalUser = user_helper_1.createTestUser('jack@netflix.com', [
            netflixDL,
        ]);
        const opsUser = user_helper_1.createTestUser('ops-user@netflix.com', [
            opsTeam,
            netflixDL,
        ]);
        beforeAll(async () => {
            const MockConfiguration = (await Promise.resolve().then(() => __importStar(require('@/config/configuration'))));
            MockConfiguration.__updateConfig({
                ALL_ENTITY_MEMBERS: [opsTeam],
            });
        });
        it('Should allow team member access to entity on shared cluster', async () => {
            expect.assertions(1);
            try {
                await acl_utils_1.verifyUserAccessEntity(teamUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, teamKeyspaceName, false);
            }
            catch (err) {
                expect(err).toBeInstanceOf(EntityNotAuthorizedError_1.default);
            }
        });
        it('Should not allow general access to entity on shared cluster', async () => {
            expect.assertions(1);
            try {
                await acl_utils_1.verifyUserAccessEntity(generalUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, teamKeyspaceName, false);
            }
            catch (err) {
                expect(err).toBeInstanceOf(EntityNotAuthorizedError_1.default);
            }
        });
        it('Should allow Ops team access to entity on shared cluster', async () => {
            expect.assertions(1);
            try {
                const result = await acl_utils_1.verifyUserAccessEntity(opsUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, teamKeyspaceName, false);
                expect(result).toBeUndefined();
            }
            catch (err) {
                // no-op
            }
        });
        it('Should allow Ops team access to entity without owners', async () => {
            expect.assertions(1);
            try {
                const result = await acl_utils_1.verifyUserAccessEntity(opsUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, 'keyspace_without_owners', false);
                expect(result).toBeUndefined();
            }
            catch (err) {
                // no-op
            }
        });
        it('Should not allow general access to entity without owners', async () => {
            expect.assertions(1);
            try {
                await acl_utils_1.verifyUserAccessEntity(generalUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, 'keyspace_without_owners', false);
            }
            catch (err) {
                expect(err).toBeInstanceOf(EntityNotAuthorizedError_1.default);
            }
        });
        it('Should not allow general access to team keyspace', async () => {
            expect.assertions(1);
            try {
                await acl_utils_1.verifyUserAccessEntity(generalUser, store_1.sharedCluster.cluster, enums_1.EntityType.KEYSPACE, teamKeyspaceName, false);
            }
            catch (err) {
                expect(err).toBeInstanceOf(EntityNotAuthorizedError_1.default);
            }
        });
    });
});
//# sourceMappingURL=acl-utils.spec.js.map