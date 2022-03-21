"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestrictedQueries = void 0;
const i18n_1 = require("@/i18n");
function getRestrictedQueries() {
    return [
        {
            message: i18n_1.t('query.queryNotSupported', {
                command: 'ALTER',
            }),
            regex: 'alter\\s+(keyspace|table|user)',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'BATCH' }),
            regex: 'begin\\s+batch',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'CREATE INDEX' }),
            regex: 'create\\s+(custom\\s)?index',
        },
        {
            message: 'Using "DROP TABLE" is not recommended. Please visit the table detail view where the DROP TABLE wizard will assist you.',
            regex: 'drop\\s+table',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'DROP' }),
            regex: 'drop\\s+(index|keyspace|user)',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'GRANT' }),
            regex: 'grant\\s+(all|alter|authorize|create|drop|modify|select)',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'LIST' }),
            regex: 'list\\s+(permissions|users)',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'REVOKE' }),
            regex: 'revoke\\s+(all|alter|authorize|create|drop|modify|select)',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'USE KEYSPACE' }),
            regex: 'use\\s+\\w+$',
        },
        {
            message: `Using "CREATE KEYSPACE" is not recommended. Please visit the list of keyspaces where
    you can create a new keyspace using the recommended settings.`,
            regex: 'create\\s+keyspace',
        },
        {
            message: `Using "CREATE TABLE" is not recommended. Please visit the list of tables in the
    keyspace where you want to create your new table. The CREATE TABLE wizard will assist you
    with creating your new table.`,
            regex: 'create\\s+table',
        },
        {
            message: i18n_1.t('query.queryNotSupported', { command: 'TRUNCATE' }),
            regex: 'truncate\\s+',
        },
    ];
}
exports.getRestrictedQueries = getRestrictedQueries;
//# sourceMappingURL=restricted-queries.js.map