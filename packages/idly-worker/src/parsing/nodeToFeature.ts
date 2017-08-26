import { Node } from 'idly-common/lib/osm/structures';

export function nodeCombiner(node: Node, existingProps: {}) {
  return {
    id: node.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [node.loc.lon, node.loc.lat]
    },
    properties: {
      ...existingProps,
      id: node.id
    }
  };
}
