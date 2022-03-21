"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const BaseDiscoveryProvider_1 = __importDefault(require("@/services/discovery/providers/BaseDiscoveryProvider"));
const fs_1 = require("fs");
const ajv_1 = __importDefault(require("ajv"));
const util_1 = require("util");
const readFileAsync = util_1.promisify(fs_1.readFile);
const { DISCOVERY_PROVIDER_FILESYSTEM_SOURCE } = configuration_1.getConfig();
const logger = logger_1.default(module);
/**
 * A filesystem based implementation of the DiscoveryStrategy.
 *
 * This implementation provides a way to discovery Dynomite clusters using
 * a file on the filesystem. Once 'load' is called, this instance
 * will watch the given file for changes. Any updates to the file will
 * update to the list of clusters.
 */
class FileSystemDiscoveryProvider extends BaseDiscoveryProvider_1.default {
    constructor() {
        super(...arguments);
        this.discoverySchema = undefined;
        this.discoveryJson = `./data/${DISCOVERY_PROVIDER_FILESYSTEM_SOURCE}`;
    }
    /**
     * @inheritdoc
     */
    start() {
        if (!fs_1.existsSync(this.discoveryJson)) {
            throw new Error(`Could not find discovery file: ${this.discoveryJson}`);
        }
        fs_1.watch(this.discoveryJson, (eventType, filename) => {
            if (filename && eventType === 'change') {
                logger.info(`detected change to ${this.discoveryJson}`);
                this.readDiscoveryFile();
            }
        });
        this.readDiscoveryFile();
    }
    async readDiscoveryFile() {
        var _a;
        try {
            if (!this.discoverySchema) {
                this.discoverySchema = await readFileAsync('schema/discovery-schema.json', 'utf-8');
            }
            const data = await readFileAsync(this.discoveryJson, 'utf8');
            const clusters = JSON.parse(data);
            const validator = new ajv_1.default({
                allErrors: true,
                strict: false,
            });
            const validate = validator.compile(JSON.parse(this.discoverySchema));
            const isValid = await validate(clusters);
            if (!isValid) {
                const errorMsgs = ((_a = validate === null || validate === void 0 ? void 0 : validate.errors) !== null && _a !== void 0 ? _a : [])
                    .map((error) => `  [${error.dataPath}] - ${error.message}`)
                    .join('; ');
                logger.error(errorMsgs);
                throw new Error('Invalid content found in discovery file');
            }
            this.clusters = clusters;
        }
        catch (err) {
            this.emit('error', err);
        }
    }
}
exports.default = FileSystemDiscoveryProvider;
//# sourceMappingURL=FileSystemDiscoveryProvider.js.map