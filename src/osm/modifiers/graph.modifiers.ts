import { List, Map } from 'immutable';
import { groupBy } from 'ramda';

import { Graph } from 'osm/history/graph';
import { graphFactory } from 'osm/history/graph';

import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

type EntitiesMap = Map<string, Node | Way | Relation>;
type Entity = Node | Way | Relation;

export function graphSetEntity(graph: Graph, entity: Entity): Graph {
  return graph.setIn([entity.type, entity.id], entity) as Graph;
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

export function graphRemoveEntity(graph: Graph, entity: Entity): Graph {
  return graph.removeIn([entity.type, entity.id]) as Graph;
}

function _updateParentWays(graph: Graph): Graph {
  const parentWays = Map();
  parentWays.withMutations(map => {
    graph.way.forEach(e => {
      if (e instanceof Way) {
        e.nodes.forEach(n => {
          map.setIn([n], e.id);
        });
      }
    });
  });
  return graph.set('_parentWays', parentWays);
}
