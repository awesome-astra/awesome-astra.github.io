"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryAsStringArray = exports.getQueryAsString = exports.getQueryAsNumber = exports.getVueTablesQuery = exports.getReqUrl = exports.getReqProtocolAndHost = void 0;
function getReqProtocolAndHost(req) {
    return `${req.protocol}://${req.get('host')}`;
}
exports.getReqProtocolAndHost = getReqProtocolAndHost;
function getReqUrl(req) {
    return `${req.protocol}://${req.get('host')}${req.baseUrl}`;
}
exports.getReqUrl = getReqUrl;
function getVueTablesQuery(params) {
    var _a, _b, _c, _d, _e;
    return {
        ascending: parseInt((_a = params['ascending']) !== null && _a !== void 0 ? _a : 1, 10),
        byColumn: parseInt((_b = params['byColumn']) !== null && _b !== void 0 ? _b : 1, 10),
        limit: parseInt((_c = params['limit']) !== null && _c !== void 0 ? _c : 100, 10),
        orderBy: params['orderBy'],
        page: parseInt((_d = params['page']) !== null && _d !== void 0 ? _d : 1, 10),
        query: JSON.parse((_e = params['query']) !== null && _e !== void 0 ? _e : '{}'),
    };
}
exports.getVueTablesQuery = getVueTablesQuery;
function getQueryAsNumber(req, param, defaultValue = undefined) {
    const value = req.query[param];
    if (value !== undefined && typeof value === 'string' && value.length > 0) {
        return Number(value);
    }
    return defaultValue;
}
exports.getQueryAsNumber = getQueryAsNumber;
function getQueryAsString(req, param, defaultValue) {
    const value = req.query[param];
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }
    return defaultValue;
}
exports.getQueryAsString = getQueryAsString;
function getQueryAsStringArray(req, param, defaultValue = new Array()) {
    const value = req.query[param];
    return Array.isArray(value) ? value : defaultValue;
}
exports.getQueryAsStringArray = getQueryAsStringArray;
//# sourceMappingURL=request-utils.js.map