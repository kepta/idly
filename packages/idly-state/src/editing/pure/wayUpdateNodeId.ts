import { Node, Way } from 'idly-common/lib/osm/structures';
import { baseId } from '../../dataStructures/log';
import { wayUpdate } from './wayUpdate';

export function wayUpdateNodeId(
  prevNode: Node,
  newNode: Node,
  prevWay: Way,
  newWayId: string
): Way {
  const prevId = baseId(prevNode.id);
  return wayUpdate(
    {
      id: newWayId,
      nodes: prevWay.nodes.map(n => (baseId(n) === prevId ? newNode.id : n)),
    },
    prevWay
  );
}
