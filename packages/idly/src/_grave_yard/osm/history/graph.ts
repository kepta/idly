import { Map, Record, Set } from 'immutable';

import { Entities, Entity, EntityId } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';
import { groupBy } from 'ramda';

export class Graph extends Record({
  node: Map(),
  way: Map(),
  relation: Map()
}) {
  // Map entries are for finding a particular
  // entity which could be a heavy computation
  public node: Map<string, Node>;
  public way: Map<string, Way>;
  public relation: Map<string, Relation>;
  public set(k: string, v: Node | Way | Relation): Graph {
    return super.set(k, v) as Graph;
  }
  public getEntity(e: EntityId): Entity {
    if (e[0] === 'n') return super.getIn(['node', e]);
    if (e[0] === 'w') return super.getIn(['way', e]);
    if (e[0] === 'e') return super.getIn(['relation', e]);
    throw new Error(`unknown entity got ${e}`);
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

export function graphFactoryFromSet(entitiesSet: Entities = Set()) {
  const createDeepMap = (set: any = Set()) => {
    const map = Map();
    return map.withMutations(m => {
      set.forEach(a => {
        m.set(a.id, a);
      });
    });
  };
  const { node, way, relation } = entitiesSet.groupBy(e => e.type).toObject();
  // : { node: Node; way: Way; relation: Relation }
  return new Graph({
    node: createDeepMap(node),
    way: createDeepMap(way),
    relation: createDeepMap(relation)
  });
}
