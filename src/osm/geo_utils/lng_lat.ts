import { Record } from 'immutable';
export class LngLat extends Record({
  lat: NaN,
  lon: NaN
}) {
  lat: number;
  lon: number;
}

export function genLngLat(lonlat: { lon: number; lat: number }): LngLat;
export function genLngLat([lon, lat]: [number, number]): LngLat;
export function genLngLat(obj): any {
  if (Array.isArray(obj)) {
    return new LngLat({ lon: obj[0], lat: obj[1] });
  }
  return new LngLat({ ...obj });
}
