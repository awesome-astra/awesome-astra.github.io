"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAccessibleEntities = exports.verifyUserAccessEntity = exports.verifyUserCanAccessCluster = exports.canUserAccessCluster = void 0;
const configuration_1 = require("@/config/configuration");
const services_1 = require("@/config/services");
const ClusterAclsNotLoadedError_1 = __importDefault(require("@/model/errors/ClusterAclsNotLoadedError"));
const ClusterNotAuthorizedError_1 = __importDefault(require("@/model/errors/ClusterNotAuthorizedError"));
const EntityNotAuthorizedError_1 = __importDefault(require("@/model/errors/EntityNotAuthorizedError"));
const store_1 = require("@/model/store");
const app_utils_1 = require("@/utils/app-utils");
const user_utils_1 = require("@/utils/user-utils");
/**
 * Checks to see if a given user request can access a given cluster.
 * @param user          The user info.
 * @param cluster       The cluster to access.
 * @return Returns true if the user can access the given cluster.
 * @throws {Error}      If access control information isn't available for the cluster.
 * @throws {Error}      If the user doesn't have any group information.
 */
function canUserAccessCluster(user, cluster) {
    const { ALL_CLUSTERS_MEMBERS, CLUSTER_ACCESS_CONTROL_ENABLED, RESTRICTED_CLUSTERS, UNRESTRICTED_CLUSTERS, REQUIRE_AUTHENTICATION, } = configuration_1.getConfig();
    const clusterName = cluster.name;
    if (!REQUIRE_AUTHENTICATION || !CLUSTER_ACCESS_CONTROL_ENABLED) {
        return true;
    }
    const clusterAclDef = getClusterAclDef(clusterName);
    if (!clusterAclDef) {
        return false;
    }
    // when we check user access to clusters, we also merge in the groups that allow all access
    const clusterAllowedGroups = new Array().concat(clusterAclDef.owners, ALL_CLUSTERS_MEMBERS);
    const userAuthorized = user_utils_1.isUserAuthorized(user, clusterAllowedGroups);
    const isClusterRestricted = RESTRICTED_CLUSTERS.includes(clusterName.toLowerCase());
    const isClusterUnrestricted = clusterAclDef.isShared ||
        UNRESTRICTED_CLUSTERS.includes(clusterName.toLowerCase());
    return (userAuthorized || isClusterUnrestricted) && !isClusterRestricted;
}
exports.canUserAccessCluster = canUserAccessCluster;
/**
 * Checks if the user's request allows access to a given cluster. Will throw a
 * `ClusterNotAuthorizedError` if the user isn't authorized.
 * @param user          The user info.
 * @param cluster       The cluster to access.
 * @param store         The store containing the app state.
 */
function verifyUserCanAccessCluster(user, cluster) {
    if (!canUserAccessCluster(user, cluster)) {
        throw new ClusterNotAuthorizedError_1.default(user.email, cluster);
    }
}
exports.verifyUserCanAccessCluster = verifyUserCanAccessCluster;
/**
 * Checks to see if a user is authorized to access a given entity.
 * @param user              The user info.
 * @param cluster           The cluster that owns the entity in question.
 * @param entityType        The type of entity.
 * @param entityName        The name of the entity.
 * @param useLocalCacheOnly Flag to indicate if the currently cached value must be used.
 *                          If not present in the cache, no network request will be made.
 *                          Defaults to false (use the cache if present, but fallback to network).
 */
async function canUserAccessEntity(user, cluster, entityType, entityName, useLocalCacheOnly = false) {
    var _a;
    const { ALL_ENTITY_MEMBERS } = configuration_1.getConfig();
    verifyUserCanAccessCluster(user, cluster);
    if (!app_utils_1.isClusterShared(cluster.name)) {
        return true;
    }
    const ownership = await getEntityOwnership(cluster.name, cluster.env, entityType, entityName, useLocalCacheOnly);
    const owners = (_a = ownership === null || ownership === void 0 ? void 0 : ownership.owners) !== null && _a !== void 0 ? _a : [];
    const entityAllowedGroups = new Array().concat(owners, ALL_ENTITY_MEMBERS);
    return user_utils_1.isUserAuthorized(user, entityAllowedGroups);
}
/**
 * Verifies that a user has access to the given entity. If the user does not have access,
 * this will throw an `EntityNotAuthorizedError`.
 * @param user              The user's info.
 * @param cluster           The cluster that owns the entity in question.
 * @param entityType        The type of entity.
 * @param entityName        The name of the entity.
 * @param useLocalCacheOnly Flag to indicate if the currently cached value must be used.
 *                          If not present in the cache, no network request will be made.
 *                          Defaults to false (use the cache if present, but fallback to network).
 */
async function verifyUserAccessEntity(user, cluster, entityType, entityName, useLocalCacheOnly = false) {
    try {
        const canAccess = await canUserAccessEntity(user, cluster, entityType, entityName, useLocalCacheOnly);
        if (!canAccess) {
            throw new EntityNotAuthorizedError_1.default(cluster, entityType, entityName);
        }
    }
    catch (err) {
        throw err;
    }
}
exports.verifyUserAccessEntity = verifyUserAccessEntity;
/**
 * Convenience method for filtering a list of entity names (of the same type) down to just the
 * ones the given user is permitted to access.
 * @param user        The user's info.
 * @param entityTypes The type of all the given entities.
 * @param entityNames The unique names of each of the entities.
 */
async function filterAccessibleEntities(user, cluster, entityTypes, entityNames) {
    // refresh the cache, then check access using the current local cache
    await services_1.getEntityAccessControlCache().refresh();
    const access = await Promise.all(entityNames.map(async (entityName) => await canUserAccessEntity(user, cluster, entityTypes, entityName, true)));
    return new Set(entityNames.filter((name, index) => access[index]));
}
exports.filterAccessibleEntities = filterAccessibleEntities;
function getClusterAclDef(clusterName) {
    const { accessControl } = store_1.getStore();
    const clusterAclMap = accessControl.clusterAclMap;
    if (!clusterAclMap) {
        throw new ClusterAclsNotLoadedError_1.default(clusterName);
    }
    return clusterAclMap[clusterName.toLowerCase()] || undefined;
}
/**
 * Fetches any defined entity ownership information for the specified cluster, type, and name.
 */
async function getEntityOwnership(clusterName, env, entityType, entityName, useLocalCacheOnly) {
    const cache = services_1.getEntityAccessControlCache();
    const entity = useLocalCacheOnly
        ? await cache.getIfPresent(clusterName, env, entityType, entityName)
        : await cache.get(clusterName, env, entityType, entityName);
    return entity;
}
//# sourceMappingURL=acl-utils.js.map