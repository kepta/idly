import { List, Map, Set } from 'immutable';

import { Node, nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';
import {
  graphRemoveEntities,
  graphRemoveEntity,
  graphSetEntities,
  graphSetEntity
} from 'osm/history/helpers';

describe('Graph Factory', function() {
  // it('returns a new graph if self is frozen', function () {
  //     var graph = graphFactory();
  //     expect(graph.update()).not.toBe(graph);
  // });
  //   var graph = graphFactory({

  //   });
  const node = nodeFactory({ id: 'n1' });
  const way = wayFactory({ id: 'w-1', tags: Map({ foo: 'bar' }) });
  const relation = relationFactory({ id: 'r1' });
  it('returns self if empty', function() {
    const graph = graphFactory([node, way]);
    expect(graph).toMatchSnapshot();
    expect(graph.node).toEqual(Map({ n1: node }));
    expect(graph.way).toEqual(Map({ 'w-1': way }));
  });

  it('ignore multiple same copies', function() {
    const graph = graphFactory([node, way, node]);
    expect(graph.node.size).toEqual(1);
    expect(graph.way.size).toEqual(1);
  });
  it('ignore multiple same id', function() {
    const n2 = nodeFactory({ id: 'n1', tags: Map({ foo: 'foo' }) });
    const graph = graphFactory([node, way, n2]);
    expect(graph.node.size).toEqual(1);
    expect(graph.way.size).toEqual(1);
  });
  it('adds multiple nodes', function() {
    const n2 = nodeFactory({ id: 'n2', tags: Map({ foo: 'foo' }) });
    const graph = graphFactory([node, way, n2]);
    expect(graph.node.size).toEqual(2);
    expect(graph.way.size).toEqual(1);
  });
  it('adds multiple relations', function() {
    const r1 = relationFactory({ id: 'r1', tags: Map({ foo: 'foo' }) });
    const r2 = relationFactory({ id: 'r2', tags: Map({ foo: 'foo' }) });

    const graph = graphFactory([node, r2, way, r1]);
    expect(graph.node.size).toEqual(1);
    expect(graph.way.size).toEqual(1);
    expect(graph.relation.size).toEqual(2);
  });

  it('adds multiple relations', function() {
    const r1 = relationFactory({ id: 'r1', tags: Map({ foo: 'foo' }) });
    const r2 = relationFactory({ id: 'r2', tags: Map({ foo: 'foo' }) });

    const graph = graphFactory([relation, node, r2, way, r1]);
    expect(graph).toMatchSnapshot();
  });
});

// describe.skip('#remove', function() {
//   const node = nodeFactory({ id: 'n1' });
//   const graph = graphFactory({
//     entities: Map({ n1: nodeFactory({ id: 'n1' }) })
//   });

//   it('returns a new graph', function() {
//     var node2 = nodeFactory({ id: 'n2' });
//     var graph1 = graphSetEntity(graph, node2);
//     expect(graphRemoveEntity(graph1, node2)).toEqual(graph);
//   });

//   it("doesn't modify the receiver", function() {
//     expect(graph.entities.get(node.id)).toEqual(node);
//   });

//   it('removes non existing entity', function() {
//     var node2 = nodeFactory({ id: 'n2' });
//     expect(
//       graphRemoveEntity(graph, node2).entities.get(node2.id)
//     ).toBeUndefined();
//   });

//   it('removes the entity as a parentWay', function() {
//     // var node = new Node({ id: "n" }),
//     var node2 = nodeFactory({ id: 'n2' });
//     var w1 = wayFactory({ id: 'w', nodes: List(['n']) });
//     var graph2 = graphSetEntities(graphFactory({}), List([node2, w1]));

//     expect(graph.remove(w1).parentWays(node)).toEqual([]);
//   });

//   it('removes the entity as a parentRelation', function() {
//     var node = new Node({ id: 'n' }),
//       r1 = Relation({ id: 'w', members: [{ id: 'n' }] }),
//       graph = graphFactory([node, r1]);
//     expect(graph.remove(r1).parentRelations(node)).toEqual([]);
//   });
// });
