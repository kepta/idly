import { osmNode, osmWay, osmRelation, osmEntity } from 'src/osm/entity';
function getLoc(attrs) {
  var lon = attrs.lon && attrs.lon.value,
    lat = attrs.lat && attrs.lat.value;
  return [parseFloat(lon), parseFloat(lat)];
}
function getNodes(obj) {
  var elems = obj.getElementsByTagName('nd'),
    nodes = new Array(elems.length);
  for (var i = 0, l = elems.length; i < l; i++) {
    nodes[i] = 'n' + elems[i].attributes.ref.value;
  }
  return nodes;
}

function getTags(obj) {
  var elems = obj.getElementsByTagName('tag'),
    tags = {};
  for (var i = 0, l = elems.length; i < l; i++) {
    var attrs = elems[i].attributes;
    tags[attrs.k.value] = attrs.v.value;
  }
  return tags;
}

function getMembers(obj) {
  var elems = obj.getElementsByTagName('member'),
    members = new Array(elems.length);
  for (var i = 0, l = elems.length; i < l; i++) {
    var attrs = elems[i].attributes;
    members[i] = {
      id: attrs.type.value[0] + attrs.ref.value,
      type: attrs.type.value,
      role: attrs.role.value
    };
  }
  return members;
}

function getVisible(attrs) {
  return !attrs.visible || attrs.visible.value !== 'false';
}

var parsers = {
  node: function nodeData(obj) {
    var attrs = obj.attributes;
    return new osmNode({
      id: osmEntity.id.fromOSM('node', attrs.id.value),
      visible: getVisible(attrs),
      version: attrs.version.value,
      changeset: attrs.changeset && attrs.changeset.value,
      timestamp: attrs.timestamp && attrs.timestamp.value,
      user: attrs.user && attrs.user.value,
      uid: attrs.uid && attrs.uid.value,
      loc: getLoc(attrs),
      tags: getTags(obj)
    });
  },

  way: function wayData(obj) {
    var attrs = obj.attributes;
    return new osmWay({
      id: osmEntity.id.fromOSM('way', attrs.id.value),
      visible: getVisible(attrs),
      version: attrs.version.value,
      changeset: attrs.changeset && attrs.changeset.value,
      timestamp: attrs.timestamp && attrs.timestamp.value,
      user: attrs.user && attrs.user.value,
      uid: attrs.uid && attrs.uid.value,
      tags: getTags(obj),
      nodes: getNodes(obj)
    });
  },

  relation: function relationData(obj) {
    var attrs = obj.attributes;
    return new osmRelation({
      id: osmEntity.id.fromOSM('relation', attrs.id.value),
      visible: getVisible(attrs),
      version: attrs.version.value,
      changeset: attrs.changeset && attrs.changeset.value,
      timestamp: attrs.timestamp && attrs.timestamp.value,
      user: attrs.user && attrs.user.value,
      uid: attrs.uid && attrs.uid.value,
      tags: getTags(obj),
      members: getMembers(obj)
    });
  }
};

export function parse(xml) {
  if (!xml || !xml.childNodes) return;

  var root = xml.childNodes[0],
    children = root.childNodes,
    entities = [];

  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i],
      parser = parsers[child.nodeName];
    if (parser) {
      entities.push(parser(child));
    }
  }

  return entities;
}
