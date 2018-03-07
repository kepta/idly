import { nodeFactory } from 'idly-common/lib/osm/entityFactory';
import { Node } from 'idly-common/lib/osm/structures';
import { nodeClone } from './nodeClone';

export function nodeUpdate(
  obj: Partial<Node> & { id: string },
  unsafeNode: Node
): Node {
  const node = nodeClone(unsafeNode);
  return nodeFactory(Object.assign({}, node, obj));
}
