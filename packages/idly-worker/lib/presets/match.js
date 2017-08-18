import { Geometry } from 'structs/geometry';
export function isOnAddressLine(entity) {
    return false;
    //   return resolver.transient(this, 'isOnAddressLine', function() {
    //     return (
    //       resolver.parentWays(this).filter(function(parent) {
    //         return (
    //           parent.tags.hasOwnProperty('addr:interpolation') &&
    //           parent.geometry(resolver) === 'line'
    //         );
    //       }).length > 0
    //     );
    //   });
}
export function presetsMatch(all, index, areaKeys, geometry, tags) {
    if (!geometry)
        throw new Error('no geometry found');
    // Treat entities on addr:interpolation lines as points, not vertices (#3241)
    /**
     * @REVISIT isOnAddressLine was omitted to remove dep on entity.
     *    code: `if (geometry === Geometries.VERTEX && isOnAddressLine(entity)`
     */
    if (geometry === Geometry.VERTEX && isOnAddressLine()) {
        geometry = Geometry.POINT;
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
//# sourceMappingURL=match.js.map