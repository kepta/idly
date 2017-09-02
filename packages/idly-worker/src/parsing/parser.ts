import { deepFreeze } from 'idly-common/lib/misc/deepFreeze';
import { ImMap, ImSet } from 'idly-common/lib/misc/immutable';
import { attributesGen } from 'idly-common/lib/osm/attributesGen';
import { genLngLat } from 'idly-common/lib/osm/genLngLat';
import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { relationFactory } from 'idly-common/lib/osm/relationFactory';
import { relationMemberGen } from 'idly-common/lib/osm/relationMemberGen';
import {
  Entity,
  EntityId,
  EntityTable,
  Node,
  ParentWays,
  Relation,
  Tags,
  Way
} from 'idly-common/lib/osm/structures';
import { tagsFactory } from 'idly-common/lib/osm/tagsFactory';
import { wayFactory } from 'idly-common/lib/osm/wayFactory';

export function calculateParentWays(parentWays: ParentWays, ways: Way[]) {
  console.time('Imm: calculateParentWays');
  const x = parentWays.withMutations(p => {
    ways.forEach(w => {
      w.nodes.forEach(nodeId => {
        p.update(nodeId, (s = ImSet()) => s.add(w.id));
      });
    });
  });
  console.timeEnd('Imm: calculateParentWays');
  return x;
}

const xmlIndex = process.env.NODE_ENV === 'test' ? 0 : 2;
/**
 * @NOTE parseXML doesnt care if there are duplicates
 *  as this helps in removing a particular tile
 *  and still maintaining the duplicated entity in other
 *  tile. If in case we started screening duplicates
 *  this might remove an entity which might span across
 *  multiple tiles.
 * @param xml
 * @param parentWays
 */
export function parseXML(
  xml: Document | undefined,
  parentWays: ParentWays = ImMap()
):
  | undefined
  | {
      entities: Entity[];
      parentWays: ParentWays;
    } {
  if (!xml || !xml.childNodes) return;
  const root = xml.childNodes[xmlIndex];

  const children = root.childNodes;
  const entities: Entity[] = [];
  const nodesXML: any = [];
  const waysXML: any = [];
  const relationsXML: any = [];
  const group: {
    node: Node[];
    way: Way[];
    relation: Relation[];
  } = {
    node: [],
    way: [],
    relation: []
  };
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i];
    const parser = group[child.nodeName];
    if (parser) group[child.nodeName].push(child);
  }

  group.relation = group.relation.map(parsers.relation);
  group.way = group.way.map(w => parsers.way(w));

  // calculateParentWays right at this point allows us
  // to pass the parsed group.way which is needed to
  // calculate parentWays.
  // @NOTE calculateParentWays directly mutates
  //  I want to change this behaviour
  // parentWays = calculateParentWays(parentWays, group.way);

  parentWays = calculateParentWays(parentWays, group.way);

  group.node = group.node.map(n => parsers.node(n));

  return {
    entities: [...group.node, ...group.way, ...group.relation],
    parentWays
  };
}

function getVisible(attrs) {
  return (
    !attrs.getNamedItem('visible') ||
    attrs.getNamedItem('visible').value !== 'false'
  );
}

function getMembers(obj) {
  const elems = obj.getElementsByTagName('member');
  const members = new Array(elems.length);
  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    members[i] = relationMemberGen({
      id: attrs.getNamedItem('type').value[0] + attrs.getNamedItem('ref').value,
      type: attrs.getNamedItem('type').value,
      role: attrs.getNamedItem('role').value
    });
  }
  return members;
}

function getNodes(obj) {
  const elems = obj.getElementsByTagName('nd');
  const nodes = new Array(elems.length);
  for (let i = 0, l = elems.length; i < l; i++) {
    nodes[i] = 'n' + elems[i].attributes.getNamedItem('ref').value;
  }
  return nodes;
}

function getTags(obj): Tags {
  const elems = obj.getElementsByTagName('tag');
  const t: Array<[string, string]> = [];
  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    t.push([attrs.getNamedItem('k').value, attrs.getNamedItem('v').value]);
  }
  return tagsFactory(t);
}

function getLoc(attrs) {
  const lon = attrs.getNamedItem('lon') && attrs.getNamedItem('lon').value;
  const lat = attrs.getNamedItem('lat') && attrs.getNamedItem('lat').value;
  return genLngLat([parseFloat(lon), parseFloat(lat)]);
}

const parsers = {
  node: function nodeData(obj) {
    const attrs = obj.attributes;
    const id = 'n' + attrs.getNamedItem('id').value;
    return nodeFactory({
      id,
      attributes: attributesGen({
        visible: getVisible(attrs),
        version: attrs.getNamedItem('version').value,
        timestamp:
          attrs.getNamedItem('timestamp') &&
          attrs.getNamedItem('timestamp').value,
        changeset:
          attrs.getNamedItem('changeset') &&
          attrs.getNamedItem('changeset').value,
        uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value,
        user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value
      }),
      loc: getLoc(attrs),
      tags: getTags(obj)
    });
  },

  way: function wayData(obj) {
    const attrs = obj.attributes;
    return wayFactory({
      id: 'w' + attrs.getNamedItem('id').value,
      attributes: attributesGen({
        visible: getVisible(attrs),
        version: attrs.getNamedItem('version').value,
        changeset:
          attrs.getNamedItem('changeset') &&
          attrs.getNamedItem('changeset').value,
        timestamp:
          attrs.getNamedItem('timestamp') &&
          attrs.getNamedItem('timestamp').value,
        user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value,
        uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value
      }),
      tags: getTags(obj),
      nodes: getNodes(obj)
    });
  },

  relation: function relationData(obj) {
    const attrs = obj.attributes;
    return relationFactory({
      id: 'r' + attrs.getNamedItem('id').value,
      attributes: attributesGen({
        visible: getVisible(attrs),
        version: attrs.getNamedItem('version').value,
        changeset:
          attrs.getNamedItem('changeset') &&
          attrs.getNamedItem('changeset').value,
        timestamp:
          attrs.getNamedItem('timestamp') &&
          attrs.getNamedItem('timestamp').value,
        user: attrs.getNamedItem('user') && attrs.getNamedItem('user').value,
        uid: attrs.getNamedItem('uid') && attrs.getNamedItem('uid').value
      }),
      tags: getTags(obj),
      members: getMembers(obj)
    });
  }
};
