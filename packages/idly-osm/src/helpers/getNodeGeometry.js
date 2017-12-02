"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var structures_1 = require("idly-common/lib/osm/structures");
function getNodeGeometry(id, parentWay) {
    if (parentWay.size === 0)
        return structures_1.OsmGeometry.POINT;
    return structures_1.OsmGeometry.VERTEX;
}
exports.getNodeGeometry = getNodeGeometry;
