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
