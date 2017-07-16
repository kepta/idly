import { LngLatBounds } from 'mapbox-gl';
import { memoize } from 'ramda';
var SphericalMercator = require('@mapbox/sphericalmercator');

import { fetchTile } from '../network/osm';
import { cancelablePromise } from '../network/helper';
var mercator = new SphericalMercator({
  size: 256
});
const memFetchTile: (
  x: number,
  y: number,
  zoom: number
) => Promise<object> = memoize(fetchTile);

var prevProm: any = [];
export function fetchBbox(ltlng: LngLatBounds, zoom: number = 16) {
  prevProm.forEach((p: any) => p.cancel());
  const { minX, minY, maxX, maxY } = mercator.xyz(
    [ltlng.getWest(), ltlng.getSouth(), ltlng.getEast(), ltlng.getNorth()],
    Math.floor(zoom)
  );
  var zoom = Math.floor(zoom);
  var prom = [];
  for (var x = minX; x <= maxX; x++) {
    for (var y = minY; y <= maxY; y++) {
      prom.push(cancelablePromise(memFetchTile(x, y, zoom)));
    }
  }
  prevProm = prom.slice(0);
  return prom;
}
