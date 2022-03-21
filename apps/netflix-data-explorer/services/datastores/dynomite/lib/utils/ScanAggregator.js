"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ScanResult wraps a Cursor and aggregates results.
 */
class ScanAggregator {
    constructor(cursor) {
        this.cursor = cursor;
        this.results = new Array();
        this.numScans = 0;
    }
    get scanCount() {
        return this.numScans;
    }
    get total() {
        return this.results.length;
    }
    /**
     * Updates this scan result with the results from the given host. Also updates the Cursor with the
     * next cursor value if there are more results.
     * @param host
     * @param nextCursor
     * @param results
     * @returns Returns this instance to simplify chaining.
     */
    addHostScanResults(host, nextCursor, results) {
        this.numScans += 1;
        this.cursor.updateCursor(host, nextCursor);
        this.results = this.results.concat(results);
        return this;
    }
}
exports.default = ScanAggregator;
//# sourceMappingURL=ScanAggregator.js.map