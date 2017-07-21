import { List, Map } from 'immutable';

import { Node, nodeFactory } from 'osm/entities/node';
import { relationFactory } from 'osm/entities/relation';
import { Way, wayFactory } from 'osm/entities/way';
import { Graph, graphFactory } from 'osm/history/graph';

type ParentWays = Map<string, List<string>>;
export function parentWaysSelector(graph: Graph) {
  //   var parentWays = Map();
  //   parentWays.withMutations(map => {
  //     graph.way.forEach(e => {
  //       if (e instanceof Way) {
  //         e.nodes.forEach(n => {
  //           map.setIn([n], e.id);
  //         });
  //       }
  //     });
  //   });
  //   return parentWays;
}
