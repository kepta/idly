import { Node } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { Graph } from 'osm/history/graph';

// import { NodeFeature } from 'map/utils/nodeToFeat';

export function featToNode(feat: any, graph: Graph): Node {
  const node: Node = graph.node.get(feat.properties.id);
  return node.set(
    'loc',
    genLngLat([feat.geometry.coordinates[0], feat.geometry.coordinates[1]])
  );
}
