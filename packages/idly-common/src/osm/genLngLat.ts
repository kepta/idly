import { LngLat } from "../osm/structures";

export function genLngLat(
  obj: { lon: number; lat: number } | [number, number],
): LngLat {
  if (Array.isArray(obj)) {
    return { lon: obj[0], lat: obj[1] };
  }
  return { ...obj };
}
