"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("idly-common/lib");
const findInAreaKeys_1 = require("../helpers/findInAreaKeys");
const isClosed_1 = require("../helpers/isClosed");
exports.isArea = lib_1.weakCache((way) => {
    if (way.tags.get('area') === 'yes')
        return true;
    if (!isClosed_1.isClosed(way) || way.tags.get('area') === 'no')
        return false;
    return findInAreaKeys_1.findInAreaKeys(way.tags);
});
//# sourceMappingURL=isArea.js.map