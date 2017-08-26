"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weakCache_1 = require("idly-common/lib/misc/weakCache");
const structures_1 = require("idly-common/lib/osm/structures");
const isArea_1 = require("../helpers/isArea");
const tagClasses_1 = require("../tagClasses/tagClasses");
const presets_1 = require("../presets/presets");
const tagClassesPrimaryCache = weakCache_1.weakCache(tagClasses_1.tagClassesPrimary);
function wayPropertiesGen(way, table) {
    const geometry = isArea_1.isArea(way) ? structures_1.OsmGeometry.AREA : structures_1.OsmGeometry.LINE;
    const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
    const match = presets_1.presetsMatcherCached(geometry)(way.tags);
    return {
        name: way.tags.get('name') || way.tags.get('ref'),
        icon: match && match.icon,
        geometry,
        tagsClass,
        tagsClassType
    };
}
exports.wayPropertiesGen = wayPropertiesGen;
//# sourceMappingURL=way.js.map