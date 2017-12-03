export function omit(obj: any, toRemove: string[]) {
  if (obj == null) {
    return {};
  }
  return Object.keys(obj)
    .filter(key => toRemove.indexOf(key) < 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
}
