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
