"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDiscoveryProvider_1 = __importDefault(require("@/services/discovery/providers/BaseDiscoveryProvider"));
/**
 * A localhost based DiscoveryService.
 *
 * This implementation provides a simple way to connect to datastores running locally.
 */
class LocalDiscoveryProvider extends BaseDiscoveryProvider_1.default {
    constructor(port) {
        super();
        this.port = port;
    }
    /**
     * @inheritdoc
     */
    start() {
        this.clusters = [
            {
                name: 'cassandra',
                env: 'local',
                region: 'local',
                datastoreType: 'cassandra',
                instances: [
                    {
                        az: 'local',
                        hostname: 'cassandra',
                        ip: '127.0.0.1',
                        status: 'UP',
                        stack: '',
                    },
                ],
            },
            {
                name: 'dynomite',
                env: 'local',
                region: 'local',
                datastoreType: 'dynomite',
                instances: [
                    {
                        az: 'local',
                        hostname: 'dynomite',
                        ip: '127.0.0.1',
                        status: 'UP',
                        stack: '',
                    },
                ],
            },
        ];
        this.environments = ['local'];
        this.regions = ['local'];
    }
}
exports.default = LocalDiscoveryProvider;
//# sourceMappingURL=LocalDiscoveryProvider.js.map