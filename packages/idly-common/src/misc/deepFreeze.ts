export function deepFreeze<T extends { [index: string]: any }>(
  obj: T,
  freeze = true
): T {
  if (!freeze) {
    return obj;
  }
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach((name: string) => {
    const prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}
