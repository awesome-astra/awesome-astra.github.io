"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const cassandra_driver_1 = require("cassandra-driver");
const { CASSANDRA_BASE_AUTH_PROVIDER_USERNAME, CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD, } = configuration_1.getConfig();
class LocalCassandraClientOptionsProvider {
    getLocalDatacenter(_region) {
        return 'datacenter1';
    }
    getAuthProvider(_username, _password) {
        if (CASSANDRA_BASE_AUTH_PROVIDER_USERNAME === undefined ||
            CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD === undefined) {
            return undefined;
        }
        // here we use the static values in the base configuration.
        return new cassandra_driver_1.auth.PlainTextAuthProvider(CASSANDRA_BASE_AUTH_PROVIDER_USERNAME, CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD);
    }
    getPolicies(_region) {
        return undefined;
    }
    getPoolingOptions() {
        return undefined;
    }
    getSocketOptions() {
        return undefined;
    }
    async getSslOptions(_params) {
        return undefined;
    }
}
exports.default = LocalCassandraClientOptionsProvider;
//# sourceMappingURL=LocalCassandraClientOptionsProvider.js.map