export function filter(raw: any, cb: (k: any) => boolean): any[] {
  if (raw == null) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.filter(cb);
  }
  return Object.keys(raw)
    .filter(key => cb(key))
    .map(key => raw[key]);
}
