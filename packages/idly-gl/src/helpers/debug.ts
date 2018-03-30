export function debugMethods<T extends object>(
  obj: T,
  excludes: Set<string> = new Set(),
  collapse = true
): T {
  return new Proxy(obj, {
    get(target: any, name: string, receiver) {
      if (typeof target[name] === 'function' && !excludes.has(name)) {
        return (...args: any[]) => {
          const methodName = name;
          console[collapse ? 'groupCollapsed' : 'group'](methodName.toString());
          console.groupCollapsed('args');
          console.log(args);
          console.groupEnd();

          const result = target[name](...args);
          console.log(result);
          console.groupEnd();
          return result;
        };
      } else if (target[name] !== null && typeof target[name] === 'object') {
        return debugMethods(target[name], excludes);
      } else {
        return Reflect.get(target, name, receiver);
      }
    },
  });
}
