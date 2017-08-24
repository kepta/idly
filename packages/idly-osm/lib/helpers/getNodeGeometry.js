"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("idly-common/lib");
function getNodeGeometry(id, parentWays) {
    if (parentWays.has(id))
        return parentWays.get(id).size > 1
            ? lib_1.OsmGeometry.VERTEX_SHARED
            : lib_1.OsmGeometry.VERTEX;
    return lib_1.OsmGeometry.POINT;
}
exports.getNodeGeometry = getNodeGeometry;
//# sourceMappingURL=getNodeGeometry.js.map