import { NodeLike, WayLike } from './entityLike';
import { wayLikeUpdate } from './entityLikeUpdate';

export function wayLikeUpdateNodeId(
  prevNode: NodeLike,
  newNode: NodeLike,
  way: WayLike
): WayLike {
  const index = way.nodes.indexOf(prevNode.id);

  if (index > -1) {
    way.nodes.splice(index, 1, newNode.id);
    return way;
  }

  throw new Error('Couldnt find node id' + prevNode.id + ' in way' + way.id);
}
