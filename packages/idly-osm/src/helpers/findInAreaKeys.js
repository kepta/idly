"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var areaKeys_1 = require("idly-data/lib/areaKeys/areaKeys");
// `highway` and `railway` are typically linear features, but there
// are a few exceptions that should be treated as areas, even in the
// absence of a proper `area=yes` or `areaKeys` tag.. see #4194
var lineKeys = {
    highway: {
        rest_area: true,
        services: true
    },
    railway: {
        roundhouse: true,
        station: true,
        traverser: true,
        turntable: true,
        wash: true
    }
};
function findInAreaKeys(tags) {
    var areaKeys = areaKeys_1.getAreaKeys();
    for (var key in tags) {
        if (key in areaKeys && !(tags[key] in areaKeys[key])) {
            return true;
        }
        if (key in lineKeys && tags[key] in lineKeys[key]) {
            return true;
        }
    }
    return false;
}
exports.findInAreaKeys = findInAreaKeys;
