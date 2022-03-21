"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = void 0;
const baseUser = {
    email: 'TBD',
    application: 'nfdataexplorer2',
    googleGroups: [],
    isAdmin: false,
};
function createTestUser(email, groups) {
    return {
        ...baseUser,
        email,
        googleGroups: groups,
    };
}
exports.createTestUser = createTestUser;
//# sourceMappingURL=user-helper.js.map