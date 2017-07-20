import { List, Map } from 'immutable';
import { wayFactory } from 'src/osm/entities/way';
import { relationFactory } from 'src/osm/entities/relation';
import { nodeFactory, Node } from 'src/osm/entities/node';
import { graphFactory } from 'src/osm/history/graph';
import {
  graphRemoveEntity,
  graphRemoveEntities,
  graphSetEntities,
  graphSetEntity
} from 'src/osm/modifiers/graph.modifiers';

describe('#set', function() {
  // it('returns a new graph if self is frozen', function () {
  //     var graph = graphFactory();
  //     expect(graph.update()).not.toBe(graph);
  // });
  var node = nodeFactory({ id: 'n1' });
  var way = wayFactory({ id: 'w-1', tags: Map({ foo: 'bar' }) });
  var relation = relationFactory({ id: 'r1' });
  var graph = graphFactory([node, way, relation]);

  it('returns self if empty', function() {
    // var graph = graphFactory();

    expect(graphSetEntities(graph, [])).toBe(graph);
  });
  it('sets up a node', () => {
    var n = nodeFactory({ id: 'n2' });
    expect(
      graphSetEntity(graph, n).equals(graphFactory([n, node, way, relation]))
    ).toEqual(true);
  });

  it('overwrite the node', () => {
    var n2 = nodeFactory({ id: 'n2' });
    var n2Mod = nodeFactory({ id: 'n2', tags: Map({ foo: 'bar' }) });
    var graphMod = graphSetEntity(graphSetEntity(graph, n2), n2Mod);
    expect(graphMod.node.get('n2')).toBe(n2Mod);
  });
  it('overwrite the relations', () => {
    var r2 = relationFactory({ id: 'r2', tags: Map({ foo: 'bar' }) });
    var r2Mod = relationFactory({ id: 'r2' });
    var graphMod = graphSetEntity(graphSetEntity(graph, r2), r2Mod);
    expect(graphMod.relation.get('r2')).toBe(r2Mod);
  });

  it('sets up multiple entities', () => {
    var n = nodeFactory({ id: 'n2' });
    expect(graphSetEntities(graph, [node, way, n, relation])).toEqual(
      graphFactory([node, way, relation, n])
    );
  });

  it('overwrite multiple entities', () => {
    var n = nodeFactory({ id: 'n1', tags: Map({ foo: 'foo' }) });
    var w = wayFactory({ id: 'w-1' });
    expect(graphSetEntities(graph, [w, n, relation])).toEqual(
      graphFactory([node, w, relation, n])
    );
  });
});

describe('#remove', function() {
  const node = nodeFactory({ id: 'n1' });
  const graph = graphFactory([node]);

  it('removes node', function() {
    var node2 = nodeFactory({ id: 'n2' });
    var graph1 = graphSetEntity(graph, node2);
    expect(graphRemoveEntity(graph1, node2)).toEqual(graph);
  });

  it('removes only node ', function() {
    expect(graphRemoveEntity(graph, node)).toEqual(graphFactory());
  });

  it('removes non existing entity', function() {
    var node2 = nodeFactory({ id: 'n2' });
    expect(graphRemoveEntity(graph, node2).node.get(node2.id)).toBeUndefined();
  });

  it('removes multiple', function() {
    var n1 = nodeFactory({ id: 'n' });
    var r1 = relationFactory({ id: 'w', members: List([Map({ id: 'n' })]) });
    var g = graphFactory([n1, r1]);
    expect(graphRemoveEntities(g, [n1, r1])).toEqual(graphFactory());
  });
  it('removes multiple', function() {
    var n1 = nodeFactory({ id: 'n' });
    var r1 = relationFactory({ id: 'w', members: List([Map({ id: 'n' })]) });
    var g = graphFactory([node, n1, r1]);
    expect(graphRemoveEntities(g, [node, r1])).toEqual(graphFactory([n1]));
  });
});
