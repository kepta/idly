import { Record, Map, List } from 'immutable';
import { ITags, tagsFactory } from 'src/osm/others/tags';
import { Node } from 'src/osm/entities/node';
import { Way } from 'src/osm/entities/way';
import { Relation } from 'src/osm/entities/relation';
import { groupBy } from 'ramda';
import { Properties, propertiesGen } from 'src/osm/others/properties';

var graphBaseRecord = Record({
  node: Map(),
  way: Map(),
  relation: Map()
});

export class Graph extends graphBaseRecord {
  node: Map<string, Node>;
  way: Map<string, Way>;
  relation: Map<string, Relation>;
  set(k: string, v: any): Graph {
    return <Graph>super.set(k, v);
  }
}
type EntityType = Node | Way | Relation;

export function graphFactory(entitiesList: EntityType[] = []) {
  const createMapFromArray = (array = []) => {
    var map = Map();
    return map.withMutations(m => {
      array.forEach(a => {
        m.set(a.id, a);
      });
    });
  };
  var { node, way, relation } = groupBy(e => e.type, entitiesList);
  return new Graph({
    node: createMapFromArray(node),
    way: createMapFromArray(way),
    relation: createMapFromArray(relation)
  });
}
