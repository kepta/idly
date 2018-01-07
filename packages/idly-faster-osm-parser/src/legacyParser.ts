import { genLngLat } from 'idly-common/lib/osm/genLngLat';
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/relationFactory';
import { relationMemberGen } from 'idly-common/lib/osm/relationMemberGen';
import {
  Entity,
  LngLat,
  Node as OSMNode,
  Relation,
  RelationMember,
  Way
} from 'idly-common/lib/osm/structures';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

/**
 * Converts the osm xml to an array of Entity,
 * This implementation is a port from iD.
 */
export function legacyParser(xml: Document): Entity[] {
  if (!xml || !xml.childNodes) {
    return [];
  }
  let root = xml.childNodes[2];
  if (!root) {
    root = xml.childNodes[0];
  }
  const children = root.childNodes;
  const entities: Entity[] = [];
  const len = children.length;
  for (let i = 0; i < len; i++) {
    const child = children[i];
    if (child.nodeName === 'node') {
      entities.push(nodeData(child));
    } else if (child.nodeName === 'relation') {
      entities.push(relationData(child));
    } else if (child.nodeName === 'way') {
      entities.push(wayData(child));
    }
  }
  return entities;
}

function getVisible(attrs: NamedNodeMap): string {
  return !attrs.getNamedItem('visible') ||
    attrs.getNamedItem('visible').value !== 'false'
    ? 'true'
    : 'false';
}

function getMembers(obj: any): RelationMember[] {
  const elems = obj.getElementsByTagName('member');
  const members: RelationMember[] = [];
  const len = elems.length;
  for (let i = 0; i < len; i++) {
    const attrs = elems[i].attributes;
    members.push(
      relationMemberGen({
        id:
          attrs.getNamedItem('type').value[0] + attrs.getNamedItem('ref').value,
        role: attrs.getNamedItem('role').value,
        type: attrs.getNamedItem('type').value
      })
    );
  }
  return members;
}

function getNodes(obj: any): string[] {
  const elems = obj.getElementsByTagName('nd');
  const nodes: string[] = [];
  const len = elems.length;
  for (let i = 0; i < len; i++) {
    nodes.push('n' + elems[i].attributes.getNamedItem('ref').value);
  }
  return nodes;
}

function getTags(obj: any): { [index: string]: string } {
  const elems = obj.getElementsByTagName('tag');
  const t: any = {};

  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    t[attrs.getNamedItem('k').value] = attrs.getNamedItem('v').value;
  }
  return t;
}

function getLoc(attrs: NamedNodeMap): LngLat {
  const lon = attrs.getNamedItem('lon') && attrs.getNamedItem('lon').value;
  const lat = attrs.getNamedItem('lat') && attrs.getNamedItem('lat').value;
  return genLngLat([parseFloat(lon), parseFloat(lat)]);
}

function nodeData(obj: Node): OSMNode {
  const attrs = obj.attributes;
  return nodeFactory(
    {
      attributes: {
        changeset: attrs.getNamedItem('changeset')
          ? attrs.getNamedItem('changeset').value
          : undefined,
        timestamp: attrs.getNamedItem('timestamp')
          ? attrs.getNamedItem('timestamp').value
          : undefined,
        uid: attrs.getNamedItem('uid')
          ? attrs.getNamedItem('uid').value
          : undefined,
        user: attrs.getNamedItem('user')
          ? attrs.getNamedItem('user').value
          : undefined,
        version: attrs.getNamedItem('version').value,
        visible: getVisible(attrs) as boolean
      },
      id: 'n' + attrs.getNamedItem('id').value,
      loc: getLoc(attrs),
      tags: getTags(obj)
    },
    false
  );
}

function relationData(obj: Node): Relation {
  const attrs = obj.attributes;
  return relationFactory(
    {
      attributes: {
        changeset: attrs.getNamedItem('changeset')
          ? attrs.getNamedItem('changeset').value
          : undefined,
        timestamp: attrs.getNamedItem('timestamp')
          ? attrs.getNamedItem('timestamp').value
          : undefined,
        uid: attrs.getNamedItem('uid')
          ? attrs.getNamedItem('uid').value
          : undefined,
        user: attrs.getNamedItem('user')
          ? attrs.getNamedItem('user').value
          : undefined,
        version: attrs.getNamedItem('version').value,
        visible: getVisible(attrs) as boolean
      },
      id: 'r' + attrs.getNamedItem('id').value,
      members: getMembers(obj),
      tags: getTags(obj)
    },
    false
  );
}

function wayData(obj: Node): Way {
  const attrs = obj.attributes;
  return wayFactory(
    {
      attributes: {
        changeset: attrs.getNamedItem('changeset')
          ? attrs.getNamedItem('changeset').value
          : undefined,
        timestamp: attrs.getNamedItem('timestamp')
          ? attrs.getNamedItem('timestamp').value
          : undefined,
        uid: attrs.getNamedItem('uid')
          ? attrs.getNamedItem('uid').value
          : undefined,
        user: attrs.getNamedItem('user')
          ? attrs.getNamedItem('user').value
          : undefined,
        version: attrs.getNamedItem('version').value,
        visible: getVisible(attrs) as boolean
      },
      id: 'w' + attrs.getNamedItem('id').value,
      nodes: getNodes(obj),
      tags: getTags(obj)
    },
    false
  );
}
