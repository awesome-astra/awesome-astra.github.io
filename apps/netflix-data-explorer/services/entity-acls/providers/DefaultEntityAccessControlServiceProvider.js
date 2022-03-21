"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultEntityAccessControlServiceProvider {
    async getEntityOwners(_clusterName, _env, _type, _entityName) {
        return [];
    }
    async setEntityOwners(_clusterName, _env, _type, _entityName, _owners) {
        return;
    }
}
exports.default = DefaultEntityAccessControlServiceProvider;
//# sourceMappingURL=DefaultEntityAccessControlServiceProvider.js.map