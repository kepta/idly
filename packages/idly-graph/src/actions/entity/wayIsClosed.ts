import { Way } from 'idly-common/lib/osm/structures';

export function wayIsClosed(way: Way): boolean {
  const first = way.nodes[0];
  const last = way.nodes[way.nodes.length - 1];
  return way.nodes.length > 1 && first === last;
}
