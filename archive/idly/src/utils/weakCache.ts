import { attachToWindow } from 'utils/attach_to_window';

type IFunc<T extends object, TResult> = (arg: T) => TResult;

/**
 * @DESC takes a func<T,K> and returns func<T,K>
 *  T must extend object.
 */
export function weakCache<T extends object, K>(fn: IFunc<T, K>): IFunc<T, K> {
  const cache = new WeakMap<T, K>();
  return arg => {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}

type IFunc2<T extends object, P extends object, TResult> = (
  arg1: T,
  arg2: P
) => TResult;

export function weakCache2<T extends object, P extends object, K>(
  fn: IFunc2<T, P, K>
): IFunc2<T, P, K> {
  const cache = new WeakMap<T, WeakMap<P, K>>();

  return (arg1: T, arg2: P): K => {
    let cacheWithinCache: WeakMap<P, K> = cache.get(arg1);
    if (!cacheWithinCache) {
      cacheWithinCache = new WeakMap();
      cache.set(arg1, cacheWithinCache);
    } else if (cacheWithinCache.has(arg2)) {
      // console.log('hurray cache hit');
      return cacheWithinCache.get(arg2);
    }
    const value = fn(arg1, arg2);
    cacheWithinCache.set(arg2, value);
    return value;
  };
}

attachToWindow('doubleCache', weakCache2);
