import { List, Map as ImmutableMap, Set } from 'immutable';

import { Entity } from 'osm/entities/entities';
import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { Way, wayFactory } from 'osm/entities/way';
import { genLngLat } from 'osm/geo_utils/lng_lat';

export type ParentWays = ImmutableMap<string, Set<string>>;

export function calculateParentWays(parentWays: ParentWays, ways: Way[]) {
  console.time('calculateParentWays');
  const x = parentWays.withMutations(p => {
    ways.forEach(w => {
      w.nodes.forEach((n, i) => {
        p.update(n, (s = Set()) => (s = s.add(w.id)));
      });
    });
  });
  console.timeEnd('calculateParentWays');
  return x;
}

export function parseXML(
  xml: XMLDocument,
  parentWays: ParentWays = ImmutableMap()
): {
  entities: Entity[];
  parentWays: ParentWays;
} {
  if (!xml || !xml.childNodes) return;

  const root = xml.childNodes[0];
  const children = root.childNodes;
  const entities: Entity[] = [];
  const nodesXML = [];
  const waysXML = [];
  const relationsXML = [];
  const group = {
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

  parentWays = calculateParentWays(parentWays, group.way);

  group.node = group.node.map(n => parsers.node(n, parentWays));

  return {
    entities: [...group.node, ...group.way, ...group.relation],
    parentWays
  };
}

function getVisible(attrs) {
  return !attrs.visible || attrs.visible.value !== 'false';
}

function getMembers(obj) {
  const elems = obj.getElementsByTagName('member');
  const members = new Array(elems.length);
  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    members[i] = ImmutableMap({
      id: attrs.type.value[0] + attrs.ref.value,
      type: attrs.type.value,
      role: attrs.role.value
    });
  }
  return List(members);
}

function getNodes(obj) {
  const elems = obj.getElementsByTagName('nd');
  const nodes = new Array(elems.length);
  for (let i = 0, l = elems.length; i < l; i++) {
    nodes[i] = 'n' + elems[i].attributes.ref.value;
  }
  return List(nodes);
}

function getTags(obj) {
  const elems = obj.getElementsByTagName('tag');
  const tags = {};
  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    tags[attrs.k.value] = attrs.v.value;
  }
  return tagsFactory(tags);
}

function getLoc(attrs) {
  const lon = attrs.lon && attrs.lon.value;
  const lat = attrs.lat && attrs.lat.value;
  return genLngLat([parseFloat(lon), parseFloat(lat)]);
}

const parsers = {
  node: function nodeData(obj, parentWays?) {
    const attrs = obj.attributes;
    const id = 'n' + attrs.id.value;
    return nodeFactory({
      id,
      properties: propertiesGen({
        visible: getVisible(attrs),
        version: attrs.version.value,
        timestamp: attrs.timestamp && attrs.timestamp.value,
        changeset: attrs.changeset && attrs.changeset.value,
        uid: attrs.uid && attrs.uid.value,
        user: attrs.user && attrs.user.value
      }),
      loc: getLoc(attrs),
      tags: getTags(obj)
      // geometry: getNodeGeometry(id, parentWays)
    });
  },

  way: function wayData(obj) {
    const attrs = obj.attributes;
    return wayFactory({
      id: 'w' + attrs.id.value,
      properties: propertiesGen({
        visible: getVisible(attrs),
        version: attrs.version.value,
        changeset: attrs.changeset && attrs.changeset.value,
        timestamp: attrs.timestamp && attrs.timestamp.value,
        user: attrs.user && attrs.user.value,
        uid: attrs.uid && attrs.uid.value
      }),
      tags: getTags(obj),
      nodes: getNodes(obj)
    });
    // return way.update('geometry', () => getWayGeometry(way, areaKeys));
  },

  relation: function relationData(obj) {
    const attrs = obj.attributes;
    return relationFactory({
      id: 'r' + attrs.id.value,
      properties: propertiesGen({
        visible: getVisible(attrs),
        version: attrs.version.value,
        changeset: attrs.changeset && attrs.changeset.value,
        timestamp: attrs.timestamp && attrs.timestamp.value,
        user: attrs.user && attrs.user.value,
        uid: attrs.uid && attrs.uid.value
      }),
      tags: getTags(obj),
      members: getMembers(obj)
    });
  }
};
