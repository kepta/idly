import { LngLatBounds } from 'mapbox-gl/dist/mapbox-gl-dev';
const SphericalMercator = require('@mapbox/sphericalmercator');
import * as transformScale from '@turf/transform-scale';

export const mercator = new SphericalMercator({
  size: 256
});

export function lonlatToXY(
  lonlat: LngLatBounds,
  zoom: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  return mercator.xyz(
    [lonlat.getWest(), lonlat.getSouth(), lonlat.getEast(), lonlat.getNorth()],
    zoom
  );
}

export function bboxToXY(
  bbox,
  zoom: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  return mercator.xyz(bbox, zoom);
}

export function lonlatToXYs(lonlat: LngLatBounds, zoom: number): number[][] {
  const bbox = [
    lonlat.getWest(),
    lonlat.getSouth(),
    lonlat.getEast(),
    lonlat.getNorth()
  ];
  const xys = [];

  const { minX, minY, maxX, maxY } = bboxToXY(bbox, zoom);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      xys.push([x, y]);
    }
  }
  return xys;
}

function increaseSize(abc) {
  const polygon = turf.bboxPolygon(abc);
  // const scaled = transformScale(polygon, 1.2);
  const bbox = turf.bbox(polygon);
  return bbox;
}
