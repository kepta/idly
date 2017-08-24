import { Entity, OsmGeometry, Tags } from 'idly-common/lib';

import { isOnAddressLine } from '../helpers/isAddressOnLine';
/**
 *
 * @REVISIT
 * @TOFIX
 */
import { AreaKeys } from '../presets/areaKeys';
import { areaKeys, Index } from '../presets/presets';

export function presetsMatch(
  all,
  index: Index,
  areaKeys: AreaKeys,
  geometry: OsmGeometry,
  tags: Tags
) {
  if (!geometry) throw new Error('no geometry found');
  // Treat entities on addr:interpolation lines as points, not vertices (#3241)
  /**
   * @REVISIT isOnAddressLine was omitted to remove dep on entity.
   *    code: `if (geometry === Geometries.VERTEX && isOnAddressLine(entity)`
   */
  if (geometry === OsmGeometry.VERTEX && isOnAddressLine()) {
    geometry = OsmGeometry.POINT;
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
