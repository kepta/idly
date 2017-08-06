import { List } from 'immutable';

import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { Node, nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';

import { NodeFeature } from 'map/utils/nodeToFeat';
import { WayFeature } from 'map/utils/wayToFeat';
import { Way, wayFactory } from 'osm/entities/way';
import { Graph } from 'osm/history/graph';

export function featToWay(feat: WayFeature, graph: Graph) {
  const nodes = JSON.parse(feat.properties.nodes);
  debugger;
  return {
    way: wayFactory({
      id: feat.properties.id,
      tags: tagsFactory(JSON.parse(feat.properties.tags)),
      properties: propertiesGen(JSON.parse(feat.properties.way_properties)),
      geometry: feat.properties.geometry,
      nodes: nodes.map(n => n.id)
    }),
    nodes
  };
}
