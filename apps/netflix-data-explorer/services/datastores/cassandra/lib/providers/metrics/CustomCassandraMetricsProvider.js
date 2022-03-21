"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomCassandraMetricsProvider {
    async getClusterKeyspacesMetrics(_cluster) {
        throw new Error('CustomCassandraMetricsProvider must implement getClusterKeyspacesMetrics()');
    }
    async getKeyspaceTablesMetrics(_cluster, _keyspace, _range, _step) {
        throw new Error('CustomCassandraMetricsProvider must implement getKeyspaceTablesMetrics()');
    }
    async getTableMetrics(_cluster, _keyspace, _table, _range, _step) {
        throw new Error('CustomCassandraMetricsProvider must implement getTableMetrics()');
    }
}
exports.default = CustomCassandraMetricsProvider;
//# sourceMappingURL=CustomCassandraMetricsProvider.js.map