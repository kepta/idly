import { Node, Way } from 'idly-common/lib/osm/structures';
import { wayUpdate } from './wayUpdate';

export function wayUpdateNodeId(
  prevNode: Node,
  newNode: Node,
  prevWay: Way,
  newWayId: string
): Way {
  return wayUpdate(
    {
      id: newWayId,
      nodes: prevWay.nodes.map(n => (n === prevNode.id ? newNode.id : n)),
    },
    prevWay
  );
}
