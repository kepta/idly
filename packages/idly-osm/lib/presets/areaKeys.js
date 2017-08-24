"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const _ = require("lodash");
function initAreaKeys(all) {
    let localAreaKeys = immutable_1.Map();
    const ignore = ['barrier', 'highway', 'footway', 'railway', 'type']; // probably a line..
    // all . collection needs to init
    const presets = _.reject(all.collection, 'suggestion');
    // whitelist
    /**
     * @TOFIX: type presets bro
     */
    presets.forEach(function (d) {
        let key;
        for (key in d.tags)
            break;
        if (!key)
            return;
        if (ignore.indexOf(key) !== -1)
            return;
        if (d.geometry.indexOf('area') !== -1) {
            // probably an area..
            localAreaKeys = localAreaKeys.set(key, localAreaKeys.get(key) || immutable_1.Map());
        }
    });
    // blacklist
    presets.forEach(function (d) {
        let key;
        for (key in d.tags)
            break;
        if (!key)
            return;
        if (ignore.indexOf(key) !== -1)
            return;
        const value = d.tags[key];
        if (localAreaKeys.has(key) &&
            d.geometry.indexOf('line') !== -1 &&
            value !== '*') {
            // areaKeys.get(key)[value] = true;
            localAreaKeys = localAreaKeys.setIn([key, value], true);
        }
    });
    return localAreaKeys;
}
exports.initAreaKeys = initAreaKeys;
//# sourceMappingURL=areaKeys.js.map