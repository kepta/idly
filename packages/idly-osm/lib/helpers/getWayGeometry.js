"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("idly-common/lib");
const isArea_1 = require("../helpers/isArea");
exports.getWayGeometry = (way) => isArea_1.isArea(way) ? lib_1.OsmGeometry.AREA : lib_1.OsmGeometry.LINE;
//# sourceMappingURL=getWayGeometry.js.map