// not safe for any object
export function compareTags(objA: any, objB: any): boolean {
  if (objA === objB) {
    return true;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
