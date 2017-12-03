export function values(obj: any): any[] {
  if (!obj) return [];
  return Object.keys(obj).map(k => obj[k]);
}
