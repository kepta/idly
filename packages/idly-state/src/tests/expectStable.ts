export function expectStable(arg: any) {
  if (arg instanceof Map) {
    return expect(
      new Map([...arg].sort((a, b) => (a[0] + '').localeCompare(b[0] + '')))
    );
  }

  return expect(arg);
}
