import { List, Map } from 'immutable';
import { wayFactory, Way } from 'src/osm/entities/way';
import { relationFactory } from 'src/osm/entities/relation';
import { nodeFactory, Node } from 'src/osm/entities/node';
import { graphFactory, Graph } from 'src/osm/history/graph';

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
