import {
  Attributes,
  EntityId,
  EntityType,
  LngLat,
  RelationMember,
  Tags,
} from 'idly-common/lib/osm/structures';

export interface WayLike {
  readonly id: EntityId;
  readonly type?: EntityType.WAY;
  readonly tags?: Tags;
  readonly attributes?: Attributes;
  readonly nodes?: EntityId[] | ReadonlyArray<EntityId>;
}
export interface RelLike {
  readonly id: EntityId;
  readonly type?: EntityType.RELATION;
  readonly tags?: Tags;
  readonly members?: RelationMember[] | ReadonlyArray<RelationMember>;
  readonly attributes?: Attributes;
}

export interface NodeLike {
  readonly id: EntityId;
  readonly type?: EntityType.NODE;
  readonly tags?: Tags;
  readonly loc?: LngLat;
  readonly attributes?: Attributes;
}
export type EntityLike = NodeLike | WayLike | RelLike;
