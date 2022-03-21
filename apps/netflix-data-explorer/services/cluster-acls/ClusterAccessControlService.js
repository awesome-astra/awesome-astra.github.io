"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const events_1 = require("events");
const { CLUSTER_ACCESS_CONTROL_ENABLED } = configuration_1.getConfig();
const logger = logger_1.default(module);
const DEFAULT_POLL_INTERVAL = 60 * 1000;
const ERROR_POLL_INTERVAL = 30 * 1000;
class ClusterAccessControlService extends events_1.EventEmitter {
    constructor(pollInterval = DEFAULT_POLL_INTERVAL) {
        super();
        this.pollInterval = pollInterval;
        this.provider = undefined;
        this.timeoutId = undefined;
    }
    /**
     * Specifies the provider to use responsible for fetching ACL information.
     * @param provider        Subclass of DataAccessControlProvider.
     */
    use(provider) {
        this.provider = provider;
    }
    start() {
        if (!this.provider) {
            throw new Error('provider has not been set. see use() method for details.');
        }
        if (!CLUSTER_ACCESS_CONTROL_ENABLED) {
            logger.warn('cluster ACL provider is disabled');
            this.emit('loaded', {});
            return Promise.resolve();
        }
        return this.pollClusters();
    }
    async refresh() {
        if (!this.provider) {
            throw new Error('provider has not been set. see use() method for details.');
        }
        await this.pollClusters();
    }
    async pollClusters() {
        logger.debug('retrieving ACL information...');
        try {
            if (!this.provider) {
                throw new Error('provider has not been set. see use() method for details.');
            }
            const clusterACL = await this.provider.getClusterAccessControl({});
            this.emit('loaded', clusterACL);
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(this.pollClusters.bind(this), this.pollInterval);
        }
        catch (err) {
            this.emit('error', err);
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(this.pollClusters.bind(this), ERROR_POLL_INTERVAL);
        }
    }
}
exports.default = ClusterAccessControlService;
//# sourceMappingURL=ClusterAccessControlService.js.map