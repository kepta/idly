import unescape = require('lodash.unescape');

import { Entity } from 'idly-common/lib/osm/structures';
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/relationFactory';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

export default smartParser;

export type Options = {
  // flag for prepending `n`, `w`, `r` to the id of entity
  prependEntityChar?: boolean;
  // when true uses `ref` key for iding a member
  // when false uses `id` key for iding a member
  useRef?: boolean;
  // deep freezes each entity
  freeze?: boolean;
};

/**
 * A smart parser for osm bbox api
 */
export function smartParser(str: string, opts: Options = {}): Entity[] {
  let lastObj: any = {};

  opts = {
    prependEntityChar: true,
    useRef: false,
    freeze: false,
    ...opts,
  };

  return str
    .split('\n')
    .map((r: string) => {
      const line = r.trim();
      if (line === '') {
        return;
      }
      if (line[0] !== '<' || line[line.length - 1] !== '>') {
        throw new Error('unknown osm bbox xml format, ' + line);
      }

      const attributesObj = parseAttributes(line);

      if (line.startsWith('<nd')) {
        lastObj.nodes.push('n' + attributesObj.ref);
        return;
      }
      if (line.startsWith('<tag')) {
        lastObj.tags[attributesObj.k] = unescape(attributesObj.v);
        return;
      }
      if (line.startsWith('<member')) {
        if (opts.useRef) {
          attributesObj.ref = prependEntityChar(
            attributesObj.ref,
            attributesObj.type,
          );
        } else {
          attributesObj.id = prependEntityChar(
            attributesObj.ref,
            attributesObj.type,
          );
          delete attributesObj.ref;
        }
        lastObj.members.push(attributesObj);
        return;
      }
      if (line.startsWith('<node')) {
        lastObj = { attributes: attributesObj, type: 'node', tags: {} };
        return lastObj;
      }
      if (line.startsWith('</node>')) {
        return;
      }
      if (line.startsWith('<way')) {
        lastObj = {
          attributes: attributesObj,
          type: 'way',
          nodes: [],
          tags: {},
        };
        return lastObj;
      }
      if (line.startsWith('</way>')) {
        return;
      }
      if (line.startsWith('</relation>')) {
        return;
      }
      if (line.startsWith('<relation')) {
        lastObj = {
          attributes: attributesObj,
          type: 'relation',
          members: [],
          tags: {},
        };
        return lastObj;
      }
      if (line.startsWith('<?xml')) {
        return;
      }
      if (line.startsWith('<bounds')) {
        return;
      }
      if (line.startsWith('<osm')) {
        return;
      }
      if (line.startsWith('</osm>')) {
        return;
      }

      throw new Error(
        'Invalid osm xml, please use /api/0.6/map?bbox=left,bottom,right,top',
      );
    })
    .filter(r => r)
    .map(r => {
      r.attributes = parseVisibility(r.attributes);

      if (r.type === 'node') {
        return nodeFactory(
          {
            id: prependEntityChar(r.attributes.id, r.type),
            attributes: r.attributes,
            loc: {
              lon: parseFloat(r.attributes.lon),
              lat: parseFloat(r.attributes.lat),
            },
            tags: r.tags,
          },
          opts.freeze,
        );
      } else if (r.type === 'way') {
        return wayFactory(
          {
            id: prependEntityChar(r.attributes.id, r.type),
            attributes: r.attributes,
            tags: r.tags,
            nodes: r.nodes,
          },
          opts.freeze,
        );
      } else if (r.type === 'relation') {
        return relationFactory(
          {
            id: prependEntityChar(r.attributes.id, r.type),
            attributes: r.attributes,
            tags: r.tags,
            members: r.members,
          },
          opts.freeze,
        );
      } else {
        throw new Error('Unknown type ' + r.type);
      }
    });

  function parseVisibility(attr: any): boolean {
    attr.visible = !attr.visible || attr.visible !== 'false' ? true : false;
    return attr;
  }

  function prependEntityChar(id: string, type: string) {
    if (!opts.prependEntityChar) {
      return id;
    }
    return type.charAt(0) + id;
  }

  function parseAttributes(str: string) {
    return str
      .split('"')
      .reduce(
        (prev, val, index, arr) => {
          if (index % 2 === 1) {
            let key = arr[index - 1];
            prev.push([
              // key comes in the format '<node k=' or ' k='
              key.slice(key.lastIndexOf(' ') + 1, key.length - 1),
              val,
            ]);
          }
          return prev;
        },
        [] as Array<[string, string]>,
      )
      .reduce(
        (prev, cur) => {
          prev[cur[0]] = cur[1];
          return prev;
        },
        {} as { [index: string]: string },
      );
  }
}
