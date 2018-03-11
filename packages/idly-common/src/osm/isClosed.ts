import { Way } from '../osm/structures';

export function isClosed({ nodes }: Way): boolean {
  return nodes.length > 1 && nodes[0] === nodes[nodes.length - 1];
}
