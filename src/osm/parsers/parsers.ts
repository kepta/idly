import { List, Map } from 'immutable';
import { attachToWindow } from 'utils/attach_to_window';

import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { wayFactory } from 'osm/entities/way';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { propertiesGen } from 'osm/others/properties';
import { tagsFactory } from 'osm/others/tags';

export function parseXML(xml: Document) {
  if (!xml || !xml.childNodes) return;

  const root = xml.childNodes[0];
  const children = root.childNodes;
  const entities = [];
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i];
    const parser = parsers[child.nodeName];
    if (parser) {
      entities.push(parser(child));
    }
  }
  return entities;
}

function getVisible(attrs) {
  return !attrs.visible || attrs.visible.value !== 'false';
}

function getMembers(obj) {
  const elems = obj.getElementsByTagName('member');
  const members = new Array(elems.length);
  for (let i = 0, l = elems.length; i < l; i++) {
    const attrs = elems[i].attributes;
    members[i] = Map({
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
  node: function nodeData(obj) {
    const attrs = obj.attributes;
    return nodeFactory({
      id: 'n' + attrs.id.value,
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
