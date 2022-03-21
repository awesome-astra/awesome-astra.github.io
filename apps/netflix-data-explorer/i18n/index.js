"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = exports.changeLanguage = exports.setupi18n = void 0;
const i18next_1 = __importDefault(require("i18next"));
const en_US_1 = __importDefault(require("./locales/en-US"));
async function setupi18n() {
    await i18next_1.default.init({
        lng: 'en-US',
        fallbackLng: 'en-US',
        resources: {
            'en-US': {
                translation: en_US_1.default,
            },
        },
        interpolation: {
            format(value, format, _lng) {
                if (value === undefined) {
                    return value;
                }
                if (format === 'uppercase') {
                    return value.toUpperCase();
                }
                if (format === 'lowercase') {
                    return value.toLowerCase();
                }
                return value;
            },
        },
    });
}
exports.setupi18n = setupi18n;
function changeLanguage(language) {
    return i18next_1.default.changeLanguage(language);
}
exports.changeLanguage = changeLanguage;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function t(key, options) {
    return i18next_1.default.t(key, options);
}
exports.t = t;
//# sourceMappingURL=index.js.map