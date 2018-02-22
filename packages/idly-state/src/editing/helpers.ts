import { LngLat, Tags } from 'idly-common/lib/osm/structures';
import { EntityLike, NodeLike } from './entityLike';

export type NodeMoveType = (loc: LngLat, entity: NodeLike) => NodeLike;

export const nodeMove: NodeMoveType = (loc, entity) => ({
  ...entity,
  loc,
});

export type TagsModifyType = (tags: Tags, entity: EntityLike) => EntityLike;

export const tagsModify: TagsModifyType = (tags, entity) => ({
  ...entity,
  tags,
});
