/**
 * @DESC takes a func<T,K> and returns func<T,K>
 *  T must extend object.
 */
export function weakCache(fn) {
    const cache = new WeakMap();
    return arg => {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const value = fn(arg);
        cache.set(arg, value);
        return value;
    };
}
export function weakCache2(fn) {
    const cache = new WeakMap();
    return (arg1, arg2) => {
        let cacheWithinCache = cache.get(arg1);
        if (!cacheWithinCache) {
            cacheWithinCache = new WeakMap();
            cache.set(arg1, cacheWithinCache);
        }
        else if (cacheWithinCache.has(arg2)) {
            // console.log('hurray cache hit');
            return cacheWithinCache.get(arg2);
        }
        const value = fn(arg1, arg2);
        cacheWithinCache.set(arg2, value);
        return value;
    };
}
//# sourceMappingURL=weakCache.js.map