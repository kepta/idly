import { List, Map as ImmutableMap } from 'immutable';

import { Geometry } from 'osm/entities/constants';
import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { Way, wayFactory } from 'osm/entities/way';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { AreaKeys } from 'osm/presets/areaKeys';
// import { calculateParentWays } from 'core/coreOperations';

export type ParentWays = Map<string, Set<string>>;
/**
 * @REVISIT to differentiate between edge vertex and middle vertex
 *  visit here, I guess one should be able to calculate it from this point.
 *  Though I still dont know what would be the best way to figure out
 *  if a node is shared between two ways.
 *  this does not guarantee that the geometry is shared
 */
export function calculateParentWays(parentWays: ParentWays, ways: Way[]) {
  ways.forEach(w => {
    const closed = isClosed(w);
    w.nodes.forEach((n, i) => {
      if (!parentWays.has(n)) parentWays.set(n, new Set([w.id]));
      else {
        parentWays.get(n).add(w.id);
      }
    });
  });
  return parentWays;
}
export function parseXML(
  xml: Document,
  areaKeys: AreaKeys = ImmutableMap(),
  parentWays: ParentWays = new Map()
) {
  if (!xml || !xml.childNodes) return;

  const root = xml.childNodes[0];
  const children = root.childNodes;
  const entities = [];
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
  group.way = group.way.map(w => parsers.way(w, areaKeys));

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
      tags: getTags(obj),
      geometry: getNodeGeometry(id, parentWays)
    });
  },

  way: function wayData(obj, areaKeys?) {
    const attrs = obj.attributes;
    const way = wayFactory({
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
    return way.update('geometry', () => getWayGeometry(way, areaKeys));
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

/**
 *  @REVISIT
 *   I am not sure about this,
 *   // mosty holds// 1st if <way><n id=X></way> I should have node X in the same request.
 *   // proved wrong// 2nd if node id=Y I should have all the ways having Y in the same request.
 *
 * @REVISIT
 *  need to test / figure out how to handle 2nd point above ^^.
 *  so this guy at sagas would simply filter away this new node information
 *  wrapped in way coming in any subsequent request. hence our node would
 *  not get the new status or VERTEX_SHARED
 */
export function getNodeGeometry(id, parentWays?: ParentWays) {
  if (parentWays && parentWays.get(id))
    return parentWays.get(id).size > 1
      ? Geometry.VERTEX_SHARED
      : Geometry.VERTEX;
  return Geometry.POINT;
}

export function getWayGeometry(way: Way, areaKeys: AreaKeys = ImmutableMap()) {
  if (way.tags.get('area') === 'yes') return Geometry.AREA;

  if (!isClosed(way) || way.tags.get('area') === 'no') return Geometry.LINE;
  const keys = way.tags.keySeq();
  let found = false;
  way.tags.forEach((v, key) => {
    if (areaKeys.has(key) && !areaKeys.get(key).has(v)) {
      found = true;
      return false;
    }
  });
  return found ? Geometry.AREA : Geometry.LINE;
}

export function isClosed(way: Way) {
  return way.nodes.size > 1 && way.nodes.first() === way.nodes.last();
}
