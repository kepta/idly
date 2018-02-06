export type Table<T> = Map<string, T>;

export const tableCreate = <T>(): Table<T> => new Map<string, T>();

export const tableAdd = <T>(t: Table<T>, k: string, e: T) => t.set(k, e);

export const tableBulkAdd = <T>(
  t: Table<T>,
  it: IterableIterator<[string, T]> | Iterable<[string, T]>
) => {
  for (const [k, v] of it) {
    tableAdd<T>(t, k, v);
  }
  return t;
};

export const tableRemove = <T>(t: Table<T>, k: string) => t.delete(k);

export const tableBulkRemove = <T>(
  t: Table<T>,
  it: IterableIterator<string> | Iterable<string>
) => {
  for (const k of it) {
    tableRemove<T>(t, k);
  }
  return t;
};
export const tableBulkGet = <T>(t: Table<T>, k: string[]) =>
  k.map(i => tableGet<T>(t, i));

export const tableGet = <T>(t: Table<T>, k: string) => t.get(k);

export const tableHas = <T>(t: Table<T>, k: string) => t.has(k);

export const tableUpdate = <T>(f: (a?: T) => T, t: Table<T>, k: string) =>
  tableAdd<T>(t, k, f(tableGet<T>(t, k)));

export const tableMap = <T, Z>(f: (v: T, k: string) => Z, t: Table<T>) => {
  const result: Z[] = [];
  t.forEach((v, k) => result.push(f(v, k)));
  return result;
};

export const tableReduce = <T, Z>(
  f: (prev: Z, cur: T, key: string) => Z,
  base: Z,
  t: Table<T>
) => {
  for (const [k, v] of t) {
    base = f(base, v, k);
  }
  return base;
};

export const tableValues = <T>(t: Table<T>) => t.values();

export const tableFilter = <T>(
  f: (r: T, id: string) => boolean,
  t: Table<T>
): Table<T> => {
  const result: Table<T> = new Map();
  t.forEach((e, id) => f(e, id) && result.set(id, e));
  return result;
};

export const tableForEach = <T>(
  f: (r: T, id: string) => any,
  t: Table<T>
): Table<T> => {
  t.forEach(f);
  return t;
};

export type TableFindValueType = <T>(
  f: (r: T, id: string) => boolean,
  t: Table<T>
) => T | undefined;

export const tableFindValue: TableFindValueType = (f, t) => {
  for (const [id, e] of t) {
    if (f(e, id)) {
      return e;
    }
  }
  return;
};

export type TableFindKeyType = <T>(
  f: (r: T, id: string) => boolean,
  t: Table<T>
) => string | undefined;
export const tableFindKey: TableFindKeyType = (f, t) => {
  for (const [id, e] of t) {
    if (f(e, id)) {
      return id;
    }
  }
  return;
};
