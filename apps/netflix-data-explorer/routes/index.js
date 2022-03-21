"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("@/routes/admin"));
const datastores_1 = __importDefault(require("@/routes/datastores"));
const env_1 = __importDefault(require("@/routes/env"));
const i18n_1 = __importDefault(require("@/routes/i18n"));
const user_1 = __importDefault(require("@/routes/user"));
const AdminCredentialsRequiredError_1 = __importDefault(require("@/services/datastores/base/errors/AdminCredentialsRequiredError"));
const shared_constants_1 = require("@/shared/shared-constants");
const express_1 = require("express");
const router = express_1.Router();
/**
 * Middleware function that requires a user to be an administrator to perform the function.
 * Currently, uses a simple white list of administrator emails.
 */
function isAdmin(req, _res, next) {
    if (req.user && shared_constants_1.ADMIN_MEMBERS.indexOf(req.user.email) >= 0) {
        return next();
    }
    return next(new AdminCredentialsRequiredError_1.default());
}
router.use('/env', env_1.default);
router.use('/i18n', i18n_1.default);
router.use('/user', user_1.default);
router.use('/datastores', datastores_1.default);
router.use('/admin', [isAdmin], admin_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map