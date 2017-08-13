import { Map } from 'immutable';

import { Graph } from 'osm/history/graph';
import { graphFactory, graphFactoryFromSet } from 'osm/history/graph';

import { Entities, EntitiesId } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

type EntitiesMap = Map<string, Node | Way | Relation>;
type Entity = Node | Way | Relation;

export function graphSetEntity(graph: Graph, entity: Entity): Graph {
  return graph.setIn([entity.type, entity.id], entity) as Graph;
}

export function graphSetEntitiesSet(graph: Graph, entities: Entities): Graph {
  const patchGraph = graphFactoryFromSet(entities);
  const mergedGraph = graph.mergeWith(
    (oldV, newV) => oldV.merge(newV),
    patchGraph
  ) as Graph;
  return mergedGraph;
}

export function graphSetEntities(graph: Graph, entities: Entity[]): Graph {
  const patchGraph = graphFactory(entities);
  const mergedGraph = graph.mergeWith(
    (oldV, newV) => oldV.merge(newV),
    patchGraph
  ) as Graph;
  return mergedGraph;
}

export function graphRemoveEntities(graph: Graph, entities: Entity[]): Graph {
  return graph.withMutations(g => {
    entities.forEach(e => {
      g.removeIn([e.type, e.id]);
    });
  }) as Graph;
}

export function graphRemoveEntitiesWithId(
  graph: Graph,
  entities: EntitiesId
): Graph {
  return graph.withMutations(g => {
    entities.forEach(e => {
      if (e[0] === 'n') g.removeIn(['node', e]);
      else if (e[0] === 'w') g.removeIn(['way', e]);
      else g.removeIn(['relation', e]);
    });
  }) as Graph;
}

export function graphRemoveEntity(graph: Graph, entity: Entity): Graph {
  return graph.removeIn([entity.type, entity.id]) as Graph;
}

export function calculateParentWays(graph: Graph): any {
  let parentWays = Map();
  parentWays = parentWays.withMutations(map => {
    graph.way.forEach(e => {
      e.nodes.forEach(n => {
        map.set(n, e.id);
      });
    });
  });
  return parentWays;
}
