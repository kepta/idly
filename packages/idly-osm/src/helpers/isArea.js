"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weakCache_1 = require("idly-common/lib/misc/weakCache");
var findInAreaKeys_1 = require("../helpers/findInAreaKeys");
var isClosed_1 = require("../helpers/isClosed");
exports.isArea = weakCache_1.weakCache(function (way) {
    if (way.tags['area'] === 'yes')
        return true;
    if (!isClosed_1.isClosed(way) || way.tags['area'] === 'no')
        return false;
    return findInAreaKeys_1.findInAreaKeys(way.tags);
});
