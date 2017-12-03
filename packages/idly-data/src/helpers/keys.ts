export function keys(obj: any): string[] {
  if (obj == null) return [];
  return Object.keys(obj);
}
