import { List } from 'immutable';

import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { Node } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';

import { wayFactory } from 'osm/entities/way';

import { Graph } from 'osm/history/graph';

export function featToWay(feat: any, graph: Graph) {
  const nodesId = graph.way.get(feat.properties.id).get('nodes');
  const nodes = nodesId.map((n, i) => {
    const node: Node = graph.node.get(n);
    return node.set('loc', genLngLat(feat.geometry.coordinates[i]));
  });
  const tags = graph.way.get(feat.properties.id).get('tags');
  const properties = graph.way.get(feat.properties.id).get('properties');
  // const nodes = graph.way.get(feat.properties.id).get('nodes');
  return [
    wayFactory({
      id: feat.properties.id,
      tags,
      properties,
      nodes: nodesId
    }),
    ...nodes
  ];
}
