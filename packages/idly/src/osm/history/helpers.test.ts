import { List, Map } from 'immutable';

import { nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { wayFactory } from 'osm/entities/way';
import { graphFactory } from 'osm/history/graph';
import {
  graphRemoveEntities,
  graphRemoveEntity,
  graphSetEntities,
  graphSetEntity
} from 'osm/history/helpers';

describe('#set', function() {
  const node = nodeFactory({ id: 'n1' });
  const way = wayFactory({ id: 'w-1', tags: Map({ foo: 'bar' }) });
  const relation = relationFactory({ id: 'r1' });
  const graph = graphFactory([node, way, relation]);

  it('returns self if empty', function() {
    expect(graphSetEntities(graph, [])).toBe(graph);
  });
  it('sets up a node', () => {
    const n = nodeFactory({ id: 'n2' });
    expect(
      graphSetEntity(graph, n).equals(graphFactory([n, node, way, relation]))
    ).toEqual(true);
  });

  it('overwrite the node', () => {
    const n2 = nodeFactory({ id: 'n2' });
    const n2Mod = nodeFactory({ id: 'n2', tags: Map({ foo: 'bar' }) });
    const graphMod = graphSetEntity(graphSetEntity(graph, n2), n2Mod);
    expect(graphMod.node.get('n2')).toBe(n2Mod);
  });
  it('overwrite the relations', () => {
    const r2 = relationFactory({ id: 'r2', tags: Map({ foo: 'bar' }) });
    const r2Mod = relationFactory({ id: 'r2' });
    const graphMod = graphSetEntity(graphSetEntity(graph, r2), r2Mod);
    expect(graphMod.relation.get('r2')).toBe(r2Mod);
  });

  it('sets up multiple entities', () => {
    const n = nodeFactory({ id: 'n2' });
    expect(graphSetEntities(graph, [node, way, n, relation])).toEqual(
      graphFactory([node, way, relation, n])
    );
  });

  it('overwrite prev way with empty tags', () => {
    const n = nodeFactory({ id: 'n1', tags: Map({ foo: 'foo' }) });
    const wayWithoutTags = wayFactory({ id: 'w-1' });
    expect(graphSetEntities(graph, [wayWithoutTags, n, relation])).toEqual(
      graphFactory([node, wayWithoutTags, relation, n])
    );
  });
});

describe('#remove', function() {
  const node = nodeFactory({ id: 'n1' });
  const graph = graphFactory([node]);

  it('removes node', function() {
    const node2 = nodeFactory({ id: 'n2' });
    const graph1 = graphSetEntity(graph, node2);
    expect(graphRemoveEntity(graph1, node2)).toEqual(graph);
  });

  it('removes only node ', function() {
    expect(graphRemoveEntity(graph, node)).toEqual(graphFactory());
  });

  it('removes non existing entity', function() {
    const node2 = nodeFactory({ id: 'n2' });
    expect(graphRemoveEntity(graph, node2).node.get(node2.id)).toBeUndefined();
  });

  it('removes multiple', function() {
    const n1 = nodeFactory({ id: 'n' });
    const r1 = relationFactory({ id: 'w', members: List(['n']) });
    const g = graphFactory([n1, r1]);
    expect(graphRemoveEntities(g, [n1, r1])).toEqual(graphFactory());
  });
  it('removes multiple', function() {
    const n1 = nodeFactory({ id: 'n' });
    const r1 = relationFactory({ id: 'w', members: List(['n']) });
    const g = graphFactory([node, n1, r1]);
    expect(graphRemoveEntities(g, [node, r1])).toEqual(graphFactory([n1]));
  });
});
