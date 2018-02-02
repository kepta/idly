export type IFunc<T extends object, TResult> = (arg: T) => TResult;

/**
 * takes a func<T,K> and returns func<T,K>
 * T must extend object.
 */
export function weakCache<T extends object, K>(fn: IFunc<T, K>): IFunc<T, K> {
  const cache = new WeakMap<T, K>();
  return arg => {
    let value = cache.get(arg);
    if (value) {
      return value;
    }
    value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}

export type IFunc2<T extends object, P extends object, TResult> = (
  arg1: T,
  arg2: P
) => TResult;

// @TODO need to test vv this. SERIOUSLY!
export function weakCache2<T extends object, P extends object, K>(
  fn: IFunc2<T, P, K>
): IFunc2<T, P, K> {
  const cache = new WeakMap<T, WeakMap<P, K>>();
  return (arg1, arg2) => {
    let cacheWithinCache = cache.get(arg1);
    if (!cacheWithinCache) {
      cacheWithinCache = new WeakMap();
      cache.set(arg1, cacheWithinCache);
    }
    let value = cacheWithinCache.get(arg2);
    if (value) {
      return value;
    }
    value = fn(arg1, arg2);
    cacheWithinCache.set(arg2, value);
    return value;
  };
}
