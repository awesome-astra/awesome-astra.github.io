"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAuthorized = void 0;
const lodash_1 = __importDefault(require("lodash"));
function normalizeGroup(userOrGroup) {
    const domain = '@netflix.com';
    if (!userOrGroup.endsWith(domain)) {
        return `${userOrGroup}${domain}`;
    }
    return userOrGroup;
}
/**
 * Checks to see if a user is part of the allowed groups. Will check if the allowed groups
 * contains any of the user's groups or user's email address.
 * @param user          The user object from the request. Expected to contain the user's googleGroups.
 * @param allowedGroups The list of allowed groups.
 */
function isUserAuthorized(user, allowedGroups = new Array()) {
    if (user.isAdmin) {
        return true;
    }
    if (!user.googleGroups || user.googleGroups.length === 0) {
        throw new Error('Could not find user group information. Please log out and log back in again.');
    }
    const userGroups = lodash_1.default.concat(user.email, user.googleGroups.map(normalizeGroup));
    return (lodash_1.default.intersection(userGroups, allowedGroups.map(normalizeGroup)).length > 0);
}
exports.isUserAuthorized = isUserAuthorized;
//# sourceMappingURL=user-utils.js.map