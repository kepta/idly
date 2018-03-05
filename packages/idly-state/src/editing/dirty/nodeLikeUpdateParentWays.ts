import { NodeLike, WayLike } from './entityLike';
import { wayLikeUpdate } from './entityLikeUpdate';
import { wayLikeUpdateNodeId } from './wayLikeUpdateNodeId';

export function nodeUpdateParentWays(
  prevNode: NodeLike,
  newNode: NodeLike,
  parentWays: ReadonlyArray<WayLike>
): WayLike[] {
  return parentWays.map(w => wayLikeUpdateNodeId(prevNode, newNode, w));
}
