import { Feature } from 'idly-common/lib/osm/feature';
import { Node } from 'idly-common/lib/osm/structures';

export function nodeCombiner(node: Node, existingProps: {}): Feature<any, any> {
  return {
    id: node.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [node.loc.lon, node.loc.lat],
    },
    properties: {
      ...existingProps,
      id: node.id,
    },
  };
}
