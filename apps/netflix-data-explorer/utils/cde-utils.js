"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCassandraAccess = void 0;
const enums_1 = require("@/typings/enums");
const acl_utils_1 = require("@/utils/acl-utils");
const app_utils_1 = require("@/utils/app-utils");
/**
 * Helper method for building out the necessary Cassandra access information used for restricting
 * access to keyspaces on shared clusters.
 * @param user         The user's info.
 * @param cluster      The cluster being accessed.
 * @param allKeyspaces The list of all available keyspaces on this cluster.
 * @returns Returns an access definition object that will contain the shared flag and the list of
 * user permitted keyspace names.
 */
async function getCassandraAccess(user, cluster, allKeyspaces) {
    const userKeyspaces = await acl_utils_1.filterAccessibleEntities(user, cluster, enums_1.EntityType.KEYSPACE, allKeyspaces.map((keyspace) => keyspace.name));
    return {
        isShared: app_utils_1.isClusterShared(cluster.name),
        userKeyspaceNames: userKeyspaces,
    };
}
exports.getCassandraAccess = getCassandraAccess;
//# sourceMappingURL=cde-utils.js.map