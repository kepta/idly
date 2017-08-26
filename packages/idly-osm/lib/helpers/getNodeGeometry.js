"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("idly-common/lib/osm/structures");
function getNodeGeometry(id, parentWays) {
    if (parentWays.has(id))
        return parentWays.get(id).size > 1
            ? structures_1.OsmGeometry.VERTEX_SHARED
            : structures_1.OsmGeometry.VERTEX;
    return structures_1.OsmGeometry.POINT;
}
exports.getNodeGeometry = getNodeGeometry;
//# sourceMappingURL=getNodeGeometry.js.map