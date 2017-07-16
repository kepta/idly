import * as _ from 'lodash';

export function osmIsInterestingTag(key) {
  return (
    key !== 'attribution' &&
    key !== 'created_by' &&
    key !== 'source' &&
    key !== 'odbl' &&
    key.indexOf('tiger:') !== 0
  );
}

// using WGS84 polar radius (6356752.314245179 m)
// const = 2 * PI * r / 360
export function geoMetersToLat(m) {
  return m / 110946.257617;
}

export function geoMetersToLon(m, atLat) {
  return Math.abs(atLat) >= 90
    ? 0
    : m / 111319.490793 / Math.abs(Math.cos(atLat * (Math.PI / 180)));
}
export function geoPolygonContainsPolygon(outer, inner) {
  return _.every(inner, function(point) {
    return geoPointInPolygon(point, outer);
  });
}
export function geoLineIntersection(a, b) {
  function subtractPoints(point1, point2) {
    return [point1[0] - point2[0], point1[1] - point2[1]];
  }
  function crossProduct(point1, point2) {
    return point1[0] * point2[1] - point1[1] * point2[0];
  }

  var p = [a[0][0], a[0][1]],
    p2 = [a[1][0], a[1][1]],
    q = [b[0][0], b[0][1]],
    q2 = [b[1][0], b[1][1]],
    r = subtractPoints(p2, p),
    s = subtractPoints(q2, q),
    uNumerator = crossProduct(subtractPoints(q, p), r),
    denominator = crossProduct(r, s);

  if (uNumerator && denominator) {
    var u = uNumerator / denominator,
      t = crossProduct(subtractPoints(q, p), s) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return geoInterp(p, p2, t);
    }
  }

  return null;
}
export function geoInterp(p1, p2, t) {
  return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

export function geoPolygonIntersectsPolygon(outer, inner, checkSegments) {
  function testSegments(outer, inner) {
    for (var i = 0; i < outer.length - 1; i++) {
      for (var j = 0; j < inner.length - 1; j++) {
        var a = [outer[i], outer[i + 1]],
          b = [inner[j], inner[j + 1]];
        if (geoLineIntersection(a, b)) return true;
      }
    }
    return false;
  }

  function testPoints(outer, inner) {
    return _.some(inner, function(point) {
      return geoPointInPolygon(point, outer);
    });
  }

  return (
    testPoints(outer, inner) || (!!checkSegments && testSegments(outer, inner))
  );
}
export function geoPointInPolygon(point, polygon) {
  var x = point[0],
    y = point[1],
    inside = false;

  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i][0],
      yi = polygon[i][1];
    var xj = polygon[j][0],
      yj = polygon[j][1];

    var intersect =
      yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export const dataDeprecated = [];
export var osmOneWayTags = {
  aerialway: {
    chair_lift: true,
    mixed_lift: true,
    't-bar': true,
    'j-bar': true,
    platter: true,
    rope_tow: true,
    magic_carpet: true,
    yes: true
  },
  highway: {
    motorway: true,
    motorway_link: true
  },
  junction: {
    roundabout: true
  },
  man_made: {
    'piste:halfpipe': true
  },
  'piste:type': {
    downhill: true,
    sled: true,
    yes: true
  },
  waterway: {
    canal: true,
    ditch: true,
    drain: true,
    river: true,
    stream: true
  }
};

export function geoCross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

export function geoExtent(min, max): void {
  if (!(this instanceof geoExtent)) return new geoExtent(min, max);
  if (min instanceof geoExtent) {
    return min;
  } else if (
    min &&
    min.length === 2 &&
    min[0].length === 2 &&
    min[1].length === 2
  ) {
    this[0] = min[0];
    this[1] = min[1];
  } else {
    this[0] = min || [Infinity, Infinity];
    this[1] = max || min || [-Infinity, -Infinity];
  }
}

geoExtent.prototype = new Array(2);

_.extend(geoExtent.prototype, {
  equals: function(obj) {
    return (
      this[0][0] === obj[0][0] &&
      this[0][1] === obj[0][1] &&
      this[1][0] === obj[1][0] &&
      this[1][1] === obj[1][1]
    );
  },

  extend: function(obj) {
    if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
    return geoExtent(
      [Math.min(obj[0][0], this[0][0]), Math.min(obj[0][1], this[0][1])],
      [Math.max(obj[1][0], this[1][0]), Math.max(obj[1][1], this[1][1])]
    );
  },

  _extend: function(extent) {
    this[0][0] = Math.min(extent[0][0], this[0][0]);
    this[0][1] = Math.min(extent[0][1], this[0][1]);
    this[1][0] = Math.max(extent[1][0], this[1][0]);
    this[1][1] = Math.max(extent[1][1], this[1][1]);
  },

  area: function() {
    return Math.abs((this[1][0] - this[0][0]) * (this[1][1] - this[0][1]));
  },

  center: function() {
    return [(this[0][0] + this[1][0]) / 2, (this[0][1] + this[1][1]) / 2];
  },

  rectangle: function() {
    return [this[0][0], this[0][1], this[1][0], this[1][1]];
  },

  bbox: function() {
    return {
      minX: this[0][0],
      minY: this[0][1],
      maxX: this[1][0],
      maxY: this[1][1]
    };
  },

  polygon: function() {
    return [
      [this[0][0], this[0][1]],
      [this[0][0], this[1][1]],
      [this[1][0], this[1][1]],
      [this[1][0], this[0][1]],
      [this[0][0], this[0][1]]
    ];
  },

  contains: function(obj) {
    if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
    return (
      obj[0][0] >= this[0][0] &&
      obj[0][1] >= this[0][1] &&
      obj[1][0] <= this[1][0] &&
      obj[1][1] <= this[1][1]
    );
  },

  intersects: function(obj) {
    if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
    return (
      obj[0][0] <= this[1][0] &&
      obj[0][1] <= this[1][1] &&
      obj[1][0] >= this[0][0] &&
      obj[1][1] >= this[0][1]
    );
  },

  intersection: function(obj) {
    if (!this.intersects(obj)) return new geoExtent();
    return new geoExtent(
      [Math.max(obj[0][0], this[0][0]), Math.max(obj[0][1], this[0][1])],
      [Math.min(obj[1][0], this[1][0]), Math.min(obj[1][1], this[1][1])]
    );
  },

  percentContainedIn: function(obj) {
    if (!(obj instanceof geoExtent)) obj = new geoExtent(obj);
    var a1 = this.intersection(obj).area(),
      a2 = this.area();

    if (a1 === Infinity || a2 === Infinity || a1 === 0 || a2 === 0) {
      return 0;
    } else {
      return a1 / a2;
    }
  },

  padByMeters: function(meters) {
    var dLat = geoMetersToLat(meters),
      dLon = geoMetersToLon(meters, this.center()[1]);
    return geoExtent(
      [this[0][0] - dLon, this[0][1] - dLat],
      [this[1][0] + dLon, this[1][1] + dLat]
    );
  },

  toParam: function() {
    return this.rectangle().join(',');
  }
});

export function actionReverse(wayId, options) {
  var replacements = [
      [/:right$/, ':left'],
      [/:left$/, ':right'],
      [/:forward$/, ':backward'],
      [/:backward$/, ':forward']
    ],
    numeric = /^([+\-]?)(?=[\d.])/,
    roleReversals = {
      forward: 'backward',
      backward: 'forward',
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east'
    };

  function reverseKey(key) {
    for (var i = 0; i < replacements.length; ++i) {
      var replacement = replacements[i];
      if (replacement[0].test(key)) {
        return key.replace(replacement[0], replacement[1]);
      }
    }
    return key;
  }

  function reverseValue(key, value) {
    if (key === 'incline' && numeric.test(value)) {
      return value.replace(numeric, function(_, sign) {
        return sign === '-' ? '' : '-';
      });
    } else if (key === 'incline' || key === 'direction') {
      return { up: 'down', down: 'up' }[value] || value;
    } else if (options && options.reverseOneway && key === 'oneway') {
      return { yes: '-1', '1': '-1', '-1': 'yes' }[value] || value;
    } else {
      return { left: 'right', right: 'left' }[value] || value;
    }
  }

  function reverseDirectionTags(node) {
    // Update the direction based tags as appropriate then return an updated node
    return node.update({
      tags: _.transform(
        node.tags,
        function(acc, tagValue, tagKey) {
          // See if this is a direction tag and reverse (or use existing value if not recognised)
          if (tagKey === 'direction') {
            acc[tagKey] =
              {
                forward: 'backward',
                backward: 'forward',
                left: 'right',
                right: 'left'
              }[tagValue] || tagValue;
          } else {
            // Use the reverseKey method to cater for situations such as traffic_sign:forward=stop
            // This will pass through other tags unchanged
            acc[reverseKey(tagKey)] = tagValue;
          }
          return acc;
        },
        {}
      )
    });
  }

  function reverseTagsOnNodes(graph, nodeIds) {
    // Reverse the direction of appropriate tags attached to the nodes (#3076)
    return (
      _(nodeIds)
        // Get each node from the graph
        .map(function(nodeId) {
          return graph.entity(nodeId);
        })
        // Check tags on the node, if there aren't any, we can skip
        .filter(function(existingNode) {
          return existingNode.tags !== undefined;
        })
        // Get a new version of each node with the appropriate tags reversed
        .map(function(existingNode) {
          return reverseDirectionTags(existingNode);
        })
        // Chain together consecutive updates to the graph for each updated node and return
        .reduce(function(accGraph, value) {
          return accGraph.replace(value);
        }, graph)
    );
  }

  return function(graph) {
    var way = graph.entity(wayId),
      nodes = way.nodes.slice().reverse(),
      tags = {},
      key,
      role;

    for (key in way.tags) {
      tags[reverseKey(key)] = reverseValue(key, way.tags[key]);
    }

    graph.parentRelations(way).forEach(function(relation) {
      relation.members.forEach(function(member, index) {
        if (member.id === way.id && (role = roleReversals[member.role])) {
          relation = relation.updateMember({ role: role }, index);
          graph = graph.replace(relation);
        }
      });
    });

    // Reverse any associated directions on nodes on the way and then replace
    // the way itself with the reversed node ids and updated way tags
    return reverseTagsOnNodes(graph, nodes).replace(
      way.update({ nodes: nodes, tags: tags })
    );
  };
}
