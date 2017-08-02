import { LngLatBounds } from 'mapbox-gl';
const SphericalMercator = require('@mapbox/sphericalmercator');

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

export function lonlatToXYs(lonlat: LngLatBounds, zoom: number): number[][] {
  const xys = [];
  const { minX, minY, maxX, maxY } = lonlatToXY(lonlat, zoom);
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      xys.push([x, y]);
    }
  }
  return xys;
}
