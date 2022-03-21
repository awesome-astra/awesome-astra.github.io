"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const EntityNotAuthorizedError_1 = __importDefault(require("@/model/errors/EntityNotAuthorizedError"));
const errors_1 = require("@/services/datastores/cassandra/lib/errors");
const result_utils_1 = require("@/services/datastores/cassandra/lib/utils/result-utils");
const enums_1 = require("@/typings/enums");
const cde_utils_1 = require("@/utils/cde-utils");
const request_utils_1 = require("@/utils/request-utils");
const express_1 = require("express");
const CassandraResultsExporter_1 = __importDefault(require("../keyspaces/tables/keys/CassandraResultsExporter"));
const logger = logger_1.default(module);
const router = express_1.Router();
router.post('/', async (req, res, next) => {
    const { user, cluster, body } = req;
    logger.info(`submitted free form query: ${body.query}`, req);
    const keyspaces = await req.cassandraApi.getKeyspaces();
    const clusterAccess = await cde_utils_1.getCassandraAccess(user, cluster, keyspaces);
    try {
        const generateFile = request_utils_1.getQueryAsString(req, 'generateFile');
        const truncate = request_utils_1.getQueryAsString(req, 'truncate');
        const format = request_utils_1.getQueryAsString(req, 'format');
        const keyQueryOptions = req.body.options;
        const result = await req.cassandraApi.execute(req.body.query.trim(), clusterAccess, req, {
            enforceQueryRestrictions: true,
            includeSchema: true,
            keyQueryOptions,
        });
        const { columns, rows, schema } = result;
        if (format && schema) {
            new CassandraResultsExporter_1.default(schema, cluster, req.cassandraApi)
                .build(columns, rows, {
                primaryKey: {},
                options: keyQueryOptions,
            })
                .send(res, format, !!generateFile && generateFile === 'true');
        }
        else if (truncate && schema) {
            res.json(result_utils_1.truncateResults(result, schema, truncate));
        }
        else {
            res.json(result);
        }
    }
    catch (err) {
        if (err instanceof errors_1.CassandraKeyspaceNotAccessible) {
            return next(new EntityNotAuthorizedError_1.default(cluster, enums_1.EntityType.KEYSPACE, err.keyspace));
        }
        logger.info(`failed to execute query "${req.body.query}" due to: "${err.message}"`, req);
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map