export type Entity = Node | Way | Relation;
export type Entities = Set<Node | Way | Relation>;
export type EntityId = string;
export type NodeId = string;
export type WayId = string;

export type ParentWays = Map<NodeId, Set<WayId>>;
// Table used to map id -> entity
export type EntityTable = Map<EntityId, Entity>;

export type Tags = Map<string, string>;

export type FeaturePropsTable = Map<EntityId, FeatureProps>;
export type FeatureProps = { [key: string]: string };

export type NodeGeometry =
  | OsmGeometry.POINT
  | OsmGeometry.VERTEX
  | OsmGeometry.VERTEX_SHARED;

export enum OsmGeometry {
  POINT = 'point',
  VERTEX = 'vertex',
  VERTEX_SHARED = 'vertex_shared', // the one shared among multiple ways
  AREA = 'area',
  LINE = 'line',
  RELATION = 'relation'
}

export enum EntityType {
  NODE = 'node',
  WAY = 'way',
  RELATION = 'relation'
}

export type Node = Readonly<{
  readonly id: EntityId;
  readonly tags: Tags;
  readonly type: EntityType.NODE;
  readonly loc: LngLat;
  readonly attributes: Attributes;
}>;

export type Way = Readonly<{
  readonly id: EntityId;
  readonly type: EntityType.WAY;
  readonly tags: Tags;
  readonly attributes: Attributes;
  readonly nodes: ReadonlyArray<EntityId>;
}>;

export type Relation = Readonly<{
  readonly id: EntityId;
  readonly type: EntityType.RELATION;
  readonly tags: Tags;
  readonly members: ReadonlyArray<RelationMember>;
  readonly attributes: Attributes;
}>;

export type Attributes = Readonly<{
  readonly visible?: boolean;
  readonly version?: number;
  readonly timestamp?: string;
  readonly changeset?: string;
  readonly uid?: string;
  readonly user?: string;
}>;

export type RelationMember = Readonly<{
  readonly id: string;
  readonly type: string;
  readonly role: string;
}>;

export type LngLat = Readonly<{
  readonly lat: number;
  readonly lon: number;
}>;
