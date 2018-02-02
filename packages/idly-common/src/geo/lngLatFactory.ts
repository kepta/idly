import { LngLat } from '../osm/structures';

export function lngLatFactory(
  obj: { lon: number; lat: number } | [number, number]
): LngLat {
  if (Array.isArray(obj)) {
    return { lon: obj[0], lat: obj[1] };
  }
  return { ...obj };
}
