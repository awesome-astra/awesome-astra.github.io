"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.isVersion3 = void 0;
/**
 * Checks if the current client's connection is version 3. Assumes the client is already connected.
 * @return True if the connection is to a CQL 3.x system.
 */
function isVersion3(client) {
    return (getVersion(client).startsWith('3.') || getVersion(client).startsWith('4.'));
}
exports.isVersion3 = isVersion3;
function getVersion(client) {
    return client.controlConnection.host.cassandraVersion;
}
exports.getVersion = getVersion;
//# sourceMappingURL=cluster-utils.js.map