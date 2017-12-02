import {
  Attributes,
  EntityId,
  EntityType,
  LngLat,
  Node,
  Relation,
  RelationMember,
  Tags,
  Way,
} from '../../../osm/structures';
import { entityFromString } from '../../../osm/entityFromString';
import { entityToString } from '../../../osm/entityToString';

export interface NodeLike {
  readonly id: EntityId;
  readonly type?: 'node';
  readonly tags?: Tags;
  readonly loc?: LngLat;
  readonly attributes?: Attributes;
}
export interface WayLike {
  readonly id: EntityId;
  readonly type?: 'way';
  readonly tags?: Tags;
  readonly attributes?: Attributes;
  readonly nodes?: EntityId[];
}
export interface RelLike {
  readonly id: EntityId;
  readonly type?: 'relation';
  readonly tags?: Tags;
  readonly members?: RelationMember[];
  readonly attributes?: Attributes;
}

export function createEntity(
  entityLike: NodeLike | WayLike | RelLike | string,
) {
  if (typeof entityLike === 'string') {
    entityLike = JSON.parse(entityLike) as NodeLike | WayLike | RelLike;
  }

  if (!entityLike.id || !entityLike.type) {
    throw new Error('not a valid entity');
  }

  return entityFromString(entityToString(entityLike));
}

export function createNode(entityLike: NodeLike): Node {
  return createEntity({ ...entityLike, type: 'node' }) as Node;
}

export function createWay(entityLike: WayLike): Way {
  return createEntity({ ...entityLike, type: 'way' }) as Way;
}

export function createRelation(entityLike: RelLike): Relation {
  return createEntity({ ...entityLike, type: 'relation' }) as Relation;
}