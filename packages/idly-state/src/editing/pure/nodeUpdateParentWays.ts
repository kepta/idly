import { Node, Way } from 'idly-common/lib/osm/structures';
import { wayUpdateNodeId } from './wayUpdateNodeId';

export function nodeUpdateParentWays(
  prevNode: Node,
  newNode: Node,
  parentWays: ReadonlyArray<Way>,
  newWayIdGen: (w: Way) => string
): Way[] {
  return parentWays.map(w =>
    wayUpdateNodeId(prevNode, newNode, w, newWayIdGen(w))
  );
}
