"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@/config/logger"));
const shared_constants_1 = require("@/shared/shared-constants");
const express_1 = require("express");
const logger = logger_1.default(module);
const router = express_1.Router();
/**
 * Get user details.
 */
router.get('/', (req, res) => {
    logger.info('requesting user details', req);
    const userResponse = Object.assign({}, req.user, {
        isAdmin: shared_constants_1.ADMIN_MEMBERS.indexOf(req.user.email) >= 0,
    });
    res.json(userResponse);
});
exports.default = router;
//# sourceMappingURL=index.js.map