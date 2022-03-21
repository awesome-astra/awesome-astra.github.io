"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHeaders = void 0;
const configuration_1 = require("@/config/configuration");
const { REQUEST_HEADER_CLIENT_APP, REQUEST_HEADER_ACCESS_TOKEN, REQUEST_HEADER_EMAIL, } = configuration_1.getConfig();
exports.userHeaders = {
    [REQUEST_HEADER_CLIENT_APP]: 'nfdataexplorer2',
    [REQUEST_HEADER_ACCESS_TOKEN]: 'dummy.token',
    [REQUEST_HEADER_EMAIL]: 'jill@netflix.com',
};
//# sourceMappingURL=auth-helper.js.map