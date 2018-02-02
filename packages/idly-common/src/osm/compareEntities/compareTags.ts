// not safe for any object
export function compareTags(tagsA: any, tagsB: any): boolean {
  if (tagsA === tagsB) {
    return true;
  }
  const keysA = Object.keys(tagsA);
  const keysB = Object.keys(tagsB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.is(tagsA[keysA[i]], tagsB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
