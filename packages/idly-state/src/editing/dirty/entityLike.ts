import { nodeFactory } from 'idly-common/lib/osm/entityFactory';
import {
  Attributes,
  EntityId,
  EntityType,
  LngLat,
  Relation,
  RelationMember,
  Tags,
  Way,
} from 'idly-common/lib/osm/structures';
import { Node } from 'idly-common/lib/osm/structures';

export interface WayLike {
  id: EntityId;
  type: EntityType.WAY;
  tags: Tags;
  attributes: Attributes;
  nodes: EntityId[];
  dirty: true;
}
export interface RelationLike {
  id: EntityId;
  type: EntityType.RELATION;
  tags: Tags;
  members: RelationMember[];
  attributes: Attributes;
  dirty: true;
}

export interface NodeLike {
  id: EntityId;
  type: EntityType.NODE;
  tags: Tags;
  loc: LngLat;
  attributes: Attributes;
  dirty: true;
}

export type EntityLike = NodeLike | WayLike | RelationLike;

export function nodeLike(node: Node): NodeLike {
  return {
    attributes: { ...node.attributes },
    dirty: true,
    id: node.id,
    loc: { ...node.loc },
    tags: { ...node.tags },
    type: EntityType.NODE,
  };
}

export function relationLike(relation: Relation): RelationLike {
  return {
    attributes: { ...relation.attributes },
    dirty: true,
    id: relation.id,
    members: relation.members.slice(),
    tags: { ...relation.tags },
    type: EntityType.RELATION,
  };
}

export function wayLike(way: Way): WayLike {
  return {
    attributes: { ...way.attributes },
    dirty: true,
    id: way.id,
    nodes: way.nodes.slice(),
    tags: { ...way.tags },
    type: EntityType.WAY,
  };
}
