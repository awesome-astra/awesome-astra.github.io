"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const cassandra_driver_1 = require("cassandra-driver");
const NoRetryPolicy_1 = __importDefault(require("../../policies/NoRetryPolicy"));
const { CASSANDRA_BASE_AUTH_PROVIDER_USERNAME, CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD, } = configuration_1.getConfig();
class EC2CassandraClientOptionsProvider {
    getLocalDatacenter(region) {
        return region;
    }
    getAuthProvider(_username, _password) {
        if (CASSANDRA_BASE_AUTH_PROVIDER_USERNAME === undefined ||
            CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD === undefined) {
            return undefined;
        }
        // here we use the static values in the base configuration.
        return new cassandra_driver_1.auth.PlainTextAuthProvider(CASSANDRA_BASE_AUTH_PROVIDER_USERNAME, CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD);
    }
    getPolicies(region) {
        return {
            loadBalancing: new cassandra_driver_1.policies.loadBalancing.DCAwareRoundRobinPolicy(region),
            addressResolution: new cassandra_driver_1.policies.addressResolution.EC2MultiRegionTranslator(),
            retry: new NoRetryPolicy_1.default(),
        };
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
exports.default = EC2CassandraClientOptionsProvider;
//# sourceMappingURL=EC2CassandraClientOptionsProvider.js.map