describe('iD.osmWay', function() {
  if (iD.debug) {
    it('freezes nodes', function() {
      expect(Object.isFrozen(iD.Way().nodes)).toBe(true);
    });
  }

  it('returns a way', function() {
    expect(iD.Way()).toBeInstanceOf(iD.Way);
    expect(iD.Way().type).toBe('way');
  });

  it('defaults nodes to an empty array', function() {
    expect(iD.Way().nodes).toEqual([]);
  });

  it('sets nodes as specified', function() {
    expect(iD.Way({ nodes: ['n-1'] }).nodes).toEqual(['n-1']);
  });

  it('defaults tags to an empty object', function() {
    expect(iD.Way().tags).toEqual({});
  });

  it('sets tags as specified', function() {
    expect(iD.Way({ tags: { foo: 'bar' } }).tags).toEqual({ foo: 'bar' });
  });

  describe('#copy', function() {
    it('returns a new Way', function() {
      var w = iD.Way({ id: 'w' }),
        result = w.copy(null, {});

      expect(result).toBeInstanceOf(iD.Way);
      expect(result).not.toBe(w);
    });

    it('adds the new Way to input object', function() {
      var w = iD.Way({ id: 'w' }),
        copies = {},
        result = w.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(copies.w).toBe(result);
    });

    it('returns an existing copy in input object', function() {
      var w = iD.Way({ id: 'w' }),
        copies = {},
        result1 = w.copy(null, copies),
        result2 = w.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(result1).toBe(result2);
    });

    it('deep copies nodes', function() {
      var a = iD.Node({ id: 'a' }),
        b = iD.Node({ id: 'b' }),
        w = iD.Way({ id: 'w', nodes: ['a', 'b'] }),
        graph = iD.Graph([a, b, w]),
        copies = {},
        result = w.copy(graph, copies);

      expect(Object.keys(copies)).toHaveLength(3);
      expect(copies.a).toBeInstanceOf(iD.Node);
      expect(copies.b).toBeInstanceOf(iD.Node);
      expect(copies.a).not.toBe(w.nodes[0]);
      expect(copies.b).not.toBe(w.nodes[1]);
      expect(result.nodes).toEqual([copies.a.id, copies.b.id]);
    });

    it('creates only one copy of shared nodes', function() {
      var a = iD.Node({ id: 'a' }),
        w = iD.Way({ id: 'w', nodes: ['a', 'a'] }),
        graph = iD.Graph([a, w]),
        copies = {},
        result = w.copy(graph, copies);

      expect(result.nodes[0]).toBe(result.nodes[1]);
    });
  });

  describe('#first', function() {
    it('returns the first node', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).first()).toBe('a');
    });
  });

  describe('#last', function() {
    it('returns the last node', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).last()).toBe('c');
    });
  });

  describe('#contains', function() {
    it('returns true if the way contains the given node', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).contains('b')).toBe(true);
    });

    it('returns false if the way does not contain the given node', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).contains('d')).toBe(false);
    });
  });

  describe('#affix', function() {
    it("returns 'prefix' if the way starts with the given node", function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).affix('a')).toBe('prefix');
    });

    it("returns 'suffix' if the way ends with the given node", function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).affix('c')).toBe('suffix');
    });

    it('returns falsy if the way does not start or end with the given node', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).affix('b')).not.toBeTruthy();
      expect(iD.Way({ nodes: [] }).affix('b')).not.toBeTruthy();
    });
  });

  describe('#extent', function() {
    it('returns the minimal extent containing all member nodes', function() {
      var node1 = iD.Node({ loc: [0, 0] }),
        node2 = iD.Node({ loc: [5, 10] }),
        way = iD.Way({ nodes: [node1.id, node2.id] }),
        graph = iD.Graph([node1, node2, way]);
      expect(way.extent(graph).equals([[0, 0], [5, 10]])).toBeTruthy();
    });
  });

  describe('#isClosed', function() {
    it('returns false when the way contains no nodes', function() {
      expect(iD.Way().isClosed()).toBe(false);
    });

    it('returns false when the way contains a single node', function() {
      expect(iD.Way({ nodes: 'a'.split('') }).isClosed()).toBe(false);
    });

    it('returns false when the way ends are not equal', function() {
      expect(iD.Way({ nodes: 'abc'.split('') }).isClosed()).toBe(false);
    });

    it('returns true when the way ends are equal', function() {
      expect(iD.Way({ nodes: 'aba'.split('') }).isClosed()).toBe(true);
    });

    it('returns true when the way contains two of the same node', function() {
      expect(iD.Way({ nodes: 'aa'.split('') }).isClosed()).toBe(true);
    });
  });

  describe('#isConvex', function() {
    it('returns true for convex ways', function() {
      //    d -- e
      //    |     \
      //    |      a
      //    |     /
      //    c -- b
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [0.0003, 0.0] }),
        iD.Node({ id: 'b', loc: [0.0002, -0.0002] }),
        iD.Node({ id: 'c', loc: [-0.0002, -0.0002] }),
        iD.Node({ id: 'd', loc: [-0.0002, 0.0002] }),
        iD.Node({ id: 'e', loc: [0.0002, 0.0002] }),
        iD.Way({ id: 'w', nodes: ['a', 'b', 'c', 'd', 'e', 'a'] })
      ]);
      expect(graph.entity('w').isConvex(graph)).toBe(true);
    });

    it('returns false for concave ways', function() {
      //    d -- e
      //    |   /
      //    |  a
      //    |   \
      //    c -- b
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [0.0, 0.0] }),
        iD.Node({ id: 'b', loc: [0.0002, -0.0002] }),
        iD.Node({ id: 'c', loc: [-0.0002, -0.0002] }),
        iD.Node({ id: 'd', loc: [-0.0002, 0.0002] }),
        iD.Node({ id: 'e', loc: [0.0002, 0.0002] }),
        iD.Way({ id: 'w', nodes: ['a', 'b', 'c', 'd', 'e', 'a'] })
      ]);
      expect(graph.entity('w').isConvex(graph)).toBe(false);
    });

    it('returns null for non-closed ways', function() {
      //    d -- e
      //    |
      //    |  a
      //    |   \
      //    c -- b
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [0.0, 0.0] }),
        iD.Node({ id: 'b', loc: [0.0002, -0.0002] }),
        iD.Node({ id: 'c', loc: [-0.0002, -0.0002] }),
        iD.Node({ id: 'd', loc: [-0.0002, 0.0002] }),
        iD.Node({ id: 'e', loc: [0.0002, 0.0002] }),
        iD.Way({ id: 'w', nodes: ['a', 'b', 'c', 'd', 'e'] })
      ]);
      expect(graph.entity('w').isConvex(graph)).toBeNull();
    });

    it('returns null for degenerate ways', function() {
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [0.0, 0.0] }),
        iD.Way({ id: 'w', nodes: ['a', 'a'] })
      ]);
      expect(graph.entity('w').isConvex(graph)).toBeNull();
    });
  });

  describe('#layer', function() {
    it('returns 0 when the way has no tags', function() {
      expect(iD.Way().layer()).toBe(0);
    });

    it('returns 0 when the way has a non numeric layer tag', function() {
      expect(iD.Way({ tags: { layer: 'NaN' } }).layer()).toBe(0);
      expect(iD.Way({ tags: { layer: 'Infinity' } }).layer()).toBe(0);
      expect(iD.Way({ tags: { layer: 'Foo' } }).layer()).toBe(0);
    });

    it('returns the layer when the way has an explicit layer tag', function() {
      expect(iD.Way({ tags: { layer: '2' } }).layer()).toBe(2);
      expect(iD.Way({ tags: { layer: '-5' } }).layer()).toBe(-5);
    });

    it('clamps the layer to within -10, 10', function() {
      expect(iD.Way({ tags: { layer: '12' } }).layer()).toBe(10);
      expect(iD.Way({ tags: { layer: '-15' } }).layer()).toBe(-10);
    });

    it('returns 1 for location=overground', function() {
      expect(iD.Way({ tags: { location: 'overground' } }).layer()).toBe(1);
    });

    it('returns -1 for location=underground', function() {
      expect(iD.Way({ tags: { location: 'underground' } }).layer()).toBe(-1);
    });

    it('returns -10 for location=underwater', function() {
      expect(iD.Way({ tags: { location: 'underwater' } }).layer()).toBe(-10);
    });

    it('returns 10 for power lines', function() {
      expect(iD.Way({ tags: { power: 'line' } }).layer()).toBe(10);
      expect(iD.Way({ tags: { power: 'minor_line' } }).layer()).toBe(10);
    });

    it('returns 10 for aerialways', function() {
      expect(iD.Way({ tags: { aerialway: 'cable_car' } }).layer()).toBe(10);
    });

    it('returns 1 for bridges', function() {
      expect(iD.Way({ tags: { bridge: 'yes' } }).layer()).toBe(1);
    });

    it('returns -1 for cuttings', function() {
      expect(iD.Way({ tags: { cutting: 'yes' } }).layer()).toBe(-1);
    });

    it('returns -1 for tunnels', function() {
      expect(iD.Way({ tags: { tunnel: 'yes' } }).layer()).toBe(-1);
    });

    it('returns -1 for waterways', function() {
      expect(iD.Way({ tags: { waterway: 'stream' } }).layer()).toBe(-1);
    });

    it('returns -10 for pipelines', function() {
      expect(iD.Way({ tags: { man_made: 'pipeline' } }).layer()).toBe(-10);
    });

    it('returns -10 for boundaries', function() {
      expect(iD.Way({ tags: { boundary: 'administrative' } }).layer()).toBe(
        -10
      );
    });
  });

  describe('#isOneWay', function() {
    it('returns false when the way has no tags', function() {
      expect(iD.Way().isOneWay()).toBe(false);
    });

    it('returns false when the way has tag oneway=no', function() {
      expect(iD.Way({ tags: { oneway: 'no' } }).isOneWay(), 'oneway no').toBe(
        false
      );
      expect(iD.Way({ tags: { oneway: '0' } }).isOneWay(), 'oneway 0').toBe(
        false
      );
    });

    it('returns true when the way has tag oneway=yes', function() {
      expect(iD.Way({ tags: { oneway: 'yes' } }).isOneWay(), 'oneway yes').toBe(
        true
      );
      expect(iD.Way({ tags: { oneway: '1' } }).isOneWay(), 'oneway 1').toBe(
        true
      );
      expect(iD.Way({ tags: { oneway: '-1' } }).isOneWay(), 'oneway -1').toBe(
        true
      );
    });

    it('returns true when the way has implied oneway tag (waterway=river, waterway=stream, etc)', function() {
      expect(iD.Way({ tags: { waterway: 'river' } }).isOneWay(), 'river').toBe(
        true
      );
      expect(
        iD.Way({ tags: { waterway: 'stream' } }).isOneWay(),
        'stream'
      ).toBe(true);
      expect(
        iD.Way({ tags: { highway: 'motorway' } }).isOneWay(),
        'motorway'
      ).toBe(true);
      expect(
        iD.Way({ tags: { highway: 'motorway_link' } }).isOneWay(),
        'motorway_link'
      ).toBe(true);
      expect(
        iD.Way({ tags: { junction: 'roundabout' } }).isOneWay(),
        'roundabout'
      ).toBe(true);
    });

    it('returns false when the way does not have implied oneway tag', function() {
      expect(iD.Way({ tags: { highway: 'trunk' } }).isOneWay(), 'trunk').toBe(
        false
      );
      expect(
        iD.Way({ tags: { highway: 'trunk_link' } }).isOneWay(),
        'trunk_link'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'primary' } }).isOneWay(),
        'primary'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'primary_link' } }).isOneWay(),
        'primary_link'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'secondary' } }).isOneWay(),
        'secondary'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'secondary_link' } }).isOneWay(),
        'secondary_link'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'tertiary' } }).isOneWay(),
        'tertiary'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'tertiary_link' } }).isOneWay(),
        'tertiary_link'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'unclassified' } }).isOneWay(),
        'unclassified'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'residential' } }).isOneWay(),
        'residential'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'living_street' } }).isOneWay(),
        'living_street'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'service' } }).isOneWay(),
        'service'
      ).toBe(false);
      expect(iD.Way({ tags: { highway: 'track' } }).isOneWay(), 'track').toBe(
        false
      );
      expect(iD.Way({ tags: { highway: 'path' } }).isOneWay(), 'path').toBe(
        false
      );
    });

    it('returns false when oneway=no overrides implied oneway tag', function() {
      expect(
        iD.Way({ tags: { junction: 'roundabout', oneway: 'no' } }).isOneWay(),
        'roundabout'
      ).toBe(false);
      expect(
        iD.Way({ tags: { highway: 'motorway', oneway: 'no' } }).isOneWay(),
        'motorway'
      ).toBe(false);
    });
  });

  describe('#isArea', function() {
    before(function() {
      iD.Context();
    });

    it('returns false when the way has no tags', function() {
      expect(iD.Way().isArea()).toBe(false);
    });

    it('returns true if the way has tag area=yes', function() {
      expect(iD.Way({ tags: { area: 'yes' } }).isArea()).toBe(true);
    });

    it('returns false if the way is closed and has no tags', function() {
      expect(iD.Way({ nodes: ['n1', 'n1'] }).isArea()).toBe(false);
    });

    it('returns true if the way is closed and has a key in iD.areaKeys', function() {
      expect(
        iD.Way({ nodes: ['n1', 'n1'], tags: { building: 'yes' } }).isArea()
      ).toBe(true);
    });

    it('returns false if the way is closed and has no keys in iD.areaKeys', function() {
      expect(iD.Way({ nodes: ['n1', 'n1'], tags: { a: 'b' } }).isArea()).toBe(
        false
      );
    });

    it('returns false if the way is closed and has tag area=no', function() {
      expect(
        iD
          .Way({ nodes: ['n1', 'n1'], tags: { area: 'no', building: 'yes' } })
          .isArea()
      ).toBe(false);
    });

    it('returns false for coastline', function() {
      expect(
        iD.Way({ nodes: ['n1', 'n1'], tags: { natural: 'coastline' } }).isArea()
      ).toBe(false);
    });
  });

  describe('#isDegenerate', function() {
    it('returns true for a linear way with zero or one nodes', function() {
      expect(iD.Way({ nodes: [] }).isDegenerate()).toBe(true);
      expect(iD.Way({ nodes: ['a'] }).isDegenerate()).toBe(true);
    });

    it('returns true for a circular way with only one unique node', function() {
      expect(iD.Way({ nodes: ['a', 'a'] }).isDegenerate()).toBe(true);
    });

    it('returns false for a linear way with two or more nodes', function() {
      expect(iD.Way({ nodes: ['a', 'b'] }).isDegenerate()).toBe(false);
    });

    it('returns true for an area with zero, one, or two unique nodes', function() {
      expect(iD.Way({ tags: { area: 'yes' }, nodes: [] }).isDegenerate()).toBe(
        true
      );
      expect(
        iD.Way({ tags: { area: 'yes' }, nodes: ['a', 'a'] }).isDegenerate()
      ).toBe(true);
      expect(
        iD.Way({ tags: { area: 'yes' }, nodes: ['a', 'b', 'a'] }).isDegenerate()
      ).toBe(true);
    });

    it('returns false for an area with three or more unique nodes', function() {
      expect(
        iD
          .Way({ tags: { area: 'yes' }, nodes: ['a', 'b', 'c', 'a'] })
          .isDegenerate()
      ).toBe(false);
    });
  });

  describe('#areAdjacent', function() {
    it('returns false for nodes not in the way', function() {
      expect(iD.Way().areAdjacent('a', 'b')).toBe(false);
    });

    it('returns false for non-adjacent nodes in the way', function() {
      expect(iD.Way({ nodes: ['a', 'b', 'c'] }).areAdjacent('a', 'c')).toBe(
        false
      );
    });

    it('returns true for adjacent nodes in the way (forward)', function() {
      var way = iD.Way({ nodes: ['a', 'b', 'c', 'd'] });
      expect(way.areAdjacent('a', 'b')).toBe(true);
      expect(way.areAdjacent('b', 'c')).toBe(true);
      expect(way.areAdjacent('c', 'd')).toBe(true);
    });

    it('returns true for adjacent nodes in the way (reverse)', function() {
      var way = iD.Way({ nodes: ['a', 'b', 'c', 'd'] });
      expect(way.areAdjacent('b', 'a')).toBe(true);
      expect(way.areAdjacent('c', 'b')).toBe(true);
      expect(way.areAdjacent('d', 'c')).toBe(true);
    });
  });

  describe('#geometry', function() {
    it("returns 'line' when the way is not an area", function() {
      expect(iD.Way().geometry(iD.Graph())).toBe('line');
    });

    it("returns 'area' when the way is an area", function() {
      expect(iD.Way({ tags: { area: 'yes' } }).geometry(iD.Graph())).toBe(
        'area'
      );
    });
  });

  describe('#close', function() {
    it('returns self for empty way', function() {
      var w = iD.Way();
      expect(w.close()).toEqual(w);
    });

    it('returns self for already closed way', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.close()).toEqual(w1);
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.close()).toEqual(w2);
    });

    it('closes a way', function() {
      var w1 = iD.Way({ nodes: 'ab'.split('') });
      expect(w1.close().nodes.join('')).toEqual('aba');
      var w2 = iD.Way({ nodes: 'a'.split('') });
      expect(w2.close().nodes.join('')).toEqual('aa');
    });

    it('eliminates duplicate consecutive nodes when closing a linear way', function() {
      var w1 = iD.Way({ nodes: 'abb'.split('') });
      expect(w1.close().nodes.join('')).toEqual('aba');
      var w2 = iD.Way({ nodes: 'abbc'.split('') });
      expect(w2.close().nodes.join('')).toEqual('abca');
      var w3 = iD.Way({ nodes: 'aabc'.split('') });
      expect(w3.close().nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'abbbcbb'.split('') });
      expect(w4.close().nodes.join('')).toEqual('abcba');
    });
  });

  describe('#unclose', function() {
    it('returns self for empty way', function() {
      var w = iD.Way();
      expect(w.unclose()).toEqual(w);
    });

    it('returns self for already unclosed way', function() {
      var w1 = iD.Way({ nodes: 'a'.split('') });
      expect(w1.unclose()).toEqual(w1);
      var w2 = iD.Way({ nodes: 'ab'.split('') });
      expect(w2.unclose()).toEqual(w2);
    });

    it('uncloses a circular way', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.unclose().nodes.join('')).toEqual('ab');
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.unclose().nodes.join('')).toEqual('a');
    });

    it('eliminates duplicate consecutive nodes when unclosing a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.unclose().nodes.join('')).toEqual('abc');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.unclose().nodes.join('')).toEqual('abc');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.unclose().nodes.join('')).toEqual('abc');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.unclose().nodes.join('')).toEqual('abc');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.unclose().nodes.join('')).toEqual('abcb');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.unclose().nodes.join('')).toEqual('a');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.unclose().nodes.join('')).toEqual('a');
    });
  });

  describe('#addNode', function() {
    it('adds a node to an empty way', function() {
      var w = iD.Way();
      expect(w.addNode('a').nodes).toEqual(['a']);
    });

    it('adds a node to the end of a linear way when index is undefined', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.addNode('c').nodes.join('')).toEqual('abc');
    });

    it('adds a node before the end connector of a circular way when index is undefined', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.addNode('c').nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.addNode('c').nodes.join('')).toEqual('aca');
    });

    it('adds an internal node to a linear way at a positive index', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.addNode('c', 1).nodes.join('')).toEqual('acb');
    });

    it('adds an internal node to a circular way at a positive index', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.addNode('c', 1).nodes.join('')).toEqual('acba');
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.addNode('c', 1).nodes.join('')).toEqual('aca');
    });

    it('adds a leading node to a linear way at index 0', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.addNode('c', 0).nodes.join('')).toEqual('cab');
    });

    it('adds a leading node to a circular way at index 0, preserving circularity', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.addNode('c', 0).nodes.join('')).toEqual('cabc');
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.addNode('c', 0).nodes.join('')).toEqual('cac');
    });

    it('throws RangeError if index outside of array range for linear way', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.addNode.bind(w, 'c', 3)).toThrowError(RangeError);
      expect(w.addNode.bind(w, 'c', -1)).toThrowError(RangeError);
    });

    it('throws RangeError if index outside of array range for circular way', function() {
      var w = iD.Way({ nodes: 'aba'.split('') });
      expect(w.addNode.bind(w, 'c', 3)).toThrowError(RangeError);
      expect(w.addNode.bind(w, 'c', -1)).toThrowError(RangeError);
    });

    it('eliminates duplicate consecutive nodes when adding to the end of a linear way', function() {
      var w1 = iD.Way({ nodes: 'abb'.split('') });
      expect(w1.addNode('b').nodes.join('')).toEqual('ab');
      var w2 = iD.Way({ nodes: 'abbc'.split('') });
      expect(w2.addNode('c').nodes.join('')).toEqual('abc');
      var w3 = iD.Way({ nodes: 'aabc'.split('') });
      expect(w3.addNode('c').nodes.join('')).toEqual('abc');
      var w4 = iD.Way({ nodes: 'abbbcbb'.split('') });
      expect(w4.addNode('b').nodes.join('')).toEqual('abcb');
    });

    it('eliminates duplicate consecutive nodes when adding same node before the end connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.addNode('c').nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.addNode('c').nodes.join('')).toEqual('abca');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.addNode('c').nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.addNode('a').nodes.join('')).toEqual('abca');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.addNode('b').nodes.join('')).toEqual('abcba');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.addNode('a').nodes.join('')).toEqual('aa');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.addNode('a').nodes.join('')).toEqual('aa');
    });

    it('eliminates duplicate consecutive nodes when adding different node before the end connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.addNode('d').nodes.join('')).toEqual('abcda');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.addNode('d').nodes.join('')).toEqual('abcda');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.addNode('d').nodes.join('')).toEqual('abcda');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.addNode('d').nodes.join('')).toEqual('abcda');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.addNode('d').nodes.join('')).toEqual('abcbda');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.addNode('d').nodes.join('')).toEqual('ada');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.addNode('d').nodes.join('')).toEqual('ada');
    });

    it('eliminates duplicate consecutive nodes when adding to the beginning of a linear way', function() {
      var w1 = iD.Way({ nodes: 'abb'.split('') });
      expect(w1.addNode('a', 0).nodes.join('')).toEqual('ab');
      var w2 = iD.Way({ nodes: 'abbc'.split('') });
      expect(w2.addNode('a', 0).nodes.join('')).toEqual('abc');
      var w3 = iD.Way({ nodes: 'aabc'.split('') });
      expect(w3.addNode('a', 0).nodes.join('')).toEqual('abc');
      var w4 = iD.Way({ nodes: 'abbbcbb'.split('') });
      expect(w4.addNode('a', 0).nodes.join('')).toEqual('abcb');
    });

    it('eliminates duplicate consecutive nodes when adding same node as beginning connector a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.addNode('a', 0).nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.addNode('a', 0).nodes.join('')).toEqual('abca');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.addNode('a', 0).nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.addNode('a', 0).nodes.join('')).toEqual('abca');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.addNode('a', 0).nodes.join('')).toEqual('abcba');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.addNode('a', 0).nodes.join('')).toEqual('aa');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.addNode('a', 0).nodes.join('')).toEqual('aa');
    });

    it('eliminates duplicate consecutive nodes when adding different node as beginning connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.addNode('d', 0).nodes.join('')).toEqual('dabcd');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.addNode('d', 0).nodes.join('')).toEqual('dabcd');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.addNode('d', 0).nodes.join('')).toEqual('dabcd');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.addNode('d', 0).nodes.join('')).toEqual('dabcd');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.addNode('d', 0).nodes.join('')).toEqual('dabcbd');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.addNode('d', 0).nodes.join('')).toEqual('dad');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.addNode('d', 0).nodes.join('')).toEqual('dad');
    });
  });

  describe('#updateNode', function() {
    it('throws RangeError if empty way', function() {
      var w = iD.Way();
      expect(w.updateNode.bind(w, 'd', 0)).toThrowError(RangeError);
    });

    it('updates an internal node on a linear way at a positive index', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.updateNode('d', 1).nodes.join('')).toEqual('ad');
    });

    it('updates an internal node on a circular way at a positive index', function() {
      var w = iD.Way({ nodes: 'aba'.split('') });
      expect(w.updateNode('d', 1).nodes.join('')).toEqual('ada');
    });

    it('updates a leading node on a linear way at index 0', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.updateNode('d', 0).nodes.join('')).toEqual('db');
    });

    it('updates a leading node on a circular way at index 0, preserving circularity', function() {
      var w1 = iD.Way({ nodes: 'aba'.split('') });
      expect(w1.updateNode('d', 0).nodes.join('')).toEqual('dbd');
      var w2 = iD.Way({ nodes: 'aa'.split('') });
      expect(w2.updateNode('d', 0).nodes.join('')).toEqual('dd');
    });

    it('throws RangeError if index outside of array range for linear way', function() {
      var w = iD.Way({ nodes: 'ab'.split('') });
      expect(w.updateNode.bind(w, 'd', 2)).toThrowError(RangeError);
      expect(w.updateNode.bind(w, 'd', -1)).toThrowError(RangeError);
    });

    it('throws RangeError if index outside of array range for circular way', function() {
      var w = iD.Way({ nodes: 'aba'.split('') });
      expect(w.updateNode.bind(w, 'd', 3)).toThrowError(RangeError);
      expect(w.updateNode.bind(w, 'd', -1)).toThrowError(RangeError);
    });

    it('eliminates duplicate consecutive nodes when updating the end of a linear way', function() {
      var w1 = iD.Way({ nodes: 'abcc'.split('') });
      expect(w1.updateNode('c', 3).nodes.join('')).toEqual('abc');
      var w2 = iD.Way({ nodes: 'abbc'.split('') });
      expect(w2.updateNode('c', 3).nodes.join('')).toEqual('abc');
      var w3 = iD.Way({ nodes: 'aabc'.split('') });
      expect(w3.updateNode('c', 3).nodes.join('')).toEqual('abc');
      var w4 = iD.Way({ nodes: 'abbbcbb'.split('') });
      expect(w4.updateNode('b', 6).nodes.join('')).toEqual('abcb');
    });

    it('eliminates duplicate consecutive nodes when updating same node before the end connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.updateNode('c', 3).nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.updateNode('c', 3).nodes.join('')).toEqual('abca');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.updateNode('c', 3).nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.updateNode('a', 3).nodes.join('')).toEqual('abca');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.updateNode('b', 6).nodes.join('')).toEqual('abcba');
    });

    it('eliminates duplicate consecutive nodes when updating different node before the end connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.updateNode('d', 3).nodes.join('')).toEqual('abcda');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.updateNode('d', 3).nodes.join('')).toEqual('abda');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.updateNode('d', 3).nodes.join('')).toEqual('abda');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.updateNode('d', 3).nodes.join('')).toEqual('dbcd');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.updateNode('d', 6).nodes.join('')).toEqual('abcbda');
    });

    it('eliminates duplicate consecutive nodes when updating the beginning of a linear way', function() {
      var w1 = iD.Way({ nodes: 'abb'.split('') });
      expect(w1.updateNode('b', 0).nodes.join('')).toEqual('b');
      var w2 = iD.Way({ nodes: 'abbc'.split('') });
      expect(w2.updateNode('b', 0).nodes.join('')).toEqual('bc');
      var w3 = iD.Way({ nodes: 'aabc'.split('') });
      expect(w3.updateNode('a', 0).nodes.join('')).toEqual('abc');
      var w4 = iD.Way({ nodes: 'abbbcbb'.split('') });
      expect(w4.updateNode('a', 0).nodes.join('')).toEqual('abcb');
    });

    it('eliminates duplicate consecutive nodes when updating same node as beginning connector a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.updateNode('a', 0).nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.updateNode('a', 0).nodes.join('')).toEqual('abca');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.updateNode('a', 0).nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.updateNode('a', 0).nodes.join('')).toEqual('abca');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.updateNode('a', 0).nodes.join('')).toEqual('abcba');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.updateNode('a', 0).nodes.join('')).toEqual('aa');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.updateNode('a', 0).nodes.join('')).toEqual('aa');
    });

    it('eliminates duplicate consecutive nodes when updating different node as beginning connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.updateNode('d', 0).nodes.join('')).toEqual('dbcd');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.updateNode('d', 0).nodes.join('')).toEqual('dbcd');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.updateNode('d', 0).nodes.join('')).toEqual('dbcd');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.updateNode('d', 0).nodes.join('')).toEqual('dbcd');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.updateNode('d', 0).nodes.join('')).toEqual('dbcbd');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.updateNode('d', 0).nodes.join('')).toEqual('dd');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.updateNode('d', 0).nodes.join('')).toEqual('dd');
    });

    it('eliminates duplicate consecutive nodes when updating different node as ending connector of a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcca'.split('') });
      expect(w1.updateNode('d', 4).nodes.join('')).toEqual('dbcd');
      var w2 = iD.Way({ nodes: 'abbca'.split('') });
      expect(w2.updateNode('d', 4).nodes.join('')).toEqual('dbcd');
      var w3 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w3.updateNode('d', 4).nodes.join('')).toEqual('dbcd');
      var w4 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w4.updateNode('d', 4).nodes.join('')).toEqual('dbcd');
      var w5 = iD.Way({ nodes: 'abbbcbba'.split('') });
      expect(w5.updateNode('d', 7).nodes.join('')).toEqual('dbcbd');
      var w6 = iD.Way({ nodes: 'aa'.split('') });
      expect(w6.updateNode('d', 1).nodes.join('')).toEqual('dd');
      var w7 = iD.Way({ nodes: 'aaa'.split('') });
      expect(w7.updateNode('d', 2).nodes.join('')).toEqual('dd');
    });
  });

  describe('#replaceNode', function() {
    it('replaces a node', function() {
      var w1 = iD.Way({ nodes: 'a'.split('') });
      expect(w1.replaceNode('a', 'b').nodes.join('')).toEqual('b');
      var w2 = iD.Way({ nodes: 'abc'.split('') });
      expect(w2.replaceNode('b', 'd').nodes.join('')).toEqual('adc');
      var w4 = iD.Way({ nodes: 'abca'.split('') });
      expect(w4.replaceNode('b', 'd').nodes.join('')).toEqual('adca');
    });

    it('replaces multiply occurring nodes', function() {
      var w1 = iD.Way({ nodes: 'abcb'.split('') });
      expect(w1.replaceNode('b', 'd').nodes.join('')).toEqual('adcd');
      var w2 = iD.Way({ nodes: 'abca'.split('') });
      expect(w2.replaceNode('a', 'd').nodes.join('')).toEqual('dbcd');
      var w3 = iD.Way({ nodes: 'aa'.split('') });
      expect(w3.replaceNode('a', 'd').nodes.join('')).toEqual('dd');
    });

    it('eliminates duplicate consecutive nodes when replacing along a linear way', function() {
      var w1 = iD.Way({ nodes: 'abbcd'.split('') });
      expect(w1.replaceNode('c', 'b').nodes.join('')).toEqual('abd');
      var w2 = iD.Way({ nodes: 'abcdd'.split('') });
      expect(w2.replaceNode('c', 'd').nodes.join('')).toEqual('abd');
      var w3 = iD.Way({ nodes: 'abbcbb'.split('') });
      expect(w3.replaceNode('c', 'b').nodes.join('')).toEqual('ab');
    });

    it('eliminates duplicate consecutive nodes when replacing internal nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abbcda'.split('') });
      expect(w1.replaceNode('c', 'b').nodes.join('')).toEqual('abda');
      var w2 = iD.Way({ nodes: 'abcdda'.split('') });
      expect(w2.replaceNode('c', 'd').nodes.join('')).toEqual('abda');
      var w3 = iD.Way({ nodes: 'abbcbba'.split('') });
      expect(w3.replaceNode('c', 'b').nodes.join('')).toEqual('aba');
    });

    it('eliminates duplicate consecutive nodes when replacing adjacent to connecting nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcda'.split('') });
      expect(w1.replaceNode('d', 'a').nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'abcda'.split('') });
      expect(w2.replaceNode('b', 'a').nodes.join('')).toEqual('acda');
      var w3 = iD.Way({ nodes: 'abcdaa'.split('') });
      expect(w3.replaceNode('d', 'a').nodes.join('')).toEqual('abca');
      var w4 = iD.Way({ nodes: 'aabcda'.split('') });
      expect(w4.replaceNode('b', 'a').nodes.join('')).toEqual('acda');
    });

    it('eliminates duplicate consecutive nodes when replacing connecting nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w1.replaceNode('a', 'd').nodes.join('')).toEqual('dbcd');
      var w2 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w2.replaceNode('a', 'd').nodes.join('')).toEqual('dbcd');
      var w3 = iD.Way({ nodes: 'aabcaa'.split('') });
      expect(w3.replaceNode('a', 'd').nodes.join('')).toEqual('dbcd');
      var w4 = iD.Way({ nodes: 'aabaacaa'.split('') });
      expect(w4.replaceNode('a', 'd').nodes.join('')).toEqual('dbdcd');
    });
  });

  describe('#removeNode', function() {
    it('removes a node', function() {
      var w1 = iD.Way({ nodes: 'a'.split('') });
      expect(w1.removeNode('a').nodes.join('')).toEqual('');
      var w2 = iD.Way({ nodes: 'abc'.split('') });
      expect(w2.removeNode('b').nodes.join('')).toEqual('ac');
      var w3 = iD.Way({ nodes: 'abca'.split('') });
      expect(w3.removeNode('b').nodes.join('')).toEqual('aca');
      var w4 = iD.Way({ nodes: 'aa'.split('') });
      expect(w4.removeNode('a').nodes.join('')).toEqual('');
    });

    it('removes multiply occurring nodes', function() {
      var w1 = iD.Way({ nodes: 'abcb'.split('') });
      expect(w1.removeNode('b').nodes.join('')).toEqual('ac');
      var w2 = iD.Way({ nodes: 'abcba'.split('') });
      expect(w2.removeNode('b').nodes.join('')).toEqual('aca');
    });

    it('eliminates duplicate consecutive nodes when removing along a linear way', function() {
      var w1 = iD.Way({ nodes: 'abbcd'.split('') });
      expect(w1.removeNode('c').nodes.join('')).toEqual('abd');
      var w2 = iD.Way({ nodes: 'abcdd'.split('') });
      expect(w2.removeNode('c').nodes.join('')).toEqual('abd');
      var w3 = iD.Way({ nodes: 'abbcbb'.split('') });
      expect(w3.removeNode('c').nodes.join('')).toEqual('ab');
    });

    it('eliminates duplicate consecutive nodes when removing internal nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abbcda'.split('') });
      expect(w1.removeNode('c').nodes.join('')).toEqual('abda');
      var w2 = iD.Way({ nodes: 'abcdda'.split('') });
      expect(w2.removeNode('c').nodes.join('')).toEqual('abda');
      var w3 = iD.Way({ nodes: 'abbcbba'.split('') });
      expect(w3.removeNode('c').nodes.join('')).toEqual('aba');
    });

    it('eliminates duplicate consecutive nodes when removing adjacent to connecting nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcdaa'.split('') });
      expect(w1.removeNode('d').nodes.join('')).toEqual('abca');
      var w2 = iD.Way({ nodes: 'aabcda'.split('') });
      expect(w2.removeNode('b').nodes.join('')).toEqual('acda');
    });

    it('eliminates duplicate consecutive nodes when removing connecting nodes along a circular way', function() {
      var w1 = iD.Way({ nodes: 'abcaa'.split('') });
      expect(w1.removeNode('a').nodes.join('')).toEqual('bcb');
      var w2 = iD.Way({ nodes: 'aabca'.split('') });
      expect(w2.removeNode('a').nodes.join('')).toEqual('bcb');
      var w3 = iD.Way({ nodes: 'aabcaa'.split('') });
      expect(w3.removeNode('a').nodes.join('')).toEqual('bcb');
      var w4 = iD.Way({ nodes: 'aabaacaa'.split('') });
      expect(w4.removeNode('a').nodes.join('')).toEqual('bcb');
    });
  });

  describe('#asJXON', function() {
    it('converts a way to jxon', function() {
      var node = iD.Way({
        id: 'w-1',
        nodes: ['n1', 'n2'],
        tags: { highway: 'residential' }
      });
      expect(node.asJXON()).toEqual({
        way: {
          '@id': '-1',
          '@version': 0,
          nd: [
            { keyAttributes: { ref: '1' } },
            { keyAttributes: { ref: '2' } }
          ],
          tag: [{ keyAttributes: { k: 'highway', v: 'residential' } }]
        }
      });
    });

    it('includes changeset if provided', function() {
      expect(iD.Way().asJXON('1234').way['@changeset']).toBe('1234');
    });
  });

  describe('#asGeoJSON', function() {
    it('converts a line to a GeoJSON LineString geometry', function() {
      var a = iD.Node({ loc: [1, 2] }),
        b = iD.Node({ loc: [3, 4] }),
        w = iD.Way({ tags: { highway: 'residential' }, nodes: [a.id, b.id] }),
        graph = iD.Graph([a, b, w]),
        json = w.asGeoJSON(graph);

      expect(json.type).toBe('LineString');
      expect(json.coordinates).toEqual([a.loc, b.loc]);
    });

    it('converts an area to a GeoJSON Polygon geometry', function() {
      var a = iD.Node({ loc: [1, 2] }),
        b = iD.Node({ loc: [5, 6] }),
        c = iD.Node({ loc: [3, 4] }),
        w = iD.Way({ tags: { area: 'yes' }, nodes: [a.id, b.id, c.id, a.id] }),
        graph = iD.Graph([a, b, c, w]),
        json = w.asGeoJSON(graph, true);

      expect(json.type).toBe('Polygon');
      expect(json.coordinates).toEqual([[a.loc, b.loc, c.loc, a.loc]]);
    });

    it('converts an unclosed area to a GeoJSON LineString geometry', function() {
      var a = iD.Node({ loc: [1, 2] }),
        b = iD.Node({ loc: [5, 6] }),
        c = iD.Node({ loc: [3, 4] }),
        w = iD.Way({ tags: { area: 'yes' }, nodes: [a.id, b.id, c.id] }),
        graph = iD.Graph([a, b, c, w]),
        json = w.asGeoJSON(graph, true);

      expect(json.type).toBe('LineString');
      expect(json.coordinates).toEqual([a.loc, b.loc, c.loc]);
    });
  });

  describe('#area', function() {
    it('returns a relative measure of area', function() {
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [-0.0002, 0.0001] }),
        iD.Node({ id: 'b', loc: [0.0002, 0.0001] }),
        iD.Node({ id: 'c', loc: [0.0002, -0.0001] }),
        iD.Node({ id: 'd', loc: [-0.0002, -0.0001] }),
        iD.Node({ id: 'e', loc: [-0.0004, 0.0002] }),
        iD.Node({ id: 'f', loc: [0.0004, 0.0002] }),
        iD.Node({ id: 'g', loc: [0.0004, -0.0002] }),
        iD.Node({ id: 'h', loc: [-0.0004, -0.0002] }),
        iD.Way({
          id: 's',
          tags: { area: 'yes' },
          nodes: ['a', 'b', 'c', 'd', 'a']
        }),
        iD.Way({
          id: 'l',
          tags: { area: 'yes' },
          nodes: ['e', 'f', 'g', 'h', 'e']
        })
      ]);

      var s = Math.abs(graph.entity('s').area(graph)),
        l = Math.abs(graph.entity('l').area(graph));

      expect(s).to.be.lt(l);
    });

    it('treats unclosed areas as if they were closed', function() {
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [-0.0002, 0.0001] }),
        iD.Node({ id: 'b', loc: [0.0002, 0.0001] }),
        iD.Node({ id: 'c', loc: [0.0002, -0.0001] }),
        iD.Node({ id: 'd', loc: [-0.0002, -0.0001] }),
        iD.Way({
          id: 's',
          tags: { area: 'yes' },
          nodes: ['a', 'b', 'c', 'd', 'a']
        }),
        iD.Way({ id: 'l', tags: { area: 'yes' }, nodes: ['a', 'b', 'c', 'd'] })
      ]);

      var s = graph.entity('s').area(graph),
        l = graph.entity('l').area(graph);

      expect(s).toBe(l);
    });

    it('returns 0 for degenerate areas', function() {
      var graph = iD.Graph([
        iD.Node({ id: 'a', loc: [-0.0002, 0.0001] }),
        iD.Node({ id: 'b', loc: [0.0002, 0.0001] }),
        iD.Way({ id: '0', tags: { area: 'yes' }, nodes: [] }),
        iD.Way({ id: '1', tags: { area: 'yes' }, nodes: ['a'] }),
        iD.Way({ id: '2', tags: { area: 'yes' }, nodes: ['a', 'b'] })
      ]);

      expect(graph.entity('0').area(graph)).toBe(0);
      expect(graph.entity('1').area(graph)).toBe(0);
      expect(graph.entity('2').area(graph)).toBe(0);
    });
  });
});
