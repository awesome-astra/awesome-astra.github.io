"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdministrator = void 0;
const configuration_1 = require("@/config/configuration");
const { ADMIN_GROUPS, ADMIN_USERS } = configuration_1.getConfig();
const ADMIN_GROUP_SET = new Set(ADMIN_GROUPS);
const ADMIN_USER_SET = new Set(ADMIN_USERS);
/**
 * Checks if the given user email and google groups permit administrator access.
 * @param email The user's email address.
 * @param userGroups The user's google groups.
 * @returns True if the user is an administrator. False otherwise.
 */
function isAdministrator(email, userGroups) {
    let isAdminGroupMember = false;
    const userGroupSet = new Set(userGroups);
    for (const adminGroup of ADMIN_GROUP_SET) {
        if (userGroupSet.has(adminGroup)) {
            isAdminGroupMember = true;
            break;
        }
    }
    return isAdminGroupMember || ADMIN_USER_SET.has(email);
}
exports.isAdministrator = isAdministrator;
//# sourceMappingURL=auth-utils.js.map