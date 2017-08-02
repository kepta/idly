import { Node, nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';
import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';

import { NodeFeature } from 'map/utils/nodeToFeat';

export function featToNode(feat: NodeFeature): Node {
  return nodeFactory({
    id: feat.properties.id,
    tags: tagsFactory(JSON.parse(feat.properties.tags)),
    loc: genLngLat([
      feat.geometry.coordinates[0],
      feat.geometry.coordinates[1]
    ]),
    properties: propertiesGen(JSON.parse(feat.properties.node_properties))
  });
}
