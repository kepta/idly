"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var presetsInit_1 = require("./presetsInit");
var weakCache_1 = require("idly-common/lib/misc/weakCache");
var structures_1 = require("idly-common/lib/osm/structures");
var isArea_1 = require("../helpers/isArea");
var tagClasses_1 = require("../tagClasses/tagClasses");
var tagClassesPrimaryCache = weakCache_1.weakCache(tagClasses_1.tagClassesPrimary);
exports.wayPropertiesGen = weakCache_1.weakCache(function (way) {
    var geometry = isArea_1.isArea(way) ? structures_1.OsmGeometry.AREA : structures_1.OsmGeometry.LINE;
    var _a = tagClassesPrimaryCache(way.tags), tagsClass = _a[0], tagsClassType = _a[1];
    var match = presetsInit_1.presetMatch(way.tags, geometry); //presetsMatcherCached(geometry)(way.tags);
    return {
        name: way.tags['name'] || way.tags['ref'],
        icon: match && match.icon,
        geometry: geometry,
        tagsClass: tagsClass,
        tagsClassType: tagsClassType
    };
});
