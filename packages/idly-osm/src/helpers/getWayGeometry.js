"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var structures_1 = require("idly-common/lib/osm/structures");
var isArea_1 = require("../helpers/isArea");
exports.getWayGeometry = function (way) {
    return isArea_1.isArea(way) ? structures_1.OsmGeometry.AREA : structures_1.OsmGeometry.LINE;
};
