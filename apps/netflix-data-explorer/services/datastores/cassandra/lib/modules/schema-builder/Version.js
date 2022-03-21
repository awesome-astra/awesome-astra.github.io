"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versions = exports.Version = void 0;
class Version {
    constructor(versionString) {
        this.versionString = versionString;
    }
    isV2x() {
        return this.versionString.startsWith('2');
    }
    isV3x() {
        return this.versionString.startsWith('3');
    }
    toString() {
        return this.versionString;
    }
}
exports.Version = Version;
/**
 * Exposes some convenience properties for version checking.
 */
exports.Versions = {
    v2x: new Version('2'),
    v3x: new Version('3'),
};
//# sourceMappingURL=Version.js.map