import { Either, Left, Right } from 'monet';

export const setAddIterable = <T>(
  it: IterableIterator<T> | Iterable<T>,
  set: Set<T>
) => {
  for (const i of it) {
    set.add(i);
  }
  return set;
};

export const setFind = <T>(
  foo: ((s: T) => boolean),
  set: Set<T> | ReadonlySet<T>
) => {
  for (const z of set) {
    if (foo(z)) {
      return z;
    }
  }
  return;
};

export const setEqual = <T>(setA: Set<T>, setB: Set<T>) => {
  if (setA.size !== setB.size) {
    return false;
  }
  for (const a of setA) {
    if (!setB.has(a)) {
      return false;
    }
  }
  return true;
};

export const setSome = <T>(
  foo: ((s: T) => boolean),
  set: Set<T> | ReadonlySet<T>
) => {
  for (const z of set) {
    if (foo(z)) {
      return true;
    }
  }
  return false;
};

export const setFilter = <T>(
  foo: ((s: T) => boolean),
  a: Set<T> | ReadonlySet<T>
) => new Set([...a].filter(foo));

export const setIntersect = <T>(
  a: Set<T> | ReadonlySet<T> | ReadonlySet<T>,
  b: Set<T> | ReadonlySet<T>
) => setFilter(x => b.has(x), a);

export const setDifference = <T>(
  a: Set<T> | ReadonlySet<T>,
  b: Set<T> | ReadonlySet<T>
) => new Set([...a].filter(x => !b.has(x)));

export const setCreate = <T>(a: Iterable<T> = []) => new Set<T>(a);

export const setBlankCreate = <T>() => new Set<T>();

export const setClone = <T>(s: ReadonlySet<T>) => new Set<T>([...s]);

export const setBulkDelete = <T>(
  a: Iterable<T> | IterableIterator<T>,
  set: Set<T>
) => {
  for (const i of a) {
    set.delete(i);
  }
  return set;
};
export const readonlySetCreate = <T>(a: Iterable<T> = []): ReadonlySet<T> =>
  new Set<T>(a);

export const iterableFlattenToArray = <T>(
  a: Iterable<Iterable<T>> | IterableIterator<IterableIterator<T>>
) => {
  const result = [];
  for (const i of a) {
    for (const j of i) {
      result.push(j);
    }
  }
  return result;
};

export const iterableFlattenToSet = <T>(
  a: Iterable<Iterable<T>> | IterableIterator<IterableIterator<T>>
): Set<T> => {
  const result = setCreate<T>();
  for (const i of a) {
    for (const j of i) {
      result.add(j);
    }
  }
  return result;
};

export const setUnion = <T>(
  a: Set<T> | ReadonlySet<T>,
  b: Set<T> | ReadonlySet<T>
) => new Set([...a, ...b]);

export const mapFilterKeys = <K, V>(
  foo: ((v: V, k: K) => boolean),
  map: Map<K, V>
): K[] => {
  const filter = [];
  for (const [k, v] of map) {
    if (foo(v, k)) {
      filter.push(k);
    }
  }
  return filter;
};

export const mapFilterKeysIntoSet = <K, V>(
  foo: ((v: V, k: K) => boolean),
  map: Map<K, V>
): Set<K> => {
  const filter = new Set();
  for (const [k, v] of map) {
    if (foo(v, k)) {
      filter.add(k);
    }
  }
  return filter;
};

export const mapFilter = <K, V>(
  foo: ((v: V, k: K) => boolean),
  map: Map<K, V>
): Map<K, V> => {
  const newMap = new Map<K, V>();
  for (const [k, v] of map) {
    if (foo(v, k)) {
      newMap.set(k, v);
    }
  }
  return newMap;
};

export const mapFilterValuesIntoArray = <K, V>(
  foo: ((v: V, k: K) => boolean),
  map: Map<K, V>
): V[] => {
  const filter = [];
  for (const [k, v] of map) {
    if (foo(v, k)) {
      filter.push(v);
    }
  }
  return filter;
};

export const last = <T>(r: T[]) => r[r.length - 1];

export const isVirgin = (indexOrId: string) => indexOrId.indexOf('#') === -1;
export const isNotVirgin = (indexOrId: string) => !isVirgin(indexOrId);

export const EitherCond = <T, K>(cond: boolean, left: T, right: K) =>
  cond ? Left<T, K>(left) : Right<T, K>(right);

/**
 * Returns Left(value) aka Error when fn(value) returns truthy else returns Right(error)
 */
export const ErrorWhen = <T, K>(fn: ((r: K) => boolean), error: T) => (
  value: K
) => (fn(value) ? Left<T, K>(error) : Right<T, K>(value));

export class Err {
  public static left<T = never>(err: Error): Either<Error, T> {
    return Left<Error, T>(err);
  }
  public static right<T>(val: T): Either<Error, T> {
    return Right(val);
  }
}

export const foldEitherArray = <T, K>(arr: Array<Either<T, K>>) => {
  const result: K[] = [];
  for (const x of arr) {
    if (x.isLeft()) {
      return Left<T, K[]>(x.left());
    }
    result.push(x.right());
  }
  return Right<T, K[]>(result);
};

export const pass = <T>(f: (r: T) => any) => (r: T) => {
  f(r);
  return r;
};
