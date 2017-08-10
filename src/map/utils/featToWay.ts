import { List } from 'immutable';

import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';

import { WayFeature } from 'map/utils/wayToFeat';
import { wayFactory } from 'osm/entities/way';

import { Graph } from 'osm/history/graph';

export function featToWay(feat: WayFeature, graph: Graph) {
  const nodesId = JSON.parse(feat.properties.nodes);
  const nodes = nodesId.map((n, i) => {
    const node: Node = graph.node.get(n);
    return node.set('loc', genLngLat(feat.geometry.coordinates[i]));
  });

  return [
    wayFactory({
      id: feat.properties.id,
      tags: tagsFactory(JSON.parse(feat.properties.tags)),
      properties: propertiesGen(JSON.parse(feat.properties.way_properties)),
      geometry: feat.properties.geometry,
      nodes: List(nodesId)
    }),
    ...nodes
  ];
}
