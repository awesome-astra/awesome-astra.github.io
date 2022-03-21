"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("@/config/configuration");
const logger_1 = __importDefault(require("@/config/logger"));
const result_utils_1 = require("@/services/datastores/cassandra/lib/utils/result-utils");
const request_utils_1 = require("@/utils/request-utils");
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const util_1 = require("util");
const CassandraResultsExporter_1 = __importDefault(require("./CassandraResultsExporter"));
const { MAX_FILE_UPLOAD } = configuration_1.getConfig();
const readFile = util_1.promisify(fs_1.default.readFile);
const logger = logger_1.default(module);
const router = express_1.Router();
const upload = multer_1.default({
    dest: 'uploads/',
    limits: {
        fileSize: MAX_FILE_UPLOAD,
    },
});
/**
 * Queries the specified table using the given primary key components.
 */
router.post('/', async (req, res, next) => {
    const { cluster, keyspaceName, tableName, body, query } = req;
    logger.info(`fetching keys from table: ${keyspaceName}.${req.tableName}. params=${JSON.stringify(req.body)}`, req);
    try {
        const pageState = request_utils_1.getQueryAsString(req, 'pageState');
        const generateFile = request_utils_1.getQueryAsString(req, 'generateFile');
        const truncate = request_utils_1.getQueryAsString(req, 'truncate');
        const format = query.format;
        const filter = body;
        const keys = await req.cassandraApi.getKeys(keyspaceName, tableName, filter, pageState, req);
        if (format) {
            const schema = await req.cassandraApi.getTable(keyspaceName, tableName);
            const { columns, rows } = keys;
            new CassandraResultsExporter_1.default(schema, cluster, req.cassandraApi)
                .build(columns, rows, body)
                .send(res, format, !!generateFile && generateFile === 'true');
        }
        else if (truncate) {
            const schema = await req.cassandraApi.getTable(keyspaceName, tableName);
            res.json(result_utils_1.truncateResults(keys, schema, truncate));
        }
        else {
            res.json(keys);
        }
    }
    catch (err) {
        logger.error(`failed to fetch keys from table ${keyspaceName}.${req.tableName} due to: "${err.message}"`, err);
        next(err);
    }
});
/**
 * Inserts a new record into the given table using the given primary key components.
 */
router.post('/create', upload.any(), async (req, res, next) => {
    var _a;
    logger.info('inserting row', req);
    const { keyspaceName, tableName } = req;
    const schema = await req.cassandraApi.getTable(keyspaceName, tableName);
    const { columns } = schema;
    let row = {};
    if ((_a = req.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('multipart')) {
        if (req.files && req.files instanceof Array) {
            const promises = req.files.map((file) => {
                return readFile(file.path).then((buffer) => ({
                    field: file.fieldname,
                    buffer,
                }));
            });
            const results = await Promise.all(promises);
            row = columns.reduce((prev, column) => {
                const { name } = column;
                prev[name] = {
                    options: {
                        encoding: req.body[`${name}.encoding`],
                    },
                    value: req.body[name],
                };
                return prev;
            }, {});
            results.forEach((result) => {
                row[result.field] = {
                    options: {
                        encoding: 'hex',
                    },
                    value: result.buffer,
                };
            });
        }
    }
    else {
        row = req.body.fields;
    }
    try {
        const success = await req.cassandraApi.insertKey(req.keyspaceName, req.tableName, row, req);
        res.json({ success });
    }
    catch (err) {
        logger.error(`failed to insert into ${req.keyspaceName}.${req.tableName} due to: "${err.message}"`, err);
        next(err);
    }
});
/**
 * Updates a record in the given table using the given primary key components.
 */
router.put('/', async (req, res, next) => {
    logger.info('updating row', req);
    const { keyspaceName, tableName, body } = req;
    const { primaryKeyQuery, fields } = body;
    const query = primaryKeyQuery;
    try {
        const success = await req.cassandraApi.updateKey(keyspaceName, tableName, query, fields, req);
        res.json({ success });
    }
    catch (err) {
        logger.error(`failed to update ${keyspaceName}.${tableName} due to: "${err.message}"`, err);
        next(err);
    }
});
/**
 * Deletes an existing record given the primary key components.
 */
router.delete('/', async (req, res, next) => {
    logger.info('deleting row', req);
    const { keyspaceName, tableName, body } = req;
    try {
        const success = await req.cassandraApi.deleteKey(keyspaceName, tableName, body.primaryKeyQuery, req);
        res.json({ success });
    }
    catch (err) {
        logger.error(`failed to delete ${keyspaceName}.${tableName} due to: "${err.message}"`, err);
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map