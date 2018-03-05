import { NodeLike, RelationLike, WayLike } from './entityLike';

export function nodeLikeUpdate(
  obj: Partial<NodeLike> & { id: string },
  node: NodeLike
): NodeLike {
  return Object.assign(node, obj);
}

export function relationLikeUpdate(
  obj: Partial<RelationLike> & { id: string },
  relation: RelationLike
): RelationLike {
  return Object.assign(relation, obj);
}

export function wayLikeUpdate(
  obj: Partial<WayLike> & { id: string },
  way: WayLike
): WayLike {
  return Object.assign(way, obj);
}
