import { Geometry } from 'osm/entities/constants';

import { Entity } from 'osm/entities/entities';
import { Tags } from 'osm/entities/helpers/tags';
import { AreaKeys } from 'osm/presets/areaKeys';

/**
 *
 * @REVISIT
 * @TOFIX
 */
export function isOnAddressLine(entity?: Entity) {
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

export function presetsMatch(
  all,
  index: any,
  areaKeys: AreaKeys,
  geometry: Geometry,
  tags: Tags
) {
  if (!geometry) throw new Error('no geometry found');
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
    if (!keyMatches) return;

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
