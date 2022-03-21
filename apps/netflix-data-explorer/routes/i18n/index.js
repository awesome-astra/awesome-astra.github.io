"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@/i18n");
const express_1 = require("express");
const router = express_1.Router();
router.post('/', (req, res, next) => {
    try {
        i18n_1.changeLanguage(req.body.language);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map