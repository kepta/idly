import { ImMap, ImSet } from '../misc/immutable';
import { Tags } from './Tags';
import { tagsFactory } from './tagsFactory';

export type Entity = Node | Way | Relation;
export type Entities = Set<Node | Way | Relation>;
export type EntityId = string;
export type NodeId = string;
export type WayId = string;

export type ParentWays = ImMap<NodeId, ImSet<WayId> | undefined>;
// Table used to map id -> entity
export type EntityTable = ImMap<EntityId, Entity | undefined>;

export interface Tags {
  [key: string]: string;
}

export type FeaturePropsTable = Map<EntityId, FeatureProps>;
export interface FeatureProps {
  [key: string]: string;
}

export type NodeGeometry = OsmGeometry.POINT | OsmGeometry.VERTEX;

export enum OsmGeometry {
  POINT = 'point',
  VERTEX = 'vertex',
  // VERTEX_SHARED = 'vertex_shared', // the one shared among multiple ways
  AREA = 'area',
  LINE = 'line',
  RELATION = 'relation'
}

export enum EntityType {
  NODE = 'node',
  WAY = 'way',
  RELATION = 'relation'
}

export interface Node {
  readonly id: EntityId;
  readonly tags: Tags;
  readonly type: EntityType.NODE;
  readonly loc: LngLat;
  readonly attributes: Attributes;
}

export interface Way {
  readonly id: EntityId;
  readonly type: EntityType.WAY;
  readonly tags: Tags;
  readonly attributes: Attributes;
  readonly nodes: ReadonlyArray<EntityId>;
}

export interface Relation {
  readonly id: EntityId;
  readonly type: EntityType.RELATION;
  readonly tags: Tags;
  readonly members: ReadonlyArray<RelationMember>;
  readonly attributes: Attributes;
}

export interface Attributes {
  readonly visible?: boolean;
  readonly version?: string;
  readonly timestamp?: string;
  readonly changeset?: string;
  readonly uid?: string;
  readonly user?: string;
}

export interface RelationMember {
  readonly id?: string;
  readonly type?: string;
  readonly role?: string;
}

export interface LngLat {
  readonly lat: number;
  readonly lon: number;
}
