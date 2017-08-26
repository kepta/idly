"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("idly-common/lib/osm/structures");
const weakCache_1 = require("idly-common/lib/misc/weakCache");
const lib_1 = require("idly-data/lib");
const _ = require("lodash");
const category_1 = require("../presets/category");
const collection_1 = require("../presets/collection");
const field_1 = require("../presets/field");
const preset_1 = require("../presets/preset");
const areaKeys_1 = require("../presets/areaKeys");
const match_1 = require("../presets/match");
class Index {
    constructor(o = {}) {
        this.point = o;
        this.vertex = o;
        this.line = o;
        this.area = o;
        this.relation = o;
    }
    set(g, value) {
        if (g === structures_1.OsmGeometry.POINT) {
            this.point = value;
        }
        else if (g === structures_1.OsmGeometry.VERTEX || g === structures_1.OsmGeometry.VERTEX_SHARED) {
            /**
             * @NOTE vertex_shared doesn't exist in iD.
             *  maybe this work or not?
             * @REVISIT ?
             */
            this.vertex = value;
        }
        else if (g === structures_1.OsmGeometry.LINE) {
            this.line = value;
        }
        else if (g === structures_1.OsmGeometry.AREA) {
            this.area = value;
        }
        else if (g === structures_1.OsmGeometry.RELATION) {
            this.relation = value;
        }
        else {
            throw new Error('geometry type not found');
        }
    }
    get(g) {
        if (g === structures_1.OsmGeometry.POINT) {
            return this.point;
        }
        else if (g === structures_1.OsmGeometry.VERTEX || g === structures_1.OsmGeometry.VERTEX_SHARED) {
            return this.vertex;
        }
        else if (g === structures_1.OsmGeometry.LINE) {
            return this.line;
        }
        else if (g === structures_1.OsmGeometry.AREA) {
            return this.area;
        }
        else if (g === structures_1.OsmGeometry.RELATION) {
            return this.relation;
        }
        else {
            throw new Error('type not found');
        }
    }
}
exports.Index = Index;
function initPresets(d = lib_1.presetsData.presets) {
    const all = collection_1.presetCollection([]);
    const recent = collection_1.presetCollection([]);
    all.collection = [];
    recent.collection = [];
    const fields = {};
    const universal = [];
    const index = new Index();
    const defaults = new Index(all);
    if (d.fields) {
        _.forEach(d.fields, function (dd, id) {
            fields[id] = field_1.presetField(id, dd);
            if (dd.universal)
                universal.push(fields[id]);
        });
    }
    if (d.presets) {
        _.forEach(d.presets, function (dd, id) {
            all.collection.push(preset_1.presetPreset(id, dd, fields));
        });
    }
    if (d.categories) {
        _.forEach(d.categories, function (dd, id) {
            all.collection.push(category_1.presetCategory(id, dd, all));
        });
    }
    if (d.defaults) {
        const getItem = _.bind(all.item, all);
        defaults.set(structures_1.OsmGeometry.AREA, collection_1.presetCollection(d.defaults.area.map(getItem)));
        defaults.set(structures_1.OsmGeometry.LINE, collection_1.presetCollection(d.defaults.line.map(getItem)));
        defaults.set(structures_1.OsmGeometry.POINT, collection_1.presetCollection(d.defaults.point.map(getItem)));
        defaults.set(structures_1.OsmGeometry.VERTEX, collection_1.presetCollection(d.defaults.vertex.map(getItem)));
        defaults.set(structures_1.OsmGeometry.RELATION, collection_1.presetCollection(d.defaults.relation.map(getItem)));
    }
    for (const preset of all.collection) {
        const geometry = preset.geometry;
        if (!Array.isArray(geometry))
            continue;
        for (const ge of geometry) {
            const g = index.get(ge);
            /**
             * @REVISIT convert preset.tags to Map
             */
            for (const k in preset.tags) {
                if (k) {
                    g[k] = g[k] || [];
                    g[k].push(preset);
                }
            }
        }
    }
    return { all, recent, index, defaults };
}
exports.initPresets = initPresets;
exports.presets = initPresets();
exports.areaKeys = areaKeys_1.initAreaKeys(exports.presets.all);
exports.presetsMatcher = (geometry, tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, geometry, tags);
exports.presetsMatcherPoint = weakCache_1.weakCache((tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, structures_1.OsmGeometry.POINT, tags));
exports.presetsMatcherVertex = weakCache_1.weakCache((tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, structures_1.OsmGeometry.VERTEX, tags));
exports.presetsMatcherLine = weakCache_1.weakCache((tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, structures_1.OsmGeometry.LINE, tags));
exports.presetsMatcherAREA = weakCache_1.weakCache((tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, structures_1.OsmGeometry.AREA, tags));
exports.presetsMatcherVertexShared = weakCache_1.weakCache((tags) => match_1.presetsMatch(exports.presets.all, exports.presets.index, exports.areaKeys, structures_1.OsmGeometry.VERTEX_SHARED, tags));
exports.presetsMatcherCached = (geometry) => {
    if (geometry === structures_1.OsmGeometry.POINT) {
        return exports.presetsMatcherPoint;
    }
    if (geometry === structures_1.OsmGeometry.VERTEX) {
        return exports.presetsMatcherVertex;
    }
    if (geometry === structures_1.OsmGeometry.VERTEX_SHARED) {
        return exports.presetsMatcherVertexShared;
    }
    if (geometry === structures_1.OsmGeometry.LINE) {
        return exports.presetsMatcherLine;
    }
    if (geometry === structures_1.OsmGeometry.AREA) {
        return exports.presetsMatcherAREA;
    }
};
//# sourceMappingURL=presets.js.map