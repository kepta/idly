describe('iD.osmRelation', function() {
  if (iD.debug) {
    it('freezes nodes', function() {
      expect(Object.isFrozen(iD.Relation().members)).toBe(true);
    });
  }

  it('returns a relation', function() {
    expect(iD.Relation()).toBeInstanceOf(iD.Relation);
    expect(iD.Relation().type).toBe('relation');
  });

  it('defaults members to an empty array', function() {
    expect(iD.Relation().members).toEqual([]);
  });

  it('sets members as specified', function() {
    expect(iD.Relation({ members: ['n-1'] }).members).toEqual(['n-1']);
  });

  it('defaults tags to an empty object', function() {
    expect(iD.Relation().tags).toEqual({});
  });

  it('sets tags as specified', function() {
    expect(iD.Relation({ tags: { foo: 'bar' } }).tags).toEqual({ foo: 'bar' });
  });

  describe('#copy', function() {
    it('returns a new Relation', function() {
      var r = iD.Relation({ id: 'r' }),
        result = r.copy(null, {});

      expect(result).toBeInstanceOf(iD.Relation);
      expect(result).not.toBe(r);
    });

    it('adds the new Relation to input object', function() {
      var r = iD.Relation({ id: 'r' }),
        copies = {},
        result = r.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(copies.r).toBe(result);
    });

    it('returns an existing copy in input object', function() {
      var r = iD.Relation({ id: 'r' }),
        copies = {},
        result1 = r.copy(null, copies),
        result2 = r.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(result1).toBe(result2);
    });

    it('deep copies members', function() {
      var a = iD.Node({ id: 'a' }),
        b = iD.Node({ id: 'b' }),
        c = iD.Node({ id: 'c' }),
        w = iD.Way({ id: 'w', nodes: ['a', 'b', 'c', 'a'] }),
        r = iD.Relation({ id: 'r', members: [{ id: 'w', role: 'outer' }] }),
        graph = iD.Graph([a, b, c, w, r]),
        copies = {},
        result = r.copy(graph, copies);

      expect(Object.keys(copies)).toHaveLength(5);
      expect(copies.w).toBeInstanceOf(iD.Way);
      expect(copies.a).toBeInstanceOf(iD.Node);
      expect(copies.b).toBeInstanceOf(iD.Node);
      expect(copies.c).toBeInstanceOf(iD.Node);
      expect(result.members[0].id).not.toBe(r.members[0].id);
      expect(result.members[0].role).toBe(r.members[0].role);
    });

    it('deep copies non-tree relation graphs without duplicating children', function() {
      var w = iD.Way({ id: 'w' }),
        r1 = iD.Relation({ id: 'r1', members: [{ id: 'r2' }, { id: 'w' }] }),
        r2 = iD.Relation({ id: 'r2', members: [{ id: 'w' }] }),
        graph = iD.Graph([w, r1, r2]),
        copies = {};
      r1.copy(graph, copies);

      expect(Object.keys(copies)).toHaveLength(3);
      expect(copies.r1).toBeInstanceOf(iD.Relation);
      expect(copies.r2).toBeInstanceOf(iD.Relation);
      expect(copies.w).toBeInstanceOf(iD.Way);
      expect(copies.r1.members[0].id).toBe(copies.r2.id);
      expect(copies.r1.members[1].id).toBe(copies.w.id);
      expect(copies.r2.members[0].id).toBe(copies.w.id);
    });

    it('deep copies cyclical relation graphs without issue', function() {
      var r1 = iD.Relation({ id: 'r1', members: [{ id: 'r2' }] }),
        r2 = iD.Relation({ id: 'r2', members: [{ id: 'r1' }] }),
        graph = iD.Graph([r1, r2]),
        copies = {};
      r1.copy(graph, copies);

      expect(Object.keys(copies)).toHaveLength(2);
      expect(copies.r1.members[0].id).toBe(copies.r2.id);
      expect(copies.r2.members[0].id).toBe(copies.r1.id);
    });

    it('deep copies self-referencing relations without issue', function() {
      var r = iD.Relation({ id: 'r', members: [{ id: 'r' }] }),
        graph = iD.Graph([r]),
        copies = {};
      r.copy(graph, copies);

      expect(Object.keys(copies)).toHaveLength(1);
      expect(copies.r.members[0].id).toBe(copies.r.id);
    });
  });

  describe('#extent', function() {
    it('returns the minimal extent containing the extents of all members', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [5, 10] }),
        r = iD.Relation({ members: [{ id: a.id }, { id: b.id }] }),
        graph = iD.Graph([a, b, r]);

      expect(r.extent(graph).equals([[0, 0], [5, 10]])).toBeTruthy();
    });

    it('returns the known extent of incomplete relations', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [5, 10] }),
        r = iD.Relation({ members: [{ id: a.id }, { id: b.id }] }),
        graph = iD.Graph([a, r]);

      expect(r.extent(graph).equals([[0, 0], [0, 0]])).toBeTruthy();
    });

    it('does not error on self-referencing relations', function() {
      var r = iD.Relation();
      r = r.addMember({ id: r.id });
      expect(r.extent(iD.Graph([r]))).toEqual(iD.geoExtent());
    });
  });

  describe('#geometry', function() {
    it("returns 'area' for multipolygons", function() {
      expect(
        iD.Relation({ tags: { type: 'multipolygon' } }).geometry(iD.Graph())
      ).toBe('area');
    });

    it("returns 'relation' for other relations", function() {
      expect(iD.Relation().geometry(iD.Graph())).toBe('relation');
    });
  });

  describe('#isDegenerate', function() {
    it('returns true for a relation without members', function() {
      expect(iD.Relation().isDegenerate()).toBe(true);
    });

    it('returns false for a relation with members', function() {
      expect(
        iD.Relation({ members: [{ id: 'a', role: 'inner' }] }).isDegenerate()
      ).toBe(false);
    });
  });

  describe('#memberByRole', function() {
    it('returns the first member with the given role', function() {
      var r = iD.Relation({
        members: [
          { id: 'a', role: 'inner' },
          { id: 'b', role: 'outer' },
          { id: 'c', role: 'outer' }
        ]
      });
      expect(r.memberByRole('outer')).toEqual({
        id: 'b',
        role: 'outer',
        index: 1
      });
    });

    it('returns undefined if no members have the given role', function() {
      expect(iD.Relation().memberByRole('outer')).toBeUndefined();
    });
  });

  describe('#memberById', function() {
    it('returns the first member with the given id', function() {
      var r = iD.Relation({
        members: [
          { id: 'a', role: 'outer' },
          { id: 'b', role: 'outer' },
          { id: 'b', role: 'inner' }
        ]
      });
      expect(r.memberById('b')).toEqual({ id: 'b', role: 'outer', index: 1 });
    });

    it('returns undefined if no members have the given role', function() {
      expect(iD.Relation().memberById('b')).toBeUndefined();
    });
  });

  describe('#isRestriction', function() {
    it("returns true for 'restriction' type", function() {
      expect(
        iD.Relation({ tags: { type: 'restriction' } }).isRestriction()
      ).toBe(true);
    });

    it("returns true for 'restriction:type' types", function() {
      expect(
        iD.Relation({ tags: { type: 'restriction:bus' } }).isRestriction()
      ).toBe(true);
    });

    it('returns false otherwise', function() {
      expect(iD.Relation().isRestriction()).toBe(false);
      expect(
        iD.Relation({ tags: { type: 'multipolygon' } }).isRestriction()
      ).toBe(false);
    });
  });

  describe('#indexedMembers', function() {
    it('returns an array of members extended with indexes', function() {
      var r = iD.Relation({ members: [{ id: '1' }, { id: '3' }] });
      expect(r.indexedMembers()).toEqual([
        { id: '1', index: 0 },
        { id: '3', index: 1 }
      ]);
    });
  });

  describe('#addMember', function() {
    it('adds a member at the end of the relation', function() {
      var r = iD.Relation();
      expect(r.addMember({ id: '1' }).members).toEqual([{ id: '1' }]);
    });

    it('adds a member at index 0', function() {
      var r = iD.Relation({ members: [{ id: '1' }] });
      expect(r.addMember({ id: '2' }, 0).members).toEqual([
        { id: '2' },
        { id: '1' }
      ]);
    });

    it('adds a member at a positive index', function() {
      var r = iD.Relation({ members: [{ id: '1' }, { id: '3' }] });
      expect(r.addMember({ id: '2' }, 1).members).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ]);
    });

    it('adds a member at a negative index', function() {
      var r = iD.Relation({ members: [{ id: '1' }, { id: '3' }] });
      expect(r.addMember({ id: '2' }, -1).members).toEqual([
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ]);
    });
  });

  describe('#updateMember', function() {
    it('updates the properties of the relation member at the specified index', function() {
      var r = iD.Relation({ members: [{ role: 'forward' }] });
      expect(r.updateMember({ role: 'backward' }, 0).members).toEqual([
        { role: 'backward' }
      ]);
    });
  });

  describe('#removeMember', function() {
    it('removes the member at the specified index', function() {
      var r = iD.Relation({ members: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] });
      expect(r.removeMember(1).members).toEqual([{ id: 'a' }, { id: 'c' }]);
    });
  });

  describe('#removeMembersWithID', function() {
    it('removes members with the given ID', function() {
      var r = iD.Relation({ members: [{ id: 'a' }, { id: 'b' }, { id: 'a' }] });
      expect(r.removeMembersWithID('a').members).toEqual([{ id: 'b' }]);
    });
  });

  describe('#replaceMember', function() {
    it('returns self if self does not contain needle', function() {
      var r = iD.Relation({ members: [] });
      expect(r.replaceMember({ id: 'a' }, { id: 'b' })).toBe(r);
    });

    it("replaces a member which doesn't already exist", function() {
      var r = iD.Relation({ members: [{ id: 'a', role: 'a' }] });
      expect(
        r.replaceMember({ id: 'a' }, { id: 'b', type: 'node' }).members
      ).toEqual([{ id: 'b', role: 'a', type: 'node' }]);
    });

    it('preserves the existing role', function() {
      var r = iD.Relation({ members: [{ id: 'a', role: 'a', type: 'node' }] });
      expect(
        r.replaceMember({ id: 'a' }, { id: 'b', type: 'node' }).members
      ).toEqual([{ id: 'b', role: 'a', type: 'node' }]);
    });

    it('uses the replacement type', function() {
      var r = iD.Relation({ members: [{ id: 'a', role: 'a', type: 'node' }] });
      expect(
        r.replaceMember({ id: 'a' }, { id: 'b', type: 'way' }).members
      ).toEqual([{ id: 'b', role: 'a', type: 'way' }]);
    });

    it('removes members if replacing them would produce duplicates', function() {
      var r = iD.Relation({
        members: [
          { id: 'a', role: 'b', type: 'node' },
          { id: 'b', role: 'b', type: 'node' }
        ]
      });
      expect(
        r.replaceMember({ id: 'a' }, { id: 'b', type: 'node' }).members
      ).toEqual([{ id: 'b', role: 'b', type: 'node' }]);
    });
  });

  describe('#asJXON', function() {
    it('converts a relation to jxon', function() {
      var relation = iD.Relation({
        id: 'r-1',
        members: [{ id: 'w1', role: 'forward', type: 'way' }],
        tags: { type: 'route' }
      });
      expect(relation.asJXON()).toEqual({
        relation: {
          '@id': '-1',
          '@version': 0,
          member: [
            { keyAttributes: { ref: '1', role: 'forward', type: 'way' } }
          ],
          tag: [{ keyAttributes: { k: 'type', v: 'route' } }]
        }
      });
    });

    it('includes changeset if provided', function() {
      expect(iD.Relation().asJXON('1234').relation['@changeset']).toBe('1234');
    });
  });

  describe('#asGeoJSON', function() {
    it('converts a multipolygon to a GeoJSON MultiPolygon geometry', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [3, 3] }),
        c = iD.Node({ loc: [2, 2] }),
        w = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        r = iD.Relation({
          tags: { type: 'multipolygon' },
          members: [{ id: w.id, type: 'way' }]
        }),
        g = iD.Graph([a, b, c, w, r]),
        json = r.asGeoJSON(g);

      expect(json.type).toBe('MultiPolygon');
      expect(json.coordinates).toEqual([[[a.loc, b.loc, c.loc, a.loc]]]);
    });

    it('forces clockwise winding order for outer multipolygon ways', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        w = iD.Way({ nodes: [a.id, c.id, b.id, a.id] }),
        r = iD.Relation({
          tags: { type: 'multipolygon' },
          members: [{ id: w.id, type: 'way' }]
        }),
        g = iD.Graph([a, b, c, w, r]),
        json = r.asGeoJSON(g);

      expect(json.coordinates[0][0]).toEqual([a.loc, b.loc, c.loc, a.loc]);
    });

    it('forces counterclockwise winding order for inner multipolygon ways', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        d = iD.Node({ loc: [0.1, 0.1] }),
        e = iD.Node({ loc: [0.1, 0.2] }),
        f = iD.Node({ loc: [0.2, 0.1] }),
        outer = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        inner = iD.Way({ nodes: [d.id, e.id, f.id, d.id] }),
        r = iD.Relation({
          members: [
            { id: outer.id, type: 'way' },
            { id: inner.id, role: 'inner', type: 'way' }
          ]
        }),
        g = iD.Graph([a, b, c, d, e, f, outer, inner, r]);

      expect(r.multipolygon(g)[0][1]).toEqual([d.loc, f.loc, e.loc, d.loc]);
    });

    it('converts a relation to a GeoJSON FeatureCollection', function() {
      var a = iD.Node({ loc: [1, 1] }),
        r = iD.Relation({
          tags: { type: 'type' },
          members: [{ id: a.id, role: 'role' }]
        }),
        g = iD.Graph([a, r]),
        json = r.asGeoJSON(g);

      expect(json.type).toBe('FeatureCollection');
      expect(json.properties).toEqual({ type: 'type' });
      expect(json.features).toEqual([
        _.extend({ role: 'role' }, a.asGeoJSON(g))
      ]);
    });
  });

  describe('#multipolygon', function() {
    specify('single polygon consisting of a single way', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [3, 3] }),
        c = iD.Node({ loc: [2, 2] }),
        w = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        r = iD.Relation({ members: [{ id: w.id, type: 'way' }] }),
        g = iD.Graph([a, b, c, w, r]);

      expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc, a.loc]]]);
    });

    specify('single polygon consisting of multiple ways', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [3, 3] }),
        c = iD.Node({ loc: [2, 2] }),
        w1 = iD.Way({ nodes: [a.id, b.id] }),
        w2 = iD.Way({ nodes: [b.id, c.id, a.id] }),
        r = iD.Relation({
          members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
        }),
        g = iD.Graph([a, b, c, w1, w2, r]);

      expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc, a.loc]]]);
    });

    specify(
      'single polygon consisting of multiple ways, one needing reversal',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [3, 3] }),
          c = iD.Node({ loc: [2, 2] }),
          w1 = iD.Way({ nodes: [a.id, b.id] }),
          w2 = iD.Way({ nodes: [a.id, c.id, b.id] }),
          r = iD.Relation({
            members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
          }),
          g = iD.Graph([a, b, c, w1, w2, r]);

        expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc, a.loc]]]);
      }
    );

    specify('multiple polygons consisting of single ways', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [3, 3] }),
        c = iD.Node({ loc: [2, 2] }),
        d = iD.Node({ loc: [4, 4] }),
        e = iD.Node({ loc: [6, 6] }),
        f = iD.Node({ loc: [5, 5] }),
        w1 = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        w2 = iD.Way({ nodes: [d.id, e.id, f.id, d.id] }),
        r = iD.Relation({
          members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
        }),
        g = iD.Graph([a, b, c, d, e, f, w1, w2, r]);

      expect(r.multipolygon(g)).toEqual([
        [[a.loc, b.loc, c.loc, a.loc]],
        [[d.loc, e.loc, f.loc, d.loc]]
      ]);
    });

    specify(
      'invalid geometry: unclosed ring consisting of a single way',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [3, 3] }),
          c = iD.Node({ loc: [2, 2] }),
          w = iD.Way({ nodes: [a.id, b.id, c.id] }),
          r = iD.Relation({ members: [{ id: w.id, type: 'way' }] }),
          g = iD.Graph([a, b, c, w, r]);

        expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc]]]);
      }
    );

    specify(
      'invalid geometry: unclosed ring consisting of multiple ways',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [3, 3] }),
          c = iD.Node({ loc: [2, 2] }),
          w1 = iD.Way({ nodes: [a.id, b.id] }),
          w2 = iD.Way({ nodes: [b.id, c.id] }),
          r = iD.Relation({
            members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
          }),
          g = iD.Graph([a, b, c, w1, w2, r]);

        expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc]]]);
      }
    );

    specify(
      'invalid geometry: unclosed ring consisting of multiple ways, alternate order',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [2, 2] }),
          c = iD.Node({ loc: [3, 3] }),
          d = iD.Node({ loc: [4, 4] }),
          w1 = iD.Way({ nodes: [c.id, d.id] }),
          w2 = iD.Way({ nodes: [a.id, b.id, c.id] }),
          r = iD.Relation({
            members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
          }),
          g = iD.Graph([a, b, c, d, w1, w2, r]);

        expect(r.multipolygon(g)).toEqual([[[d.loc, c.loc, b.loc, a.loc]]]);
      }
    );

    specify(
      'invalid geometry: unclosed ring consisting of multiple ways, one needing reversal',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [2, 2] }),
          c = iD.Node({ loc: [3, 3] }),
          d = iD.Node({ loc: [4, 4] }),
          w1 = iD.Way({ nodes: [a.id, b.id, c.id] }),
          w2 = iD.Way({ nodes: [d.id, c.id] }),
          r = iD.Relation({
            members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
          }),
          g = iD.Graph([a, b, c, d, w1, w2, r]);

        expect(r.multipolygon(g)).toEqual([[[d.loc, c.loc, b.loc, a.loc]]]);
      }
    );

    specify(
      'invalid geometry: unclosed ring consisting of multiple ways, one needing reversal, alternate order',
      function() {
        var a = iD.Node({ loc: [1, 1] }),
          b = iD.Node({ loc: [2, 2] }),
          c = iD.Node({ loc: [3, 3] }),
          d = iD.Node({ loc: [4, 4] }),
          w1 = iD.Way({ nodes: [c.id, d.id] }),
          w2 = iD.Way({ nodes: [c.id, b.id, a.id] }),
          r = iD.Relation({
            members: [{ id: w1.id, type: 'way' }, { id: w2.id, type: 'way' }]
          }),
          g = iD.Graph([a, b, c, d, w1, w2, r]);

        expect(r.multipolygon(g)).toEqual([[[d.loc, c.loc, b.loc, a.loc]]]);
      }
    );

    specify('single polygon with single single-way inner', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        d = iD.Node({ loc: [0.1, 0.1] }),
        e = iD.Node({ loc: [0.2, 0.1] }),
        f = iD.Node({ loc: [0.1, 0.2] }),
        outer = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        inner = iD.Way({ nodes: [d.id, e.id, f.id, d.id] }),
        r = iD.Relation({
          members: [
            { id: outer.id, type: 'way' },
            { id: inner.id, role: 'inner', type: 'way' }
          ]
        }),
        g = iD.Graph([a, b, c, d, e, f, outer, inner, r]);

      expect(r.multipolygon(g)).toEqual([
        [[a.loc, b.loc, c.loc, a.loc], [d.loc, e.loc, f.loc, d.loc]]
      ]);
    });

    specify('single polygon with single multi-way inner', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        d = iD.Node({ loc: [0.1, 0.1] }),
        e = iD.Node({ loc: [0.2, 0.1] }),
        f = iD.Node({ loc: [0.2, 0.1] }),
        outer = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        inner1 = iD.Way({ nodes: [d.id, e.id] }),
        inner2 = iD.Way({ nodes: [e.id, f.id, d.id] }),
        r = iD.Relation({
          members: [
            { id: outer.id, type: 'way' },
            { id: inner1.id, role: 'inner', type: 'way' },
            { id: inner2.id, role: 'inner', type: 'way' }
          ]
        }),
        graph = iD.Graph([a, b, c, d, e, f, outer, inner1, inner2, r]);

      expect(r.multipolygon(graph)).toEqual([
        [[a.loc, b.loc, c.loc, a.loc], [d.loc, e.loc, f.loc, d.loc]]
      ]);
    });

    specify('single polygon with multiple single-way inners', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        d = iD.Node({ loc: [0.1, 0.1] }),
        e = iD.Node({ loc: [0.2, 0.1] }),
        f = iD.Node({ loc: [0.1, 0.2] }),
        g = iD.Node({ loc: [0.2, 0.2] }),
        h = iD.Node({ loc: [0.3, 0.2] }),
        i = iD.Node({ loc: [0.2, 0.3] }),
        outer = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        inner1 = iD.Way({ nodes: [d.id, e.id, f.id, d.id] }),
        inner2 = iD.Way({ nodes: [g.id, h.id, i.id, g.id] }),
        r = iD.Relation({
          members: [
            { id: outer.id, type: 'way' },
            { id: inner1.id, role: 'inner', type: 'way' },
            { id: inner2.id, role: 'inner', type: 'way' }
          ]
        }),
        graph = iD.Graph([a, b, c, d, e, f, g, h, i, outer, inner1, inner2, r]);

      expect(r.multipolygon(graph)).toEqual([
        [
          [a.loc, b.loc, c.loc, a.loc],
          [d.loc, e.loc, f.loc, d.loc],
          [g.loc, h.loc, i.loc, g.loc]
        ]
      ]);
    });

    specify('multiple polygons with single single-way inner', function() {
      var a = iD.Node({ loc: [0, 0] }),
        b = iD.Node({ loc: [0, 1] }),
        c = iD.Node({ loc: [1, 0] }),
        d = iD.Node({ loc: [0.1, 0.1] }),
        e = iD.Node({ loc: [0.2, 0.1] }),
        f = iD.Node({ loc: [0.1, 0.2] }),
        g = iD.Node({ loc: [0, 0] }),
        h = iD.Node({ loc: [0, -1] }),
        i = iD.Node({ loc: [-1, 0] }),
        outer1 = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        outer2 = iD.Way({ nodes: [g.id, h.id, i.id, g.id] }),
        inner = iD.Way({ nodes: [d.id, e.id, f.id, d.id] }),
        r = iD.Relation({
          members: [
            { id: outer1.id, type: 'way' },
            { id: outer2.id, type: 'way' },
            { id: inner.id, role: 'inner', type: 'way' }
          ]
        }),
        graph = iD.Graph([a, b, c, d, e, f, g, h, i, outer1, outer2, inner, r]);

      expect(r.multipolygon(graph)).toEqual([
        [[a.loc, b.loc, c.loc, a.loc], [d.loc, e.loc, f.loc, d.loc]],
        [[g.loc, h.loc, i.loc, g.loc]]
      ]);
    });

    specify('invalid geometry: unmatched inner', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [2, 2] }),
        c = iD.Node({ loc: [3, 3] }),
        w = iD.Way({ nodes: [a.id, b.id, c.id, a.id] }),
        r = iD.Relation({
          members: [{ id: w.id, role: 'inner', type: 'way' }]
        }),
        g = iD.Graph([a, b, c, w, r]);

      expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc, a.loc]]]);
    });

    specify('incomplete relation', function() {
      var a = iD.Node({ loc: [1, 1] }),
        b = iD.Node({ loc: [2, 2] }),
        c = iD.Node({ loc: [3, 3] }),
        w1 = iD.Way({ nodes: [a.id, b.id, c.id] }),
        w2 = iD.Way(),
        r = iD.Relation({
          members: [{ id: w2.id, type: 'way' }, { id: w1.id, type: 'way' }]
        }),
        g = iD.Graph([a, b, c, w1, r]);

      expect(r.multipolygon(g)).toEqual([[[a.loc, b.loc, c.loc]]]);
    });
  });

  describe('.creationOrder comparator', function() {
    specify('orders existing relations newest-first', function() {
      var a = iD.Relation({ id: 'r1' }),
        b = iD.Relation({ id: 'r2' });
      expect(iD.Relation.creationOrder(a, b)).toBeGreaterThan(0);
      expect(iD.Relation.creationOrder(b, a)).toBeLessThan(0);
    });

    specify('orders new relations newest-first', function() {
      var a = iD.Relation({ id: 'r-1' }),
        b = iD.Relation({ id: 'r-2' });
      expect(iD.Relation.creationOrder(a, b)).toBeGreaterThan(0);
      expect(iD.Relation.creationOrder(b, a)).toBeLessThan(0);
    });
  });
});
