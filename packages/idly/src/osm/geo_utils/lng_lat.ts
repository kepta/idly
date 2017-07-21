import { Record } from 'immutable';
export class LngLat extends Record({
  lat: NaN,
  lon: NaN
}) {
  public lat: number;
  public lon: number;
}

export function genLngLat(
  obj: { lon: number; lat: number } | [number, number]
): LngLat {
  if (Array.isArray(obj)) {
    return new LngLat({ lon: obj[0], lat: obj[1] });
  }
  return new LngLat({ ...obj });
}
