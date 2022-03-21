"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const BaseDiscoveryProvider_1 = __importDefault(require("@/services/discovery/providers/BaseDiscoveryProvider"));
const logger = logger_1.default(module);
/**
 * An environment variable based DiscoveryService.
 *
 * This implementation provides a simple way to connect to datastores using hostnames/IPs
 * pulled from the environment.
 */
class EnvironmentDiscoveryProvider extends BaseDiscoveryProvider_1.default {
    constructor(port) {
        super();
        this.port = port;
    }
    /**
     * @inheritdoc
     */
    start() {
        const { SUPPORTED_DATASTORE_TYPES, DISCOVERY_PROVIDER_ENVIRONMENT_CASSANDRA_HOST, DISCOVERY_PROVIDER_ENVIRONMENT_REDIS_HOST, } = configuration_1.getConfig();
        const cassandraHost = process.env[DISCOVERY_PROVIDER_ENVIRONMENT_CASSANDRA_HOST];
        const redisHost = process.env[DISCOVERY_PROVIDER_ENVIRONMENT_REDIS_HOST];
        const clusters = new Array();
        if (SUPPORTED_DATASTORE_TYPES.includes('cassandra')) {
            logger.info(`Using cassandra host: ${cassandraHost}`);
            if (!cassandraHost) {
                throw new Error(`${DISCOVERY_PROVIDER_ENVIRONMENT_CASSANDRA_HOST} environment variable not set.`);
            }
            clusters.push(this.buildCluster(cassandraHost, cassandraHost, 'cassandra'));
        }
        if (SUPPORTED_DATASTORE_TYPES.includes('dynomite') ||
            SUPPORTED_DATASTORE_TYPES.includes('redis')) {
            logger.info(`Using redis host: ${redisHost}`);
            if (!redisHost) {
                throw new Error(`${DISCOVERY_PROVIDER_ENVIRONMENT_REDIS_HOST} environment variable not set.`);
            }
            clusters.push(this.buildCluster(redisHost, redisHost, 'dynomite'));
        }
        this.clusters = clusters;
        this.environments = ['local'];
        this.regions = ['local'];
    }
    buildCluster(name, ip, type) {
        return {
            name,
            env: 'local',
            region: 'local',
            datastoreType: type,
            instances: [
                {
                    az: 'local',
                    hostname: name,
                    ip,
                    status: 'UP',
                    stack: '',
                },
            ],
        };
    }
}
exports.default = EnvironmentDiscoveryProvider;
//# sourceMappingURL=EnvironmentDiscoveryProvider.js.map