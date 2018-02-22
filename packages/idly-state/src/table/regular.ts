export type Table<T> = Map<string, T>;
export type ReadonlyTable<T> = ReadonlyMap<string, T>;

export const tableCreate = <T>(): Table<T> => new Map<string, T>();

export const tableAdd = <T>(v: T, k: string, t: Table<T>) => t.set(k, v);

export const tableCopy = <T>(k: string, src: Table<T>, dest: Table<T>) =>
  tableAdd(tableGet(k, src), k, dest);

export const tableBulkCopy = <T>(
  indexes: Iterable<string> | IterableIterator<string>,
  src: Table<T>,
  dest: Table<T>
) => {
  for (const id of indexes) {
    tableCopy(id, src, dest);
  }
  return dest;
};

export const tableBulkAdd = <T>(
  it: IterableIterator<[string, T]> | Iterable<[string, T]>,
  t: Table<T>
) => {
  for (const [k, v] of it) {
    tableAdd<T>(v, k, t);
  }
  return t;
};

export const tableRemove = <T>(k: string, t: Table<T>) => t.delete(k);

export const tableBulkRemove = <T>(
  it: IterableIterator<string> | Iterable<string>,
  t: Table<T>
) => {
  for (const k of it) {
    tableRemove<T>(k, t);
  }
  return t;
};

export const tableBulkGet = <T>(k: string[], t: Table<T>) =>
  k.map(i => tableGet<T>(i, t));

export const tableGet = <T>(k: string, t: Table<T>) => t.get(k);

export const tableHas = <T>(k: string, t: Table<T>) => t.has(k);

export const tableUpdate = <T>(f: (v?: T) => T, k: string, t: Table<T>) =>
  tableAdd<T>(f(tableGet<T>(k, t)), k, t);

export const tableValues = <T>(t: Table<T>) => t.values();

export const tableMap = <T, Z>(f: (v: T, k: string) => Z, t: Table<T>) => {
  const result: Z[] = [];
  t.forEach((v, k) => result.push(f(v, k)));
  return result;
};

export const tableReduce = <T, Z>(
  f: (prev: Z, cur: T, k: string) => Z,
  baseValue: Z,
  reduceFrom: Table<T>
) => {
  for (const [k, v] of reduceFrom) {
    baseValue = f(baseValue, v, k);
  }
  return baseValue;
};

export const tableFilter = <T>(
  f: (v: T, k: string) => boolean,
  t: Table<T>
): Table<T> => {
  const result: Table<T> = new Map();
  t.forEach((e, k) => f(e, k) && result.set(k, e));
  return result;
};

export const tableForEach = <T>(
  f: (v: T, k: string) => any,
  t: Table<T>
): Table<T> => {
  t.forEach(f);
  return t;
};

export type TableFindValueType = <T>(
  f: (v: T, k: string) => boolean,
  t: Table<T>
) => T | undefined;

export const tableFindValue: TableFindValueType = (f, t) => {
  for (const [k, v] of t) {
    if (f(v, k)) {
      return v;
    }
  }
  return;
};

export type TableFindKeyType = <T>(
  f: (v: T, k: string) => boolean,
  t: Table<T>
) => string | undefined;
export const tableFindKey: TableFindKeyType = (f, t) => {
  for (const [k, v] of t) {
    if (f(v, k)) {
      return k;
    }
  }
  return;
};
