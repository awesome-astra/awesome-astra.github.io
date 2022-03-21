"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cursor {
    constructor(hostnames) {
        this.hostCursors = {};
        hostnames.forEach((hostname) => {
            this.hostCursors[hostname] = null;
        });
    }
    static fromClientCursor(cursorObj) {
        var _a;
        const hostnames = Object.keys((_a = cursorObj.cursors) !== null && _a !== void 0 ? _a : {});
        const cursor = new Cursor(hostnames);
        hostnames.forEach((hostname) => {
            var _a, _b;
            const cursorValue = (_b = (_a = cursorObj.cursors) === null || _a === void 0 ? void 0 : _a[hostname]) !== null && _b !== void 0 ? _b : null;
            cursor.updateCursor(hostname, cursorValue);
        });
        return cursor;
    }
    getCursor(hostname) {
        return this.hostCursors[hostname];
    }
    getFirstIncomplete() {
        let cursor = null;
        const hostnames = Object.keys(this.hostCursors);
        for (const hostname of hostnames) {
            const value = this.hostCursors[hostname];
            if (value !== 0) {
                cursor = { host: hostname, cursor: value };
                break;
            }
        }
        return cursor;
    }
    updateCursor(host, cursorValue) {
        this.hostCursors[host] = cursorValue;
    }
    isComplete() {
        const isComplete = Object.keys(this.hostCursors).every((hostname) => {
            const cursorValue = this.hostCursors[hostname];
            return cursorValue === null || +cursorValue === 0;
        });
        return isComplete;
    }
    /**
     * Returns a client cursor suitable to return to the user.
     */
    toClientCursor() {
        const cursors = {};
        Object.keys(this.hostCursors).forEach((hostname) => {
            const cursorValue = this.hostCursors[hostname];
            cursors[hostname] = cursorValue;
        });
        return { complete: this.isComplete(), cursors };
    }
}
exports.default = Cursor;
//# sourceMappingURL=Cursor.js.map