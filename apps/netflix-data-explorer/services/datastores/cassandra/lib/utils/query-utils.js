"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAllResults = void 0;
/**
 * Helper method for streaming all query results. Expected to be a SELECT statement.
 *
 * NOTE: extreme caution should be used with this method and should only be used
 * for internal queries on small result sets (e.g. lists of keyspaces, tables, etc.).
 * End users shouldn't be allowed to execute a streamed query (we force them to
 * paginate manually).
 *
 * @param client An existing client connection.
 * @param query The CQL SELECT query to execute.
 * @param rowCb A callback that will be executed on each row allowing the caller to
 *              transform the resulting data.
 */
function streamAllResults(client, query, params, rowCb) {
    return new Promise((resolve, reject) => {
        const allRows = new Array();
        let isError = false;
        client
            .stream(query, params, {
            fetchSize: 100,
        })
            .on('readable', function () {
            let row;
            while ((row = this.read())) {
                allRows.push(rowCb(row));
            }
        })
            .on('error', (err) => {
            isError = true;
            reject(err);
        })
            .on('end', () => {
            if (!isError) {
                resolve(allRows);
            }
        });
    });
}
exports.streamAllResults = streamAllResults;
//# sourceMappingURL=query-utils.js.map