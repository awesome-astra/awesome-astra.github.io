"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMiddleware = void 0;
const configuration_1 = require("@/config/configuration");
const AuthenticationError_1 = __importDefault(require("@/model/errors/AuthenticationError"));
const auth_utils_1 = require("@/utils/auth-utils");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = require("helmet");
const path_1 = __importDefault(require("path"));
const services_1 = require("./services");
async function getUserFromRequest(req) {
    const { REQUEST_HEADER_ACCESS_TOKEN, REQUEST_HEADER_CLIENT_APP, REQUEST_HEADER_CLIENT_CERT_VERIFY, REQUEST_HEADER_EMAIL, } = configuration_1.getConfig();
    const email = req.header(REQUEST_HEADER_EMAIL);
    const isCertificateValid = req.header(REQUEST_HEADER_CLIENT_CERT_VERIFY) === 'SUCCESS';
    if (!email && !isCertificateValid) {
        throw new AuthenticationError_1.default('Failed to authenticate due to missing token', 'Please specify a user or certificate token');
    }
    if (email) {
        const application = req.header(REQUEST_HEADER_CLIENT_APP);
        const accessToken = req.header(REQUEST_HEADER_ACCESS_TOKEN);
        const googleGroups = await services_1.getUserGroupCache().getUserGroups(email, accessToken);
        return {
            email,
            application,
            googleGroups,
            isAdmin: auth_utils_1.isAdministrator(email, googleGroups),
        };
    }
    else {
        return {
            email,
            application: email,
            googleGroups: [],
            isAdmin: true,
        };
    }
}
async function userMiddleware(req, _res, next) {
    const { REQUIRE_AUTHENTICATION } = configuration_1.getConfig();
    try {
        if (REQUIRE_AUTHENTICATION) {
            req.user = await getUserFromRequest(req);
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
function redirectHttpToHttps(req, res, next) {
    if (process.env.NODE_ENV !== 'production' ||
        req.secure ||
        req.headers['x-forwarded-proto'] === 'https' ||
        req.url.match(/^(\/REST)?\/healthcheck/)) {
        next();
    }
    else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
}
function setupMiddleware(app) {
    app.use(helmet_1.hidePoweredBy());
    app.use(compression_1.default());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.use(cors_1.default());
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
    app.use(userMiddleware);
    app.use(redirectHttpToHttps);
}
exports.setupMiddleware = setupMiddleware;
//# sourceMappingURL=middlewares.js.map