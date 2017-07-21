import { List, Map, Record } from 'immutable';

import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { Properties, propertiesGen } from 'osm/others/properties';
import { ITags, tagsFactory } from 'osm/others/tags';
import { groupBy } from 'ramda';

export class Graph extends Record({
  node: Map(),
  way: Map(),
  relation: Map()
}) {
  public node: Map<string, Node>;
  public way: Map<string, Way>;
  public relation: Map<string, Relation>;
  public set(k: string, v: any): Graph {
    return super.set(k, v) as Graph;
  }
}
type EntityType = Node | Way | Relation;

export function graphFactory(entitiesList: EntityType[] = []) {
  const createMapFromArray = (array = []) => {
    const map = Map();
    return map.withMutations(m => {
      array.forEach(a => {
        m.set(a.id, a);
      });
    });
  };
  const { node, way, relation } = groupBy(e => e.type, entitiesList);
  return new Graph({
    node: createMapFromArray(node),
    way: createMapFromArray(way),
    relation: createMapFromArray(relation)
  });
}
