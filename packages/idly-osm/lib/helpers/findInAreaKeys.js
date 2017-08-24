"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const presets_1 = require("../presets/presets");
exports.findInAreaKeys = (tags) => {
    let found = false;
    tags.forEach((v, key) => {
        if (presets_1.areaKeys.has(key) && !presets_1.areaKeys.hasIn([key, v])) {
            found = true;
            return false;
        }
    });
    return found;
};
//# sourceMappingURL=findInAreaKeys.js.map