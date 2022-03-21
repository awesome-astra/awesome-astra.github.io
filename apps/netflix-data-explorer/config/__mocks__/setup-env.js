"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEnv = void 0;
const constants_1 = require("@/config/constants");
const setupEnv = (app) => {
    // TODO revisit environment variables
    app.set(constants_1.APP_REGION, 'us-east-1');
    app.set(constants_1.APP_ENV, 'test');
    app.set(constants_1.APP_NAME, 'nf-data-explorer-2');
    app.set(constants_1.APP_CLUSTER_NAME, 'nfdataexplorer2');
};
exports.setupEnv = setupEnv;
//# sourceMappingURL=setup-env.js.map