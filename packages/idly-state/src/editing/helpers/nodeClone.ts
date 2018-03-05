import { nodeFactory } from 'idly-common/lib/osm/entityFactory';
import { Node } from 'idly-common/lib/osm/structures';

export function nodeClone(node: Node): Node {
  return nodeFactory({
    attributes: { ...node.attributes },
    id: node.id,
    loc: { ...node.loc },
    tags: { ...node.tags },
  });
}
