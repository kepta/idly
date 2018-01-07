import unescape = require('lodash.unescape');

import { Entity } from 'idly-common/lib/osm/structures';
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/relationFactory';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

export default smartParser;

export function smartParser(str: string): Entity[] {
  let lastObj: any = {};

  return str
    .split('\n')
    .map((r: string) => {
      const p = r.trim();
      if (p === '') {
        return;
      }
      if (p[0] !== '<' || p[p.length - 1] !== '>') {
        throw new Error('unknown osm bbox xml format, ' + p);
      }

      const attributesObj = p
        .split('"')
        .reduce(
          (prev, cur, index, arr) => {
            if (index % 2 === 1) {
              let before = arr[index - 1];
              prev.push([
                before.slice(before.lastIndexOf(' ') + 1, before.length - 1),
                cur
              ]);
            }
            return prev;
          },
          [] as string[][]
        )
        .reduce(
          (prev: { [index: string]: string | null }, cur: [string, string]) => {
            prev[cur[0]] = cur[1] != null ? cur[1] : null; // TOFIX might wanna move away from null :{}
            return prev;
          },
          {}
        );

      if (p.startsWith('<nd')) {
        lastObj.nodes.push('n' + attributesObj.ref);
        return; // 4732
      } else if (p.startsWith('<tag')) {
        lastObj.tags[attributesObj.k] = unescape(attributesObj.v);
        return; // 4361
      } else if (p.startsWith('<member')) {
        attributesObj.id = attributesObj.type.charAt(0) + attributesObj.ref;
        delete attributesObj.ref;
        lastObj.members.push(attributesObj);
        return; // 4024
      } else if (p.startsWith('<node')) {
        // 3241
        lastObj = { attributes: attributesObj, type: 'node', tags: {} };
        return lastObj;
      } else if (p.startsWith('</node>')) {
        return; //422
      } else if (p.startsWith('<way')) {
        lastObj = {
          attributes: attributesObj,
          type: 'way',
          nodes: [],
          tags: {}
        };
        return lastObj; // 504
      } else if (p.startsWith('</way>')) {
        return; //504
      } else if (p.startsWith('</relation>')) {
        return; //51
      } else if (p.startsWith('<relation')) {
        lastObj = {
          attributes: attributesObj,
          type: 'relation',
          members: [],
          tags: {}
        };
        return lastObj; // 51
      } else if (p.startsWith('<?xml')) {
        return;
      } else if (p.startsWith('<bounds')) {
        return;
      } else if (p.startsWith('<osm')) {
        return;
      } else if (p.startsWith('</osm>')) {
        return;
      }
      throw new Error('what shit man?');
    })
    .filter(r => r)
    .map(r => {
      if (r.type === 'node') {
        return nodeFactory(
          {
            id: r.type.charAt(0) + r.attributes.id,
            attributes: r.attributes,
            loc: {
              lon: parseFloat(r.attributes.lon),
              lat: parseFloat(r.attributes.lat)
            },
            tags: r.tags
          },
          false
        );
      } else if (r.type === 'way') {
        return wayFactory(
          {
            id: r.type.charAt(0) + r.attributes.id,
            attributes: r.attributes,
            tags: r.tags,
            nodes: r.nodes
          },
          false
        );
      } else if (r.type === 'relation') {
        return relationFactory({
          id: r.type.charAt(0) + r.attributes.id,
          attributes: r.attributes,
          tags: r.tags,
          members: r.members
        });
      } else {
        throw new Error('what type ' + JSON.stringify(r));
      }
    });
}
