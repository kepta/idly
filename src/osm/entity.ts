import * as _ from 'lodash';
// // import { debug } from '../index';
// import { osmRelation } from 'src/osm/relation';
// import { osmWay } from 'src/osm/way';
// import { osmNode } from 'src/osm/node';
import { geoArea } from 'd3';
import { osmJoinWays } from 'src/osm/multipolygon';
import { dataDeprecated } from './deprecated';
import {
  osmIsInterestingTag,
  geoExtent,
  geoCross,
  osmOneWayTags,
  geoPolygonContainsPolygon,
  geoPolygonIntersectsPolygon
} from './helper';
import { osmLanes } from './lanes';

export function osmEntity(attrs): void {
  // For prototypal inheritance.
  if (this instanceof osmEntity) return;

  // Create the appropriate subtype.
  if (attrs && attrs.type) {
    return osmEntity[attrs.type].apply(this, arguments);
  } else if (attrs && attrs.id) {
    return osmEntity[osmEntity.id.type(attrs.id)].apply(this, arguments);
  }
  // if (attrs && attrs.type) {
  //   switch (attrs.type) {
  //     case 'relation':
  //       return osmRelation.apply(this, arguments);
  //     case 'node':
  //       return osmNode.apply(this, arguments);
  //     case 'way':
  //       return osmWay.apply(this, arguments);
  //   }
  //   // return osmEntity[attrs.type].apply(this, arguments);
  // } else if (attrs && attrs.id) {
  //   switch (attrs.id[0]) {
  //     case 'r':
  //       return osmRelation.apply(this, arguments);
  //     case 'n':
  //       return osmNode.apply(this, arguments);
  //     case 'w':
  //       return osmWay.apply(this, arguments);
  //   }
  //   // return osmEntity[osmEntity.id.type(attrs.id)].apply(this, arguments);
  // }

  // Initialize a generic Entity (used only in tests).
  return new osmEntity().initialize(arguments);
}

osmEntity.id = function(type) {
  return osmEntity.id.fromOSM(type, osmEntity.id.next[type]--);
};

osmEntity.id.next = {
  changeset: -1,
  node: -1,
  way: -1,
  relation: -1
};

osmEntity.id.fromOSM = function(type, id) {
  return type[0] + id;
};

osmEntity.id.toOSM = function(id) {
  return id.slice(1);
};

osmEntity.id.type = function(id) {
  return { c: 'changeset', n: 'node', w: 'way', r: 'relation' }[id[0]];
};

// A function suitable for use as the second argument to d3.selection#data().
osmEntity.key = function(entity) {
  return entity.id + 'v' + (entity.v || 0);
};

osmEntity.prototype = {
  tags: {},

  initialize: function(sources) {
    for (var i = 0; i < sources.length; ++i) {
      var source = sources[i];
      for (var prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          if (source[prop] === undefined) {
            delete this[prop];
          } else {
            this[prop] = source[prop];
          }
        }
      }
    }

    if (!this.id && this.type) {
      this.id = osmEntity.id(this.type);
    }
    if (!this.hasOwnProperty('visible')) {
      this.visible = true;
    }

    // if (debug) {
    //   Object.freeze(this);
    //   Object.freeze(this.tags);

    //   if (this.loc) Object.freeze(this.loc);
    //   if (this.nodes) Object.freeze(this.nodes);
    //   if (this.members) Object.freeze(this.members);
    // }

    return this;
  },

  copy: function(resolver, copies) {
    if (copies[this.id]) return copies[this.id];

    var copy = osmEntity(this, {
      id: undefined,
      user: undefined,
      version: undefined
    });
    copies[this.id] = copy;

    return copy;
  },

  osmId: function() {
    return osmEntity.id.toOSM(this.id);
  },

  isNew: function() {
    return this.osmId() < 0;
  },

  update: function(attrs) {
    return osmEntity(this, attrs, { v: 1 + (this.v || 0) });
  },

  mergeTags: function(tags) {
    var merged = _.clone(this.tags),
      changed = false;
    for (var k in tags) {
      var t1 = merged[k],
        t2 = tags[k];
      if (!t1) {
        changed = true;
        merged[k] = t2;
      } else if (t1 !== t2) {
        changed = true;
        merged[k] = _.union(t1.split(/;\s*/), t2.split(/;\s*/)).join(';');
      }
    }
    return changed ? this.update({ tags: merged }) : this;
  },

  intersects: function(extent, resolver) {
    return this.extent(resolver).intersects(extent);
  },

  isUsed: function(resolver) {
    return (
      _.without(Object.keys(this.tags), 'area').length > 0 ||
      resolver.parentRelations(this).length > 0
    );
  },

  hasInterestingTags: function() {
    return _.keys(this.tags).some(osmIsInterestingTag);
  },

  isHighwayIntersection: function() {
    return false;
  },

  isDegenerate: function() {
    return true;
  },

  deprecatedTags: function() {
    var tags = _.toPairs(this.tags);
    var deprecated = {};

    dataDeprecated.forEach(function(d) {
      var match = _.toPairs(d.old)[0];
      tags.forEach(function(t) {
        if (t[0] === match[0] && (t[1] === match[1] || match[1] === '*')) {
          deprecated[t[0]] = t[1];
        }
      });
    });

    return deprecated;
  }
};
/*osmNode*/

export function osmNode(): void {
  if (!(this instanceof osmNode)) {
    return new osmNode().initialize(arguments);
  } else if (arguments.length) {
    this.initialize(arguments);
  }
}
osmEntity.node = osmNode;

osmNode.prototype = Object.create(osmEntity.prototype);

_.extend(osmNode.prototype, {
  type: 'node',

  extent: function() {
    return new geoExtent(this.loc);
  },

  geometry: function(graph) {
    return graph.transient(this, 'geometry', function() {
      return graph.isPoi(this) ? 'point' : 'vertex';
    });
  },

  move: function(loc) {
    return this.update({ loc: loc });
  },

  isDegenerate: function() {
    return !(
      Array.isArray(this.loc) &&
      this.loc.length === 2 &&
      this.loc[0] >= -180 &&
      this.loc[0] <= 180 &&
      this.loc[1] >= -90 &&
      this.loc[1] <= 90
    );
  },

  isEndpoint: function(resolver) {
    return resolver.transient(this, 'isEndpoint', function() {
      var id = this.id;
      return (
        resolver.parentWays(this).filter(function(parent) {
          return !parent.isClosed() && !!parent.affix(id);
        }).length > 0
      );
    });
  },

  isConnected: function(resolver) {
    return resolver.transient(this, 'isConnected', function() {
      var parents = resolver.parentWays(this);

      function isLine(entity) {
        return (
          entity.geometry(resolver) === 'line' && entity.hasInterestingTags()
        );
      }

      // vertex is connected to multiple parent lines
      if (parents.length > 1 && _.some(parents, isLine)) {
        return true;
      } else if (parents.length === 1) {
        var way = parents[0],
          nodes = way.nodes.slice();
        if (way.isClosed()) {
          nodes.pop();
        } // ignore connecting node if closed

        // return true if vertex appears multiple times (way is self intersecting)
        return nodes.indexOf(this.id) !== nodes.lastIndexOf(this.id);
      }

      return false;
    });
  },

  isIntersection: function(resolver) {
    return resolver.transient(this, 'isIntersection', function() {
      return (
        resolver.parentWays(this).filter(function(parent) {
          return (
            (parent.tags.highway ||
              parent.tags.waterway ||
              parent.tags.railway ||
              parent.tags.aeroway) &&
            parent.geometry(resolver) === 'line'
          );
        }).length > 1
      );
    });
  },

  isHighwayIntersection: function(resolver) {
    return resolver.transient(this, 'isHighwayIntersection', function() {
      return (
        resolver.parentWays(this).filter(function(parent) {
          return parent.tags.highway && parent.geometry(resolver) === 'line';
        }).length > 1
      );
    });
  },

  isOnAddressLine: function(resolver) {
    return resolver.transient(this, 'isOnAddressLine', function() {
      return (
        resolver.parentWays(this).filter(function(parent) {
          return (
            parent.tags.hasOwnProperty('addr:interpolation') &&
            parent.geometry(resolver) === 'line'
          );
        }).length > 0
      );
    });
  },

  asJXON: function(changeset_id) {
    var r = {
      node: {
        '@id': this.osmId(),
        '@lon': this.loc[0],
        '@lat': this.loc[1],
        '@version': this.version || 0,
        tag: _.map(this.tags, function(v, k) {
          return { keyAttributes: { k: k, v: v } };
        })
      }
    };
    if (changeset_id) r.node['@changeset'] = changeset_id;
    return r;
  },

  asGeoJSON: function() {
    return {
      type: 'Point',
      coordinates: this.loc
    };
  }
});

/*way*/

var areaKeys = {};

export function osmWay() {
  if (!(this instanceof osmWay)) {
    return new osmWay().initialize(arguments);
  } else if (arguments.length) {
    this.initialize(arguments);
  }
}

osmEntity.way = osmWay;

osmWay.prototype = Object.create(osmEntity.prototype);

_.extend(osmWay.prototype, {
  type: 'way',
  nodes: [],

  copy: function(resolver, copies) {
    if (copies[this.id]) return copies[this.id];

    var copy = osmEntity.prototype.copy.call(this, resolver, copies);

    var nodes = this.nodes.map(function(id) {
      return resolver.entity(id).copy(resolver, copies).id;
    });

    copy = copy.update({ nodes: nodes });
    copies[this.id] = copy;

    return copy;
  },

  extent: function(resolver) {
    return resolver.transient(this, 'extent', function() {
      var extent = geoExtent();
      for (var i = 0; i < this.nodes.length; i++) {
        var node = resolver.hasEntity(this.nodes[i]);
        if (node) {
          extent._extend(node.extent());
        }
      }
      return extent;
    });
  },

  first: function() {
    return this.nodes[0];
  },

  last: function() {
    return this.nodes[this.nodes.length - 1];
  },

  contains: function(node) {
    return this.nodes.indexOf(node) >= 0;
  },

  affix: function(node) {
    if (this.nodes[0] === node) return 'prefix';
    if (this.nodes[this.nodes.length - 1] === node) return 'suffix';
  },

  layer: function() {
    // explicit layer tag, clamp between -10, 10..
    if (isFinite(this.tags.layer)) {
      return Math.max(-10, Math.min(+this.tags.layer, 10));
    }

    // implied layer tag..
    if (this.tags.location === 'overground') return 1;
    if (this.tags.location === 'underground') return -1;
    if (this.tags.location === 'underwater') return -10;

    if (this.tags.power === 'line') return 10;
    if (this.tags.power === 'minor_line') return 10;
    if (this.tags.aerialway) return 10;
    if (this.tags.bridge) return 1;
    if (this.tags.cutting) return -1;
    if (this.tags.tunnel) return -1;
    if (this.tags.waterway) return -1;
    if (this.tags.man_made === 'pipeline') return -10;
    if (this.tags.boundary) return -10;
    return 0;
  },

  isOneWay: function() {
    // explicit oneway tag..
    if (['yes', '1', '-1'].indexOf(this.tags.oneway) !== -1) {
      return true;
    }
    if (['no', '0'].indexOf(this.tags.oneway) !== -1) {
      return false;
    }

    // implied oneway tag..
    for (var key in this.tags) {
      if (key in osmOneWayTags && this.tags[key] in osmOneWayTags[key])
        return true;
    }
    return false;
  },

  lanes: function() {
    return osmLanes(this);
  },

  isClosed: function() {
    return this.nodes.length > 1 && this.first() === this.last();
  },

  isConvex: function(resolver) {
    if (!this.isClosed() || this.isDegenerate()) return null;

    var nodes = _.uniq(resolver.childNodes(this)),
      coords = _.map(nodes, 'loc'),
      curr = 0,
      prev = 0;

    for (var i = 0; i < coords.length; i++) {
      var o = coords[(i + 1) % coords.length],
        a = coords[i],
        b = coords[(i + 2) % coords.length],
        res = geoCross(o, a, b);

      curr = res > 0 ? 1 : res < 0 ? -1 : 0;
      if (curr === 0) {
        continue;
      } else if (prev && curr !== prev) {
        return false;
      }
      prev = curr;
    }
    return true;
  },

  isArea: function() {
    if (this.tags.area === 'yes') return true;
    if (!this.isClosed() || this.tags.area === 'no') return false;
    for (var key in this.tags) {
      if (key in areaKeys && !(this.tags[key] in areaKeys[key])) {
        return true;
      }
    }
    return false;
  },

  isDegenerate: function() {
    return _.uniq(this.nodes).length < (this.isArea() ? 3 : 2);
  },

  areAdjacent: function(n1, n2) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] === n1) {
        if (this.nodes[i - 1] === n2) return true;
        if (this.nodes[i + 1] === n2) return true;
      }
    }
    return false;
  },

  geometry: function(graph) {
    return graph.transient(this, 'geometry', function() {
      return this.isArea() ? 'area' : 'line';
    });
  },

  // If this way is not closed, append the beginning node to the end of the nodelist to close it.
  close: function() {
    if (this.isClosed() || !this.nodes.length) return this;

    var nodes = this.nodes.slice();
    nodes = nodes.filter(noRepeatNodes);
    nodes.push(nodes[0]);
    return this.update({ nodes: nodes });
  },

  // If this way is closed, remove any connector nodes from the end of the nodelist to unclose it.
  unclose: function() {
    if (!this.isClosed()) return this;

    var nodes = this.nodes.slice(),
      connector = this.first(),
      i = nodes.length - 1;

    // remove trailing connectors..
    while (i > 0 && nodes.length > 1 && nodes[i] === connector) {
      nodes.splice(i, 1);
      i = nodes.length - 1;
    }

    nodes = nodes.filter(noRepeatNodes);
    return this.update({ nodes: nodes });
  },

  // Adds a node (id) in front of the node which is currently at position index.
  // If index is undefined, the node will be added to the end of the way for linear ways,
  //   or just before the final connecting node for circular ways.
  // Consecutive duplicates are eliminated including existing ones.
  // Circularity is always preserved when adding a node.
  addNode: function(id, index) {
    var nodes = this.nodes.slice(),
      isClosed = this.isClosed(),
      max = isClosed ? nodes.length - 1 : nodes.length;

    if (index === undefined) {
      index = max;
    }

    if (index < 0 || index > max) {
      throw new RangeError('index ' + index + ' out of range 0..' + max);
    }

    // If this is a closed way, remove all connector nodes except the first one
    // (there may be duplicates) and adjust index if necessary..
    if (isClosed) {
      var connector = this.first();

      // leading connectors..
      var i = 1;
      while (i < nodes.length && nodes.length > 2 && nodes[i] === connector) {
        nodes.splice(i, 1);
        if (index > i) index--;
      }

      // trailing connectors..
      i = nodes.length - 1;
      while (i > 0 && nodes.length > 1 && nodes[i] === connector) {
        nodes.splice(i, 1);
        if (index > i) index--;
        i = nodes.length - 1;
      }
    }

    nodes.splice(index, 0, id);
    nodes = nodes.filter(noRepeatNodes);

    // If the way was closed before, append a connector node to keep it closed..
    if (
      isClosed &&
      (nodes.length === 1 || nodes[0] !== nodes[nodes.length - 1])
    ) {
      nodes.push(nodes[0]);
    }

    return this.update({ nodes: nodes });
  },

  // Replaces the node which is currently at position index with the given node (id).
  // Consecutive duplicates are eliminated including existing ones.
  // Circularity is preserved when updating a node.
  updateNode: function(id, index) {
    var nodes = this.nodes.slice(),
      isClosed = this.isClosed(),
      max = nodes.length - 1;

    if (index === undefined || index < 0 || index > max) {
      throw new RangeError('index ' + index + ' out of range 0..' + max);
    }

    // If this is a closed way, remove all connector nodes except the first one
    // (there may be duplicates) and adjust index if necessary..
    if (isClosed) {
      var connector = this.first();

      // leading connectors..
      var i = 1;
      while (i < nodes.length && nodes.length > 2 && nodes[i] === connector) {
        nodes.splice(i, 1);
        if (index > i) index--;
      }

      // trailing connectors..
      i = nodes.length - 1;
      while (i > 0 && nodes.length > 1 && nodes[i] === connector) {
        nodes.splice(i, 1);
        if (index === i) index = 0; // update leading connector instead
        i = nodes.length - 1;
      }
    }

    nodes.splice(index, 1, id);
    nodes = nodes.filter(noRepeatNodes);

    // If the way was closed before, append a connector node to keep it closed..
    if (
      isClosed &&
      (nodes.length === 1 || nodes[0] !== nodes[nodes.length - 1])
    ) {
      nodes.push(nodes[0]);
    }

    return this.update({ nodes: nodes });
  },

  // Replaces each occurrence of node id needle with replacement.
  // Consecutive duplicates are eliminated including existing ones.
  // Circularity is preserved.
  replaceNode: function(needle, replacement) {
    var nodes = this.nodes.slice(),
      isClosed = this.isClosed();

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] === needle) {
        nodes[i] = replacement;
      }
    }

    nodes = nodes.filter(noRepeatNodes);

    // If the way was closed before, append a connector node to keep it closed..
    if (
      isClosed &&
      (nodes.length === 1 || nodes[0] !== nodes[nodes.length - 1])
    ) {
      nodes.push(nodes[0]);
    }

    return this.update({ nodes: nodes });
  },

  // Removes each occurrence of node id needle with replacement.
  // Consecutive duplicates are eliminated including existing ones.
  // Circularity is preserved.
  removeNode: function(id) {
    var nodes = this.nodes.slice(),
      isClosed = this.isClosed();

    nodes = nodes
      .filter(function(node) {
        return node !== id;
      })
      .filter(noRepeatNodes);

    // If the way was closed before, append a connector node to keep it closed..
    if (
      isClosed &&
      (nodes.length === 1 || nodes[0] !== nodes[nodes.length - 1])
    ) {
      nodes.push(nodes[0]);
    }

    return this.update({ nodes: nodes });
  },

  asJXON: function(changeset_id) {
    var r = {
      way: {
        '@id': this.osmId(),
        '@version': this.version || 0,
        nd: _.map(this.nodes, function(id) {
          return { keyAttributes: { ref: osmEntity.id.toOSM(id) } };
        }),
        tag: _.map(this.tags, function(v, k) {
          return { keyAttributes: { k: k, v: v } };
        })
      }
    };
    if (changeset_id) {
      r.way['@changeset'] = changeset_id;
    }
    return r;
  },

  asGeoJSON: function(resolver) {
    return resolver.transient(this, 'GeoJSON', function() {
      var coordinates = _.map(resolver.childNodes(this), 'loc');
      if (this.isArea() && this.isClosed()) {
        return {
          type: 'Polygon',
          coordinates: [coordinates]
        };
      } else {
        return {
          type: 'LineString',
          coordinates: coordinates
        };
      }
    });
  },

  area: function(resolver) {
    return resolver.transient(this, 'area', function() {
      var nodes = resolver.childNodes(this);

      var json = {
        type: 'Polygon',
        coordinates: [_.map(nodes, 'loc')]
      };

      if (!this.isClosed() && nodes.length) {
        json.coordinates[0].push(nodes[0].loc);
      }

      var area = geoArea(json);

      // Heuristic for detecting counterclockwise winding order. Assumes
      // that OpenStreetMap polygons are not hemisphere-spanning.
      if (area > 2 * Math.PI) {
        json.coordinates[0] = json.coordinates[0].reverse();
        area = geoArea(json);
      }

      return isNaN(area) ? 0 : area;
    });
  }
});

// Filter function to eliminate consecutive duplicates.
function noRepeatNodes(node, i, arr) {
  return i === 0 || node !== arr[i - 1];
}

/*osmRelation*/

export function osmRelation() {
  if (!(this instanceof osmRelation)) {
    return new osmRelation().initialize(arguments);
  } else if (arguments.length) {
    this.initialize(arguments);
  }
}

osmEntity.relation = osmRelation;

osmRelation.prototype = Object.create(osmEntity.prototype);

osmRelation.creationOrder = function(a, b) {
  var aId = parseInt(osmEntity.id.toOSM(a.id), 10);
  var bId = parseInt(osmEntity.id.toOSM(b.id), 10);

  if (aId < 0 || bId < 0) return aId - bId;
  return bId - aId;
};

_.extend(osmRelation.prototype, {
  type: 'relation',
  members: [],

  copy: function(resolver, copies) {
    if (copies[this.id]) return copies[this.id];

    var copy = osmEntity.prototype.copy.call(this, resolver, copies);

    var members = this.members.map(function(member) {
      return _.extend({}, member, {
        id: resolver.entity(member.id).copy(resolver, copies).id
      });
    });

    copy = copy.update({ members: members });
    copies[this.id] = copy;

    return copy;
  },

  extent: function(resolver, memo) {
    return resolver.transient(this, 'extent', function() {
      if (memo && memo[this.id]) return geoExtent();
      memo = memo || {};
      memo[this.id] = true;

      var extent = geoExtent();
      for (var i = 0; i < this.members.length; i++) {
        var member = resolver.hasEntity(this.members[i].id);
        if (member) {
          extent._extend(member.extent(resolver, memo));
        }
      }
      return extent;
    });
  },

  geometry: function(graph) {
    return graph.transient(this, 'geometry', function() {
      return this.isMultipolygon() ? 'area' : 'relation';
    });
  },

  isDegenerate: function() {
    return this.members.length === 0;
  },

  // Return an array of members, each extended with an 'index' property whose value
  // is the member index.
  indexedMembers: function() {
    var result = new Array(this.members.length);
    for (var i = 0; i < this.members.length; i++) {
      result[i] = _.extend({}, this.members[i], { index: i });
    }
    return result;
  },

  // Return the first member with the given role. A copy of the member object
  // is returned, extended with an 'index' property whose value is the member index.
  memberByRole: function(role) {
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].role === role) {
        return _.extend({}, this.members[i], { index: i });
      }
    }
  },

  // Return the first member with the given id. A copy of the member object
  // is returned, extended with an 'index' property whose value is the member index.
  memberById: function(id) {
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id) {
        return _.extend({}, this.members[i], { index: i });
      }
    }
  },

  // Return the first member with the given id and role. A copy of the member object
  // is returned, extended with an 'index' property whose value is the member index.
  memberByIdAndRole: function(id, role) {
    for (var i = 0; i < this.members.length; i++) {
      if (this.members[i].id === id && this.members[i].role === role) {
        return _.extend({}, this.members[i], { index: i });
      }
    }
  },

  addMember: function(member, index) {
    var members = this.members.slice();
    members.splice(index === undefined ? members.length : index, 0, member);
    return this.update({ members: members });
  },

  updateMember: function(member, index) {
    var members = this.members.slice();
    members.splice(index, 1, _.extend({}, members[index], member));
    return this.update({ members: members });
  },

  removeMember: function(index) {
    var members = this.members.slice();
    members.splice(index, 1);
    return this.update({ members: members });
  },

  removeMembersWithID: function(id) {
    var members = _.reject(this.members, function(m) {
      return m.id === id;
    });
    return this.update({ members: members });
  },

  // Wherever a member appears with id `needle.id`, replace it with a member
  // with id `replacement.id`, type `replacement.type`, and the original role,
  // unless a member already exists with that id and role. Return an updated
  // relation.
  replaceMember: function(needle, replacement) {
    if (!this.memberById(needle.id)) return this;

    var members = [];

    for (var i = 0; i < this.members.length; i++) {
      var member = this.members[i];
      if (member.id !== needle.id) {
        members.push(member);
      } else if (!this.memberByIdAndRole(replacement.id, member.role)) {
        members.push({
          id: replacement.id,
          type: replacement.type,
          role: member.role
        });
      }
    }

    return this.update({ members: members });
  },

  asJXON: function(changeset_id) {
    var r = {
      relation: {
        '@id': this.osmId(),
        '@version': this.version || 0,
        member: _.map(this.members, function(member) {
          return {
            keyAttributes: {
              type: member.type,
              role: member.role,
              ref: osmEntity.id.toOSM(member.id)
            }
          };
        }),
        tag: _.map(this.tags, function(v, k) {
          return { keyAttributes: { k: k, v: v } };
        })
      }
    };
    if (changeset_id) r.relation['@changeset'] = changeset_id;
    return r;
  },

  asGeoJSON: function(resolver) {
    return resolver.transient(this, 'GeoJSON', function() {
      if (this.isMultipolygon()) {
        return {
          type: 'MultiPolygon',
          coordinates: this.multipolygon(resolver)
        };
      } else {
        return {
          type: 'FeatureCollection',
          properties: this.tags,
          features: this.members.map(function(member) {
            return _.extend(
              { role: member.role },
              resolver.entity(member.id).asGeoJSON(resolver)
            );
          })
        };
      }
    });
  },

  area: function(resolver) {
    return resolver.transient(this, 'area', function() {
      return geoArea(this.asGeoJSON(resolver));
    });
  },

  isMultipolygon: function() {
    return this.tags.type === 'multipolygon';
  },

  isComplete: function(resolver) {
    for (var i = 0; i < this.members.length; i++) {
      if (!resolver.hasEntity(this.members[i].id)) {
        return false;
      }
    }
    return true;
  },

  isRestriction: function() {
    return !!(this.tags.type && this.tags.type.match(/^restriction:?/));
  },

  // Returns an array [A0, ... An], each Ai being an array of node arrays [Nds0, ... Ndsm],
  // where Nds0 is an outer ring and subsequent Ndsi's (if any i > 0) being inner rings.
  //
  // This corresponds to the structure needed for rendering a multipolygon path using a
  // `evenodd` fill rule, as well as the structure of a GeoJSON MultiPolygon geometry.
  //
  // In the case of invalid geometries, this function will still return a result which
  // includes the nodes of all way members, but some Nds may be unclosed and some inner
  // rings not matched with the intended outer ring.
  //
  multipolygon: function(resolver) {
    var outers = this.members.filter(function(m) {
        return 'outer' === (m.role || 'outer');
      }),
      inners = this.members.filter(function(m) {
        return 'inner' === m.role;
      });

    outers = osmJoinWays(outers, resolver);
    inners = osmJoinWays(inners, resolver);

    outers = outers.map(function(outer) {
      return _.map(outer.nodes, 'loc');
    });
    inners = inners.map(function(inner) {
      return _.map(inner.nodes, 'loc');
    });

    var result = outers.map(function(o) {
      // Heuristic for detecting counterclockwise winding order. Assumes
      // that OpenStreetMap polygons are not hemisphere-spanning.
      return [
        geoArea({ type: 'Polygon', coordinates: [o] }) > 2 * Math.PI
          ? o.reverse()
          : o
      ];
    });

    function findOuter(inner) {
      var o, outer;

      for (o = 0; o < outers.length; o++) {
        outer = outers[o];
        if (geoPolygonContainsPolygon(outer, inner)) return o;
      }

      for (o = 0; o < outers.length; o++) {
        outer = outers[o];
        if (geoPolygonIntersectsPolygon(outer, inner, false)) return o;
      }
    }

    for (var i = 0; i < inners.length; i++) {
      var inner = inners[i];

      if (geoArea({ type: 'Polygon', coordinates: [inner] }) < 2 * Math.PI) {
        inner = inner.reverse();
      }

      var o = findOuter(inners[i]);
      if (o !== undefined) result[o].push(inners[i]);
      else result.push([inners[i]]); // Invalid geometry
    }

    return result;
  }
});
