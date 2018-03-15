import { readFile as _readFile } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(_readFile);

export const readJSON = (p = '') =>
  readFile(path.join(__dirname, p), 'utf-8').then(r => JSON.parse(r));

export function expectStableMap<T>(
  arg: Map<string, T> | ReadonlyMap<string, T>
) {
  if (arg instanceof Map) {
    const t = [...arg].map((r): [string, string] => [
      r[0],
      JSON.stringify(r[1]),
    ]);
    return expect(
      new Map(t.sort((a, b) => (a[0] + '').localeCompare(b[0] + '')))
    );
  }
  return expect(arg);
}
