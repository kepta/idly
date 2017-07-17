import {
  // osmEntity as Entity,
  osmWay as Way,
  osmRelation as Relation,
  osmNode as Node
} from 'src/osm/entity';
import { Entity } from 'src/osm/entity.new';
import { coreGraph as Graph } from 'src/osm/graph';

describe('osmEntity', function() {
  it.skip('returns a subclass of the appropriate type', function() {
    expect(new Entity([{ type: 'node' }])).toBeInstanceOf(Node);
    expect(new Entity([{ type: 'way' }])).toBeInstanceOf(Way);
    expect(new Entity([{ type: 'relation' }])).toBeInstanceOf(Relation);
    expect(new Entity([{ id: 'n1' }])).toBeInstanceOf(Node);
    expect(new Entity([{ id: 'w1' }])).toBeInstanceOf(Way);
    expect(new Entity([{ id: 'r1' }])).toBeInstanceOf(Relation);
  });

  //   if (debug) {
  //     it('is frozen', function() {
  //       expect(Object.isFrozen(Entity())).toBe(true);
  //     });

  //     it('freezes tags', function() {
  //       expect(Object.isFrozen(Entity().tags)).toBe(true);
  //     });
  //   }

  describe('.id', function() {
    it('generates unique IDs', function() {
      expect(Entity.genId('node')).not.toBe(Entity.genId('node'));
    });

    describe('.fromOSM', function() {
      it('returns a ID string unique across entity types', function() {
        expect(Entity.fromOSM('node', 1)).toBe('n1');
      });
    });

    describe('.toOSM', function() {
      it('reverses fromOSM', function() {
        expect(Entity.toOSM(Entity.fromOSM('node', 1))).toBe(1);
      });
    });
  });

  describe('#copy', function() {
    it('returns a new Entity', function() {
      var n = new Entity([{ id: 'n' }]),
        result = n.copy(null, {});
      expect(result).toBeInstanceOf(Entity);
      expect(result).not.toBe(n);
    });

    it('adds the new Entity to input object', function() {
      var n = new Entity([{ id: 'n' }]),
        copies: any = {},
        result = n.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(copies.n).toBe(result);
    });

    it('returns an existing copy in input object', function() {
      var n = new Entity([{ id: 'n' }]),
        copies: any = {},
        result1 = n.copy(null, copies),
        result2 = n.copy(null, copies);
      expect(Object.keys(copies)).toHaveLength(1);
      expect(result1).toBe(result2);
    });

    it("resets 'id', 'user', and 'version' properties", function() {
      var n = new Entity([{ id: 'n', version: 10, user: 'user' }]),
        copies: any = {};
      n.copy(null, copies);
      expect(copies.n.isNew()).toBeTruthy();
      expect(copies.n.version).toBeUndefined();
      expect(copies.n.user).toBeUndefined();
    });

    it('copies tags', function() {
      var n = new Entity([{ id: 'n', tags: { foo: 'foo' } }]),
        copies: any = {};
      n.copy(null, copies);
      expect(copies.n.tags).toBe(n.tags);
    });
  });

  describe('#update', function() {
    it('returns a new Entity', function() {
      var a = new Entity([]),
        b = a.update({});
      expect(b instanceof Entity).toBe(true);
      expect(a).not.toBe(b);
    });

    it('updates the specified attributes', function() {
      var tags = { foo: 'bar' },
        e = new Entity([]).update({ tags: tags });
      expect(e.tags).toBe(tags);
    });

    it('preserves existing attributes', function() {
      var e = new Entity([{ id: 'w1' }]).update({});
      expect(e.id).toBe('w1');
    });

    it("doesn't modify the input", function() {
      var attrs = { tags: { foo: 'bar' } };
      new Entity([]).update(attrs);
      expect(attrs).toEqual({ tags: { foo: 'bar' } });
    });

    it("doesn't copy prototype properties", function() {
      expect(new Entity([]).update({}).hasOwnProperty('update')).toBeFalsy();
    });

    it('sets v to 1 if previously undefined', function() {
      expect(new Entity([]).update({}).v).toBe(1);
    });

    it('increments v', function() {
      expect(new Entity([{ v: 1 }]).update({}).v).toBe(2);
    });
  });

  describe('#mergeTags', function() {
    it('returns self if unchanged', function() {
      var a = new Entity([{ tags: { a: 'a' } }]),
        b = a.mergeTags({ a: 'a' });
      expect(a).toBe(b);
    });

    it('returns a new Entity if changed', function() {
      var a = new Entity([{ tags: { a: 'a' } }]),
        b = a.mergeTags({ a: 'b' });
      expect(b instanceof Entity).toBe(true);
      expect(a).not.toBe(b);
    });

    it('merges tags', function() {
      var a = new Entity([{ tags: { a: 'a' } }]),
        b = a.mergeTags({ b: 'b' });
      expect(b.tags).toEqual({ a: 'a', b: 'b' });
    });

    it('combines non-conflicting tags', function() {
      var a = new Entity([{ tags: { a: 'a' } }]),
        b = a.mergeTags({ a: 'a' });
      expect(b.tags).toEqual({ a: 'a' });
    });

    it('combines conflicting tags with semicolons', function() {
      var a = new Entity([{ tags: { a: 'a' } }]),
        b = a.mergeTags({ a: 'b' });
      expect(b.tags).toEqual({ a: 'a;b' });
    });

    it('combines combined tags', function() {
      var a = new Entity([{ tags: { a: 'a;b' } }]),
        b = new Entity([{ tags: { a: 'b' } }]);

      expect(a.mergeTags(b.tags).tags).toEqual({ a: 'a;b' });
      expect(b.mergeTags(a.tags).tags).toEqual({ a: 'b;a' });
    });

    it('combines combined tags with whitespace', function() {
      var a = new Entity([{ tags: { a: 'a; b' } }]),
        b = new Entity([{ tags: { a: 'b' } }]);

      expect(a.mergeTags(b.tags).tags).toEqual({ a: 'a;b' });
      expect(b.mergeTags(a.tags).tags).toEqual({ a: 'b;a' });
    });
  });

  describe('#osmId', function() {
    it('returns an OSM ID as a string', function() {
      expect(new Entity([{ id: 'w1234' }]).osmId()).toEqual(1234);
      expect(new Entity([{ id: 'n1234' }]).osmId()).toEqual(1234);
      expect(new Entity([{ id: 'r1234' }]).osmId()).toEqual(1234);
    });
  });

  describe.skip('#intersects', function() {
    it('returns true for a way with a node within the given extent', function() {
      var node = Node({ loc: [0, 0] }),
        way = Way({ nodes: [node.id] }),
        graph = Graph([node, way]);
      expect(way.intersects([[-5, -5], [5, 5]], graph)).toBe(true);
    });

    it('returns false for way with no nodes within the given extent', function() {
      var node = Node({ loc: [6, 6] }),
        way = Way({ nodes: [node.id] }),
        graph = Graph([node, way]);
      expect(way.intersects([[-5, -5], [5, 5]], graph)).toBe(false);
    });
  });

  describe.skip('#isUsed', function() {
    it('returns false for an entity without tags', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(node.isUsed(graph)).toBe(false);
    });

    it('returns true for an entity with tags', function() {
      var node = Node({ tags: { foo: 'bar' } }),
        graph = Graph([node]);
      expect(node.isUsed(graph)).toBe(true);
    });

    it('returns false for an entity with only an area=yes tag', function() {
      var node = Node({ tags: { area: 'yes' } }),
        graph = Graph([node]);
      expect(node.isUsed(graph)).toBe(false);
    });

    it('returns true for an entity that is a relation member', function() {
      var node = Node(),
        relation = Relation({ members: [{ id: node.id }] }),
        graph = Graph([node, relation]);
      expect(node.isUsed(graph)).toBe(true);
    });
  });

  describe('#hasDeprecatedTags', function() {
    it('returns false if entity has no tags', function() {
      expect(new Entity([]).deprecatedTags()).toEqual({});
    });

    it('returns true if entity has deprecated tags', function() {
      expect(
        new Entity([{ tags: { barrier: 'wire_fence' } }]).deprecatedTags()
      ).toEqual({ barrier: 'wire_fence' });
    });
  });

  describe('#hasInterestingTags', function() {
    it('returns false if the entity has no tags', function() {
      expect(new Entity([]).hasInterestingTags()).toBe(false);
    });

    it("returns true if the entity has tags other than 'attribution', 'created_by', 'source', 'odbl' and tiger tags", function() {
      expect(new Entity([{ tags: { foo: 'bar' } }]).hasInterestingTags()).toBe(
        true
      );
    });

    it('return false if the entity has only uninteresting tags', function() {
      expect(
        new Entity([{ tags: { source: 'Bing' } }]).hasInterestingTags()
      ).toBe(false);
    });

    it('return false if the entity has only tiger tags', function() {
      expect(
        new Entity([
          {
            tags: { 'tiger:source': 'blah', 'tiger:foo': 'bar' }
          }
        ]).hasInterestingTags()
      ).toBe(false);
    });
  });

  describe('#isHighwayIntersection', function() {
    it('returns false', function() {
      expect(new Entity([]).isHighwayIntersection()).toBe(false);
    });
  });

  describe('#isDegenerate', function() {
    it('returns true', function() {
      expect(new Entity([]).isDegenerate()).toBe(true);
    });
  });
});
