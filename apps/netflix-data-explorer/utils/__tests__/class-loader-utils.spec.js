"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_loader_utils_1 = require("../class-loader-utils");
describe('Class Loader Suite', () => {
    it('should throw on invalid path', async () => {
        expect.assertions(1);
        try {
            await class_loader_utils_1.loadClass('invalid/path');
        }
        catch (err) {
            expect(err.message).toContain('Could not load class');
        }
    });
});
//# sourceMappingURL=class-loader-utils.spec.js.map