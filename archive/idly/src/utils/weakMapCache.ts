export function cache(foo) {
  const Cache = new WeakMap();
  return a => {
    if (Cache.has(a)) return Cache.get(a);
    const compute = foo(a);
    Cache.set(a, compute);
    return compute;
  };
}
