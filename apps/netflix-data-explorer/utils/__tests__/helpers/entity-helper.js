"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestKeyspace = void 0;
const enums_1 = require("@/typings/enums");
function createTestKeyspace(cluster, env, entityName, owners) {
    return createTestEntity(cluster, env, entityName, owners, enums_1.EntityType.KEYSPACE);
}
exports.createTestKeyspace = createTestKeyspace;
function createTestEntity(cluster, env, entityName, owners, type) {
    return {
        clusterName: cluster,
        env,
        name: entityName,
        owners,
        type: enums_1.EntityType[type],
    };
}
//# sourceMappingURL=entity-helper.js.map