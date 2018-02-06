import { nodeFactory } from 'idly-common/lib/osm/entityFactory/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/entityFactory/relationFactory';
import { wayFactory } from 'idly-common/lib/osm/entityFactory/wayFactory';
import { Entity } from 'idly-common/lib/osm/structures';
import {
  Options,
  parseAttributes,
  parseVisibility,
  prependEntityChar,
  unescape,
} from './helpers';

export function xmlLineToObj(r: string, lastObj: any, opts: Options) {
  const line = r.trim();
  if (line === '') {
    return;
  }
  if (line[0] !== '<' || line[line.length - 1] !== '>') {
    throw new Error('unknown osm bbox xml format, ' + line);
  }

  const attributesObj = parseAttributes(line);
  if (line.startsWith('<nd')) {
    lastObj.pointer.nodes.push('n' + attributesObj.ref);
    return;
  }
  if (line.startsWith('<tag')) {
    lastObj.pointer.tags[attributesObj.k] = unescape(attributesObj.v);
    return;
  }
  if (line.startsWith('<member')) {
    attributesObj.id = prependEntityChar(
      attributesObj.ref,
      attributesObj.type,
      opts.prependEntityChar
    );
    attributesObj.ref = attributesObj.id;

    lastObj.pointer.members.push(attributesObj);
    return;
  }
  if (line.startsWith('<node')) {
    const toReturn = lastObj.pointer;
    lastObj.pointer = { attributes: attributesObj, type: 'node', tags: {} };
    return toReturn;
  }
  if (line.startsWith('</node>')) {
    return;
  }
  if (line.startsWith('<way')) {
    const toReturn = lastObj.pointer;
    lastObj.pointer = {
      attributes: attributesObj,
      type: 'way',
      nodes: [],
      tags: {},
    };
    return toReturn;
  }
  if (line.startsWith('</way>')) {
    return;
  }
  if (line.startsWith('<relation')) {
    const toReturn = lastObj.pointer;
    lastObj.pointer = {
      attributes: attributesObj,
      type: 'relation',
      members: [],
      tags: {},
    };
    return toReturn;
  }
  if (line.startsWith('</relation>')) {
    return;
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
    return lastObj.pointer;
  }

  throw new Error(
    'Invalid osm xml, please use /api/0.6/map?bbox=left,bottom,right,top'
  );
}

export function objToStandard(r: any, opts: Options): Entity {
  r.attributes = parseVisibility(r.attributes);

  if (r.type === 'node') {
    return nodeFactory(
      {
        id: prependEntityChar(r.attributes.id, r.type, opts.prependEntityChar),
        attributes: r.attributes,
        loc: {
          lon: parseFloat(r.attributes.lon),
          lat: parseFloat(r.attributes.lat),
        },
        tags: r.tags,
      },
      opts.freeze
    );
  } else if (r.type === 'way') {
    return wayFactory(
      {
        id: prependEntityChar(r.attributes.id, r.type, opts.prependEntityChar),
        attributes: r.attributes,
        tags: r.tags,
        nodes: r.nodes,
      },
      opts.freeze
    );
  } else if (r.type === 'relation') {
    return relationFactory(
      {
        id: prependEntityChar(r.attributes.id, r.type, opts.prependEntityChar),
        attributes: r.attributes,
        tags: r.tags,
        members: r.members,
      },
      opts.freeze
    );
  } else {
    throw new Error('Unknown type ' + r.type);
  }
}
