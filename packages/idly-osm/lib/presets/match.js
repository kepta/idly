"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("idly-common/lib/osm/structures");
const isAddressOnLine_1 = require("../helpers/isAddressOnLine");
function presetsMatch(all, index, areaKeys, geometry, tags) {
    if (!geometry)
        throw new Error('no geometry found');
    // Treat entities on addr:interpolation lines as points, not vertices (#3241)
    /**
     * @REVISIT isOnAddressLine was omitted to remove dep on entity.
     *    code: `if (geometry === Geometries.VERTEX && isOnAddressLine(entity)`
     */
    if (geometry === structures_1.OsmGeometry.VERTEX && isAddressOnLine_1.isOnAddressLine()) {
        geometry = structures_1.OsmGeometry.POINT;
    }
    // const geometryMatches = index.get(geometry);
    let best = -1;
    let match;
    const geometryMatches = index.get(geometry);
    tags.forEach((v, k) => {
        const keyMatches = geometryMatches[k];
        if (!keyMatches)
            return;
        for (let i = 0; i < keyMatches.length; i++) {
            const score = keyMatches[i].matchScore(tags);
            if (score > best) {
                best = score;
                match = keyMatches[i];
            }
        }
    });
    return match || all.item(geometry);
}
exports.presetsMatch = presetsMatch;
// "idly": "file:../idly",
// "idly-common": "file:../idly-common",
// "idly-data": "file:../idly-data",
//# sourceMappingURL=match.js.map