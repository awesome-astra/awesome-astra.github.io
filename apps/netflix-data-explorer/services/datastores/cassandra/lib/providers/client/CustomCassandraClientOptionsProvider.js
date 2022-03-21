"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomCassandraClientOptionsProvider {
    getLocalDatacenter(_region) {
        throw new Error('CustomCassandraClientOptionsProvider must implement getLocalDatacenter()');
    }
    getAuthProvider(_username, _password) {
        throw new Error('CustomCassandraClientOptionsProvider must implement getAuthProvider()');
    }
    getPolicies(_region) {
        throw new Error('CustomCassandraClientOptionsProvider must implement getPolicies()');
    }
    getPoolingOptions() {
        throw new Error('CustomCassandraClientOptionsProvider must implement getPolicies()');
    }
    getSocketOptions() {
        throw new Error('CustomCassandraClientOptionsProvider must implement getPolicies()');
    }
    async getSslOptions(_params) {
        return undefined;
    }
}
exports.default = CustomCassandraClientOptionsProvider;
//# sourceMappingURL=CustomCassandraClientOptionsProvider.js.map