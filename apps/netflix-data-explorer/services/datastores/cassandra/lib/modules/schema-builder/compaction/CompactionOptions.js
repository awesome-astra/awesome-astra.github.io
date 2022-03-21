"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompactionOptions {
    constructor(strategy) {
        this.strategy = strategy;
    }
    build() {
        const options = [
            ...this._buildCommonOptions(),
            ...this.buildSpecificOptions(),
        ];
        return `{ ${options.join(', ')} }`;
    }
    _buildCommonOptions() {
        const options = [];
        options.push(`'class': '${this.strategy}'`);
        return options;
    }
}
exports.default = CompactionOptions;
//# sourceMappingURL=CompactionOptions.js.map