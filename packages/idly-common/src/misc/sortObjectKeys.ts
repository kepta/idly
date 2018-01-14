export function sortObjectKeys<T extends { [index: string]: any }>(
  rawTags: T,
): T {
  return Object.keys(rawTags)
    .sort()
    .reduce((r, k) => ((r[k] = rawTags[k]), r), {} as T);
}
