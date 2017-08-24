export declare let currentLocale: string;
export declare let textDirection: string;
export declare function setLocale(_: any): void;
/**
 * Given a string identifier, try to find that string in the current
 * language, and return it.
 *
 * @param {string} s string identifier
 * @returns {string?} locale string
 */
export declare function t(s: any, o?: any, loc?: any): any;
/**
 * Given string 'ltr' or 'rtl', save that setting
 *
 * @param {string} s ltr or rtl
 */
export declare function setTextDirection(dir: any): void;
