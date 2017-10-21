import * as area from '@turf/area';
import * as bboxPolygon from '@turf/bbox-polygon';
import * as intersects from '@turf/intersect';
import { BBox } from 'idly-common/lib/geo/bbox';
import { mercator } from 'idly-common/lib/geo/sphericalMercator';
import { Tile } from 'idly-common/lib/geo/tile';

export function filterXyz(xyzs: Tile[], bbox: BBox, ratio: number): Tile[] {
  const mainPoly = bboxPolygon(bbox);
  return xyzs.filter(tile => {
    const secPoly = bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z));
    const inter = intersects(mainPoly, secPoly);
    return area(inter) / area(secPoly) >= ratio;
  });
}
