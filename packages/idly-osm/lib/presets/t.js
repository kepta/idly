"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @REVISIT why does translations exist?
 */
const translations = Object.create(null);
exports.currentLocale = 'en';
exports.textDirection = 'ltr';
function setLocale(_) {
    if (translations[_] !== undefined) {
        exports.currentLocale = _;
    }
    else if (translations[_.split('-')[0]]) {
        exports.currentLocale = _.split('-')[0];
    }
}
exports.setLocale = setLocale;
// export function addTranslation(id, value) {
//   translations[id] = value;
// }
/**
 * Given a string identifier, try to find that string in the current
 * language, and return it.
 *
 * @param {string} s string identifier
 * @returns {string?} locale string
 */
function t(s, o, loc) {
    loc = loc || exports.currentLocale;
    const path = s
        .split('.')
        .map(function (ss) {
        return ss.replace('<TX_DOT>', '.');
    })
        .reverse();
    let rep = translations[loc];
    while (rep !== undefined && path.length)
        rep = rep[path.pop()];
    if (rep !== undefined) {
        if (o)
            for (const k in o)
                rep = rep.replace('{' + k + '}', o[k]);
        return rep;
    }
    if (loc !== 'en') {
        return t(s, o, 'en');
    }
    if (o && 'default' in o) {
        return o.default;
    }
    const missing = 'Missing ' + loc + ' translation: ' + s;
    if (typeof console !== 'undefined')
        console.error(missing); // eslint-disable-line
    return missing;
}
exports.t = t;
/**
 * Given string 'ltr' or 'rtl', save that setting
 *
 * @param {string} s ltr or rtl
 */
function setTextDirection(dir) {
    exports.textDirection = dir;
}
exports.setTextDirection = setTextDirection;
//# sourceMappingURL=t.js.map