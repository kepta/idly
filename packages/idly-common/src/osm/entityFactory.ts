import { entityFromString } from './entityFromString';
import { nodeFactory } from './nodeFactory';
import { relationFactory } from './relationFactory';
import {
  Attributes,
  Entity,
  EntityId,
  EntityType,
  LngLat,
  Node,
  Relation,
  RelationMember,
  Tags,
  Way,
} from './structures';
import { wayFactory } from './wayFactory';

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

export function createEntity(entityLike: NodeLike | WayLike | RelLike) {
  if (!entityLike.id || !entityLike.type) {
    throw new Error('not a valid entity');
  }

  // get a stable object
  let entity;
  switch (entityLike.type) {
    case EntityType.NODE: {
      entity = nodeFactory(entityLike, false);
      break;
    }
    case EntityType.WAY: {
      entity = wayFactory(entityLike, false);
      break;
    }
    case EntityType.RELATION: {
      entity = relationFactory(entityLike, false);
      break;
    }
  }

  return entityFromString(JSON.stringify(entity));
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
