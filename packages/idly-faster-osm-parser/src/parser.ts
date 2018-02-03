import { Entity } from 'idly-common/lib/osm/structures';
import { Options } from './helpers';
import { objToStandard, xmlLineToObj } from './process';

export default parser;

/**
 * A an extremely fast smart parser for .osm api
 */
export function parser(str: string, opts: Options = {}): Entity[] {
  const lastObj: any = {
    pointer: undefined,
  };

  opts = {
    prependEntityChar: true,
    useRef: false,
    freeze: false,
    ...opts,
  };

  return str
    .split('\n')
    .map(r => {
      const result = xmlLineToObj(r, lastObj, opts);
      if (result) {
        return result;
      }
    })
    .filter(r => r)
    .map(r => objToStandard(r, opts));
}
