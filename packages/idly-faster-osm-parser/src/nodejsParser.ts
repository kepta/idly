import * as fs from 'fs';
import genReadlines = require('gen-readlines');

import { Entity } from 'idly-common/lib/osm/structures';

import { Options } from './helpers';
import { objToStandard, xmlLineToObj } from './process';

function* lineParser(path: string) {
  const fd = fs.openSync(path, 'r');
  const stats = fs.fstatSync(fd);
  const reader = genReadlines(fd, stats.size);
  for (const line of reader) {
    yield line.toString();
  }
  fs.closeSync(fd);
}

/**
 * The parser for nodejs. It directly reads a file
 * line by line. Reading a the file line by line enables
 * this to load any kind of huge file.
 */
export function* nodejsParser(
  path: string,
  opts: Options = {}
): IterableIterator<Entity> {
  opts = {
    prependEntityChar: true,
    useRef: false,
    freeze: false,
    ...opts,
  };

  const lastObj: any = {
    pointer: undefined,
  };

  for (const r of lineParser(path)) {
    const result = xmlLineToObj(r, lastObj, opts);
    if (result) {
      yield objToStandard(result, opts);
    }
  }
}
