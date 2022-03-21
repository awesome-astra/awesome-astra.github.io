"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = exports.difference = exports.intersection = void 0;
function intersection(setA, setB) {
    const intersecting = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            intersecting.add(elem);
        }
    }
    return intersecting;
}
exports.intersection = intersection;
function difference(setA, setB) {
    const diff = new Set(setA);
    setB.forEach((item) => diff.delete(item));
    return diff;
}
exports.difference = difference;
function union(setA, setB) {
    const unionSet = new Set(setA);
    setB.forEach((item) => unionSet.add(item));
    return unionSet;
}
exports.union = union;
//# sourceMappingURL=set-utils.js.map