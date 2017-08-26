import {
  Attributes,
  EntityId,
  LngLat,
  NodeId,
  RelationMember,
  WayId,
  EntityType,
  Node
} from './osm/structures';
import { Set as $Set, Map as $Map, List as $List } from 'immutable';
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';

export type $Entity = $Node | $Way | $Relation;
export type $Entities = $Set<$Node | $Way | $Relation>;

export type $ParentWays = $Map<NodeId, $Set<WayId>>;

// Table used to map id -> entity
export type $EntityTable = $Map<EntityId, $Entity>;

export type $Tags = $Map<string, string>;

export type $FeaturePropsTable = $Map<EntityId, $FeatureProps>;
export type $FeatureProps = $Map<string, string>;

export interface $__Node {
  readonly id: EntityId;
  readonly type: EntityType.NODE;
  readonly loc: $LngLat;
  readonly tags: $Tags;
  readonly attributes: $Attributes;
}

export interface $Node extends TypedRecord<$Node>, $__Node {}

export interface $__Way {
  readonly id: EntityId;
  readonly type: EntityType.WAY;
  readonly tags: $Tags;
  readonly attributes: $Attributes;
  readonly nodes: $List<EntityId>;
}

export interface $Way extends TypedRecord<$Way>, $__Way {}

export interface $__Relation {
  readonly id: EntityId;
  readonly type: EntityType.RELATION;
  readonly tags: $Tags;
  readonly members: $List<$RelationMember>;
  readonly attributes: $Attributes;
}

export interface $Relation extends TypedRecord<$Relation>, $__Relation {}

export interface $Attributes extends TypedRecord<$Attributes>, Attributes {}

export interface $RelationMember
  extends TypedRecord<$RelationMember>,
    RelationMember {}

export interface $LngLat extends TypedRecord<$LngLat>, LngLat {}
