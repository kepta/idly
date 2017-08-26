"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("idly-common/lib/osm/structures");
const isArea_1 = require("../helpers/isArea");
exports.getWayGeometry = (way) => isArea_1.isArea(way) ? structures_1.OsmGeometry.AREA : structures_1.OsmGeometry.LINE;
//# sourceMappingURL=getWayGeometry.js.map