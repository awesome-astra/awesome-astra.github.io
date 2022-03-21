"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const CassandraExplorer_1 = __importDefault(require("@/services/datastores/cassandra/lib/CassandraExplorer"));
const cassandra_driver_1 = require("cassandra-driver");
const BaseDatastoreService_1 = __importDefault(require("../base/BaseDatastoreService"));
const { CLUSTER_NAME_PATTERN_CASSANDRA } = configuration_1.getConfig();
const logger = logger_1.default(module);
class CassandraDatastoreService extends BaseDatastoreService_1.default {
    constructor(clientOptionsProvider) {
        super();
        this.clientOptionsProvider = clientOptionsProvider;
    }
    getDatastoreType() {
        return 'cassandra';
    }
    connect(params) {
        const { clusterDescription, instances, region } = params;
        if (!instances) {
            return Promise.reject('instances must be provided');
        }
        return new Promise(async (resolve, reject) => {
            const contactPoints = new Array();
            const addressMap = {};
            instances.forEach((instance) => {
                if (instance.status === 'UP') {
                    contactPoints.push(instance.ip);
                }
                addressMap[instance.ip] = instance.hostname;
            });
            logger.info(`setting up new connection to ${params.clusterDescription}`);
            const { ASTRA_APPLICATION_TOKEN, ASTRA_SECURE_BUNDLE_NAME } = configuration_1.getConfig();
            const client = new cassandra_driver_1.Client({
                cloud: {
                    secureConnectBundle: `./uploads/${ASTRA_SECURE_BUNDLE_NAME}`,
                },
                credentials: {
                    username: 'token',
                    password: ASTRA_APPLICATION_TOKEN,
                },
            });
            client.on('log', (level, _module, message) => {
                if (level === 'verbose') {
                    return;
                }
                logger.debug(`-- [${level}] ${message}`);
            });
            client.on('hostAdd', (host) => {
                logger.debug(`cluster ${clusterDescription} added host: ${JSON.stringify(host)}`);
            });
            client.on('hostRemove', (host) => {
                logger.debug(`cluster ${clusterDescription} removed host: ${JSON.stringify(host)}`);
            });
            client.on('hostUp', (host) => {
                logger.debug(`cluster ${clusterDescription} detected host came up: ${JSON.stringify(host)}`);
            });
            client.on('hostDown', (host) => {
                logger.debug(`cluster ${clusterDescription} detected host went down: ${JSON.stringify(host)}`);
            });
            try {
                await client.connect();
                logger.info(client.toString());
            }
            catch (err) {
                logger.error(err);
                return reject(err);
            }
            resolve(new CassandraExplorer_1.default(client));
        });
    }
    discoveryCallback(appName) {
        return new RegExp(CLUSTER_NAME_PATTERN_CASSANDRA, 'i').test(appName);
    }
}
exports.default = CassandraDatastoreService;
//# sourceMappingURL=index.js.map