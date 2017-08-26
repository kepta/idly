export function deepFreeze<T extends {}>(obj): Readonly<T> {
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function(name) {
    const prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop === 'object' && prop !== null) deepFreeze(prop);
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
}
