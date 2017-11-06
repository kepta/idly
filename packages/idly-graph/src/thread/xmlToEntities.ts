import { attributesGen } from 'idly-common/lib/osm/attributesGen';
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
  Tags,
  Way,
} from 'idly-common/lib/osm/structures';
import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

/**
 * Converts the osm xml to an array of Entity,
 * This implementation is inspired from the iD
 * editor. Please look into `Entity` for more details.
 * @param xml osm xml document
 */
export function xmlToEntities(xml: Document): Entity[] {
  if (!xml || !xml.childNodes) {
    return [];
  }
  let root = xml.childNodes[2];
  // tslint:disable no-expression-statement
  if (!root) {
    // TOFIX this is only added to let test cases pass
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
  // tslint:enable no-expression-statement

  return entities;
}

function getVisible(attrs: NamedNodeMap): boolean {
  return (
    !attrs.getNamedItem('visible') ||
    attrs.getNamedItem('visible').value !== 'false'
  );
}

function getMembers(obj: any): RelationMember[] {
  const elems = obj.getElementsByTagName('member');
  const members: RelationMember[] = [];
  const len = elems.length;
  for (let i = 0; i < len; i++) {
    const attrs = elems[i].attributes;
    // tslint:disable no-expression-statement
    members.push(
      relationMemberGen({
        id:
          attrs.getNamedItem('type').value[0] + attrs.getNamedItem('ref').value,
        role: attrs.getNamedItem('role').value,
        type: attrs.getNamedItem('type').value,
      }),
    );
    // tslint:enable no-expression-statement
  }
  return members;
}

function getNodes(obj: any): string[] {
  const elems = obj.getElementsByTagName('nd');
  const nodes: string[] = [];
  const len = elems.length;
  // tslint:disable no-expression-statement
  for (let i = 0; i < len; i++) {
    nodes.push('n' + elems[i].attributes.getNamedItem('ref').value);
  }
  // tslint:enable no-expression-statement
  return nodes;
}

function getTags(obj: any): Tags {
  const elems = obj.getElementsByTagName('tag');
  const t: any = {};

  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    t[attrs.getNamedItem('k').value] = attrs.getNamedItem('v').value;
  }
  return tagsFactory(t);
}

function getLoc(attrs: NamedNodeMap): LngLat {
  const lon = attrs.getNamedItem('lon') && attrs.getNamedItem('lon').value;
  const lat = attrs.getNamedItem('lat') && attrs.getNamedItem('lat').value;
  return genLngLat([parseFloat(lon), parseFloat(lat)]);
}

function nodeData(obj: Node): OSMNode {
  const attrs = obj.attributes;
  return nodeFactory({
    attributes: attributesGen({
      changeset:
        attrs.getNamedItem('changeset') &&
        attrs.getNamedItem('changeset').value,
      timestamp:
        attrs.getNamedItem('timestamp') &&
        attrs.getNamedItem('timestamp').value,
      uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value,
      user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value,
      version: attrs.getNamedItem('version').value,
      visible: getVisible(attrs),
    }),
    id: 'n' + attrs.getNamedItem('id').value,
    loc: getLoc(attrs),
    tags: getTags(obj),
  });
}

function relationData(obj: Node): Relation {
  const attrs = obj.attributes;
  return relationFactory({
    attributes: attributesGen({
      changeset:
        attrs.getNamedItem('changeset') &&
        attrs.getNamedItem('changeset').value,
      timestamp:
        attrs.getNamedItem('timestamp') &&
        attrs.getNamedItem('timestamp').value,
      uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value,
      user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value,
      version: attrs.getNamedItem('version').value,
      visible: getVisible(attrs),
    }),
    id: 'r' + attrs.getNamedItem('id').value,
    members: getMembers(obj),
    tags: getTags(obj),
  });
}

function wayData(obj: Node): Way {
  const attrs = obj.attributes;
  return wayFactory({
    attributes: attributesGen({
      changeset:
        attrs.getNamedItem('changeset') &&
        attrs.getNamedItem('changeset').value,
      timestamp:
        attrs.getNamedItem('timestamp') &&
        attrs.getNamedItem('timestamp').value,
      uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value,
      user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value,
      version: attrs.getNamedItem('version').value,
      visible: getVisible(attrs),
    }),
    id: 'w' + attrs.getNamedItem('id').value,
    nodes: getNodes(obj),
    tags: getTags(obj),
  });
}
