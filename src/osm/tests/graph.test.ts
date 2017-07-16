import {
  osmEntity as Entity,
  osmWay as Way,
  osmRelation as Relation,
  osmNode as Node
} from 'src/osm/entity';

import { coreGraph as Graph } from 'src/osm/graph';

describe('Graph', function() {
  describe('constructor', function() {
    it('accepts an entities Array', function() {
      var entity = Entity(),
        graph = Graph([entity]);
      expect(graph.entity(entity.id)).toBe(entity);
    });

    it('accepts a Graph', function() {
      var entity = Entity(),
        graph = Graph(Graph([entity]));
      expect(graph.entity(entity.id)).toBe(entity);
    });

    it("copies other's entities", function() {
      var entity = Entity(),
        base = Graph([entity]),
        graph = Graph(base);
      expect(graph.entities).not.toBe(base.entities);
    });

    it("rebases on other's base", function() {
      var base = Graph(),
        graph = Graph(base);
      expect(graph.base().entities).toBe(base.base().entities);
    });

    it('freezes by default', function() {
      expect(Graph().frozen).toBe(true);
    });

    it('remains mutable if passed true as second argument', function() {
      expect(Graph([], true).frozen).toBe(false);
    });
  });

  describe('#hasEntity', function() {
    it('returns the entity when present', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.hasEntity(node.id)).toBe(node);
    });

    it('returns undefined when the entity is not present', function() {
      expect(Graph().hasEntity('1')).toBeUndefined();
    });
  });

  describe('#entity', function() {
    it('returns the entity when present', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.entity(node.id)).toBe(node);
    });

    it('throws when the entity is not present', function() {
      expect(function() {
        Graph().entity('1');
      }).toThrowError();
    });
  });

  describe('#rebase', function() {
    it('preserves existing entities', function() {
      var node = Node({ id: 'n' }),
        graph = Graph([node]);

      graph.rebase([], [graph]);

      expect(graph.entity('n')).toBe(node);
    });

    it('includes new entities', function() {
      var node = Node({ id: 'n' }),
        graph = Graph();

      graph.rebase([node], [graph]);

      expect(graph.entity('n')).toBe(node);
    });

    it("doesn't rebase deleted entities", function() {
      var node = Node({ id: 'n', visible: false }),
        graph = Graph();

      graph.rebase([node], [graph]);

      expect(graph.hasEntity('n')).toBeFalsy();
    });

    it('gives precedence to existing entities', function() {
      var a = Node({ id: 'n' }),
        b = Node({ id: 'n' }),
        graph = Graph([a]);

      graph.rebase([b], [graph]);

      expect(graph.entity('n')).toBe(a);
    });

    it('gives precedence to new entities when force = true', function() {
      var a = Node({ id: 'n' }),
        b = Node({ id: 'n' }),
        graph = Graph([a]);

      graph.rebase([b], [graph], true);

      expect(graph.entity('n')).toBe(b);
    });

    it('inherits entities from base prototypally', function() {
      var graph = Graph();

      graph.rebase([Node({ id: 'n' })], [graph]);

      expect(graph.entities.hasOwnProperty('n')).toBe(false);
    });

    it('updates parentWays', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        w2 = Way({ id: 'w2', nodes: ['n'] }),
        graph = Graph([n, w1]);

      graph.rebase([w2], [graph]);

      expect(graph.parentWays(n)).toEqual([w1, w2]);
      expect(graph._parentWays.hasOwnProperty('n')).toBe(false);
    });

    it('avoids adding duplicate parentWays', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        graph = Graph([n, w1]);

      graph.rebase([w1], [graph]);

      expect(graph.parentWays(n)).toEqual([w1]);
    });

    it('updates parentWays for nodes with modified parentWays', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        w2 = Way({ id: 'w2', nodes: ['n'] }),
        w3 = Way({ id: 'w3', nodes: ['n'] }),
        graph = Graph([n, w1]),
        graph2 = graph.replace(w2);

      graph.rebase([w3], [graph, graph2]);

      expect(graph2.parentWays(n)).toEqual([w1, w2, w3]);
    });

    it('avoids re-adding a modified way as a parent way', function() {
      var n1 = Node({ id: 'n1' }),
        n2 = Node({ id: 'n2' }),
        w1 = Way({ id: 'w1', nodes: ['n1', 'n2'] }),
        w2 = w1.removeNode('n2'),
        graph = Graph([n1, n2, w1]),
        graph2 = graph.replace(w2);

      graph.rebase([w1], [graph, graph2]);

      expect(graph2.parentWays(n2)).toEqual([]);
    });

    it('avoids re-adding a deleted way as a parent way', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        graph = Graph([n, w1]),
        graph2 = graph.remove(w1);

      graph.rebase([w1], [graph, graph2]);

      expect(graph2.parentWays(n)).toEqual([]);
    });

    it('re-adds a deleted node that is discovered to have another parent', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        w2 = Way({ id: 'w2', nodes: ['n'] }),
        graph = Graph([n, w1]),
        graph2 = graph.remove(n);

      graph.rebase([n, w2], [graph, graph2]);

      expect(graph2.entity('n')).toEqual(n);
    });

    it('updates parentRelations', function() {
      var n = Node({ id: 'n' }),
        r1 = Relation({ id: 'r1', members: [{ id: 'n' }] }),
        r2 = Relation({ id: 'r2', members: [{ id: 'n' }] }),
        graph = Graph([n, r1]);

      graph.rebase([r2], [graph]);

      expect(graph.parentRelations(n)).toEqual([r1, r2]);
      expect(graph._parentRels.hasOwnProperty('n')).toBe(false);
    });

    it('avoids re-adding a modified relation as a parent relation', function() {
      var n = Node({ id: 'n' }),
        r1 = Relation({ id: 'r1', members: [{ id: 'n' }] }),
        r2 = r1.removeMembersWithID('n'),
        graph = Graph([n, r1]),
        graph2 = graph.replace(r2);

      graph.rebase([r1], [graph, graph2]);

      expect(graph2.parentRelations(n)).toEqual([]);
    });

    it('avoids re-adding a deleted relation as a parent relation', function() {
      var n = Node({ id: 'n' }),
        r1 = Relation({ id: 'r1', members: [{ id: 'n' }] }),
        graph = Graph([n, r1]),
        graph2 = graph.remove(r1);

      graph.rebase([r1], [graph, graph2]);

      expect(graph2.parentRelations(n)).toEqual([]);
    });

    it('updates parentRels for nodes with modified parentWays', function() {
      var n = Node({ id: 'n' }),
        r1 = Relation({ id: 'r1', members: [{ id: 'n' }] }),
        r2 = Relation({ id: 'r2', members: [{ id: 'n' }] }),
        r3 = Relation({ id: 'r3', members: [{ id: 'n' }] }),
        graph = Graph([n, r1]),
        graph2 = graph.replace(r2);

      graph.rebase([r3], [graph, graph2]);

      expect(graph2.parentRelations(n)).toEqual([r1, r2, r3]);
    });

    it('invalidates transients', function() {
      var n = Node({ id: 'n' }),
        w1 = Way({ id: 'w1', nodes: ['n'] }),
        w2 = Way({ id: 'w2', nodes: ['n'] }),
        graph = Graph([n, w1]);

      function numParents(entity) {
        return graph.transient(entity, 'numParents', function() {
          return graph.parentWays(entity).length;
        });
      }

      expect(numParents(n)).toBe(1);
      graph.rebase([w2], [graph]);
      expect(numParents(n)).toBe(2);
    });
  });

  describe('#remove', function() {
    it('returns a new graph', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.remove(node)).not.toBe(graph);
    });

    it("doesn't modify the receiver", function() {
      var node = Node(),
        graph = Graph([node]);
      graph.remove(node);
      expect(graph.entity(node.id)).toBe(node);
    });

    it('removes the entity from the result', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.remove(node).hasEntity(node.id)).toBeUndefined();
    });

    it('removes the entity as a parentWay', function() {
      var node = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph([node, w1]);
      expect(graph.remove(w1).parentWays(node)).toEqual([]);
    });

    it('removes the entity as a parentRelation', function() {
      var node = Node({ id: 'n' }),
        r1 = Relation({ id: 'w', members: [{ id: 'n' }] }),
        graph = Graph([node, r1]);
      expect(graph.remove(r1).parentRelations(node)).toEqual([]);
    });
  });

  describe('#replace', function() {
    it('is a no-op if the replacement is identical to the existing entity', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.replace(node)).toBe(graph);
    });

    it('returns a new graph', function() {
      var node = Node(),
        graph = Graph([node]);
      expect(graph.replace(node.update())).not.toBe(graph);
    });

    it("doesn't modify the receiver", function() {
      var node = Node(),
        graph = Graph([node]);
      graph.replace(node);
      expect(graph.entity(node.id)).toBe(node);
    });

    it('replaces the entity in the result', function() {
      var node1 = Node(),
        node2 = node1.update({}),
        graph = Graph([node1]);
      expect(graph.replace(node2).entity(node2.id)).toBe(node2);
    });

    it('adds parentWays', function() {
      var node = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph([node]);
      expect(graph.replace(w1).parentWays(node)).toEqual([w1]);
    });

    it('removes parentWays', function() {
      var node = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph([node, w1]);
      expect(graph.remove(w1).parentWays(node)).toEqual([]);
    });

    it("doesn't add duplicate parentWays", function() {
      var node = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph([node, w1]);
      expect(graph.replace(w1).parentWays(node)).toEqual([w1]);
    });

    it('adds parentRelations', function() {
      var node = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        graph = Graph([node]);
      expect(graph.replace(r1).parentRelations(node)).toEqual([r1]);
    });

    it('removes parentRelations', function() {
      var node = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        graph = Graph([node, r1]);
      expect(graph.remove(r1).parentRelations(node)).toEqual([]);
    });

    it("doesn't add duplicate parentRelations", function() {
      var node = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        graph = Graph([node, r1]);
      expect(graph.replace(r1).parentRelations(node)).toEqual([r1]);
    });
  });

  describe('#revert', function() {
    it('is a no-op if the head entity is identical to the base entity', function() {
      var n1 = Node({ id: 'n' }),
        graph = Graph([n1]);
      expect(graph.revert('n')).toBe(graph);
    });

    it('returns a new graph', function() {
      var n1 = Node({ id: 'n' }),
        n2 = n1.update({}),
        graph = Graph([n1]).replace(n2);
      expect(graph.revert('n')).not.toBe(graph);
    });

    it("doesn't modify the receiver", function() {
      var n1 = Node({ id: 'n' }),
        n2 = n1.update({}),
        graph = Graph([n1]).replace(n2);
      graph.revert('n');
      expect(graph.hasEntity('n')).toBe(n2);
    });

    it('removes a new entity', function() {
      var n1 = Node({ id: 'n' }),
        graph = Graph().replace(n1);

      graph = graph.revert('n');
      expect(graph.hasEntity('n')).toBeUndefined();
    });

    it('reverts an updated entity to the base version', function() {
      var n1 = Node({ id: 'n' }),
        n2 = n1.update({}),
        graph = Graph([n1]).replace(n2);

      graph = graph.revert('n');
      expect(graph.hasEntity('n')).toBe(n1);
    });

    it('restores a deleted entity', function() {
      var n1 = Node({ id: 'n' }),
        graph = Graph([n1]).remove(n1);

      graph = graph.revert('n');
      expect(graph.hasEntity('n')).toBe(n1);
    });

    it('removes new parentWays', function() {
      var n1 = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph().replace(n1).replace(w1);

      graph = graph.revert('w');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentWays(n1)).toEqual([]);
    });

    it('removes new parentRelations', function() {
      var n1 = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        graph = Graph().replace(n1).replace(r1);

      graph = graph.revert('r');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentRelations(n1)).toEqual([]);
    });

    it('reverts updated parentWays', function() {
      var n1 = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        w2 = w1.removeNode('n'),
        graph = Graph([n1, w1]).replace(w2);

      graph = graph.revert('w');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentWays(n1)).toEqual([w1]);
    });

    it('reverts updated parentRelations', function() {
      var n1 = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        r2 = r1.removeMembersWithID('n'),
        graph = Graph([n1, r1]).replace(r2);

      graph = graph.revert('r');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentRelations(n1)).toEqual([r1]);
    });

    it('restores deleted parentWays', function() {
      var n1 = Node({ id: 'n' }),
        w1 = Way({ id: 'w', nodes: ['n'] }),
        graph = Graph([n1, w1]).remove(w1);

      graph = graph.revert('w');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentWays(n1)).toEqual([w1]);
    });

    it('restores deleted parentRelations', function() {
      var n1 = Node({ id: 'n' }),
        r1 = Relation({ id: 'r', members: [{ id: 'n' }] }),
        graph = Graph([n1, r1]).remove(r1);

      graph = graph.revert('r');
      expect(graph.hasEntity('n')).toBe(n1);
      expect(graph.parentRelations(n1)).toEqual([r1]);
    });
  });

  describe('#update', function() {
    it('returns a new graph if self is frozen', function() {
      var graph = Graph();
      expect(graph.update()).not.toBe(graph);
    });

    it('returns self if self is not frozen', function() {
      var graph = Graph([], true);
      expect(graph.update()).toBe(graph);
    });

    it("doesn't modify self is self is frozen", function() {
      var node = Node(),
        graph = Graph([node]);

      graph.update(function(graph) {
        graph.remove(node);
      });

      expect(graph.entity(node.id)).toBe(node);
    });

    it('modifies self is self is not frozen', function() {
      var node = Node(),
        graph = Graph([node], true);

      graph.update(function(graph) {
        graph.remove(node);
      });

      expect(graph.hasEntity(node.id)).toBeUndefined();
    });

    it('executes all of the given functions', function() {
      var a = Node(),
        b = Node(),
        graph = Graph([a]);

      graph = graph.update(
        function(graph) {
          graph.remove(a);
        },
        function(graph) {
          graph.replace(b);
        }
      );

      expect(graph.hasEntity(a.id)).toBeUndefined();
      expect(graph.entity(b.id)).toBe(b);
    });
  });

  describe('#parentWays', function() {
    it('returns an array of ways that contain the given node id', function() {
      var node = Node({ id: 'n1' }),
        way = Way({ id: 'w1', nodes: ['n1'] }),
        graph = Graph([node, way]);
      expect(graph.parentWays(node)).toEqual([way]);
      expect(graph.parentWays(way)).toEqual([]);
    });
  });

  describe('#parentRelations', function() {
    it('returns an array of relations that contain the given entity id', function() {
      var node = Node({ id: 'n1' }),
        nonnode = Node({ id: 'n2' }),
        relation = Relation({
          id: 'r1',
          members: [{ id: 'n1', role: 'from' }]
        }),
        graph = Graph([node, relation]);
      expect(graph.parentRelations(node)).toEqual([relation]);
      expect(graph.parentRelations(nonnode)).toEqual([]);
    });
  });

  describe('#childNodes', function() {
    it('returns an array of child nodes', function() {
      var node = Node({ id: 'n1' }),
        way = Way({ id: 'w1', nodes: ['n1'] }),
        graph = Graph([node, way]);
      expect(graph.childNodes(way)).toEqual([node]);
    });
  });
});
