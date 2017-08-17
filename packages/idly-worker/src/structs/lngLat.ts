export interface LngLat {
  readonly lat: number;
  readonly lon: number;
}

export function genLngLat(
  obj: { lon: number; lat: number } | [number, number]
): LngLat {
  if (Array.isArray(obj)) {
    return { lon: obj[0], lat: obj[1] };
  }
  return { ...obj };
}
