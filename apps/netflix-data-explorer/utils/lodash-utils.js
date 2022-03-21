"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyByProp = exports.groupByProp = void 0;
const lodash_1 = require("lodash");
function groupByProp(items, prop) {
    return lodash_1.groupBy(items, prop);
}
exports.groupByProp = groupByProp;
function keyByProp(items, prop) {
    return lodash_1.keyBy(items, prop);
}
exports.keyByProp = keyByProp;
//# sourceMappingURL=lodash-utils.js.map