import area from '@turf/area';
import bboxClip from '@turf/bbox-clip';
import bboxPolygon from '@turf/bbox-polygon';

import { BBox, mercator, Tile } from 'idly-common/lib/geo';
export function filterXyz(xyzs: Tile[], bbox: BBox, ratio: number): Tile[] {
  return xyzs.filter(tile => {
    const secPoly = bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z));
    const inter = bboxClip(secPoly, bbox);
    return area(inter) / area(secPoly) >= ratio;
  });
}
