import { Way } from '../../../osm/structures';

export function wayIsClosed({ nodes }: Way) {
  return nodes.length > 1 && nodes[0] === nodes[nodes.length - 1];
}
