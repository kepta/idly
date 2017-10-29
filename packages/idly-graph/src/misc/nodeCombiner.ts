import { Feature } from 'idly-common/lib/osm/feature';
import { Node } from 'idly-common/lib/osm/structures';

export function nodeCombiner(node: Node, existingProps: {}): Feature<any, any> {
  return {
    geometry: {
      coordinates: [node.loc.lon, node.loc.lat],
      type: 'Point',
    },
    id: node.id,
    properties: {
      ...existingProps,
      id: node.id,
    },
    type: 'Feature',
  };
}
