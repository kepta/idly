import { Either } from 'monet';
import { nodeFactory } from '../../osm/entityFactory/nodeFactory';
import { relationFactory } from '../../osm/entityFactory/relationFactory';
import { wayFactory } from '../../osm/entityFactory/wayFactory';
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
} from '../../osm/structures';
import { Err, ErrorWhen } from '../helper';
import {
  checkValidNode,
  checkValidRelation,
  checkValidWay,
} from '../validation';

export interface WayLike {
  readonly id: EntityId;
  readonly type?: 'way';
  readonly tags?: Tags;
  readonly attributes?: Attributes;
  readonly nodes?: EntityId[] | ReadonlyArray<EntityId>;
}
export interface RelLike {
  readonly id: EntityId;
  readonly type?: 'relation';
  readonly tags?: Tags;
  readonly members?: RelationMember[] | ReadonlyArray<RelationMember>;
  readonly attributes?: Attributes;
}

export interface NodeLike {
  readonly id: EntityId;
  readonly type?: 'node';
  readonly tags?: Tags;
  readonly loc?: LngLat;
  readonly attributes?: Attributes;
}
export type EntityLike = NodeLike | WayLike | RelLike;

export const parseIfString = (r: EntityLike | string) =>
  typeof r === 'string' ? (JSON.parse(r) as EntityLike) : r;

export function createEntity(
  entityLike: EntityLike | string,
  type?: EntityType
): Entity {
  return Err.right(entityLike)
    .map(parseIfString)
    .flatMap(
      ErrorWhen(
        r => !!type && type !== r.type,
        new Error('Entity must be ' + type)
      )
    )
    .flatMap(
      ErrorWhen(r => !r.id, new Error('Entity does not have a valid id'))
    )
    .flatMap(entityFrom)
    .cata(err => {
      throw err;
    }, r => r);
}

function entityFrom(entity: any): Either<Error, Entity> {
  switch (entity.type) {
    case EntityType.NODE: {
      return checkValidNode(entity)
        ? Err.right(nodeFactory(entity))
        : Err.left(new Error('Invalid node'));
    }

    case EntityType.WAY: {
      return checkValidWay(entity)
        ? Err.right(wayFactory(entity))
        : Err.left(new Error('Invalid Way'));
    }

    case EntityType.RELATION: {
      return checkValidRelation(entity)
        ? Err.right(relationFactory(entity))
        : Err.left(new Error('Invalid Relation'));
    }
    default:
      return Err.left(new Error('Entity type is unknown'));
  }
}

export const createNode = (entityLike: NodeLike): Node =>
  createEntity({ ...entityLike }, EntityType.NODE) as Node;

export const createWay = (entityLike: WayLike): Way =>
  createEntity({ ...entityLike }, EntityType.WAY) as Way;

export const createRelation = (entityLike: RelLike): Relation =>
  createEntity({ ...entityLike }, EntityType.RELATION) as Relation;
