"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', async (req, res, next) => {
    try {
        const types = await req.cassandraApi.getTypes(req.keyspaceName);
        res.json(types);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map