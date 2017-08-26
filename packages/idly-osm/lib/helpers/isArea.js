"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weakCache_1 = require("idly-common/lib/misc/weakCache");
const findInAreaKeys_1 = require("../helpers/findInAreaKeys");
const isClosed_1 = require("../helpers/isClosed");
exports.isArea = weakCache_1.weakCache((way) => {
    if (way.tags.get('area') === 'yes')
        return true;
    if (!isClosed_1.isClosed(way) || way.tags.get('area') === 'no')
        return false;
    return findInAreaKeys_1.findInAreaKeys(way.tags);
});
//# sourceMappingURL=isArea.js.map