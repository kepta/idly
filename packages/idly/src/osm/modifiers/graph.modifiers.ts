import { Graph } from 'src/osm/history/graph';
import { graphFactory } from 'src/osm/history/graph';

import { List, Map } from 'immutable';
import { Node } from 'src/osm/entities/node';
import { Way } from 'src/osm/entities/way';
import { Relation } from 'src/osm/entities/relation';
import { groupBy } from 'ramda';
// type EntitiesList = List<Node | Way | Relation>;
type EntitiesMap = Map<string, Node | Way | Relation>;
type Entity = Node | Way | Relation;

export function graphSetEntity(graph: Graph, entity: Entity): Graph {
  return <Graph>graph.setIn([entity.type, entity.id], entity);
}

export function graphSetEntities(graph: Graph, entities: Entity[]): Graph {
  const patchGraph = graphFactory(entities);
  const mergedGraph = <Graph>graph.mergeWith(
    (oldV, newV) => oldV.merge(newV),
    patchGraph
  );
  return mergedGraph;
}

export function graphRemoveEntities(graph: Graph, entities: Entity[]): Graph {
  return <Graph>graph.withMutations(g => {
    entities.forEach(e => {
      g.removeIn([e.type, e.id]);
    });
  });
}

export function graphRemoveEntity(graph: Graph, entity: Entity): Graph {
  return <Graph>graph.removeIn([entity.type, entity.id]);
}

function _updateParentWays(graph: Graph): Graph {
  var parentWays = Map();
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
