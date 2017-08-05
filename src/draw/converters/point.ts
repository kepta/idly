import { Feature, Point } from 'geojson';

import { Geometries } from 'osm/entities/constants';
import { propertiesGen } from 'osm/entities/helpers/properties';
import { tagsFactory } from 'osm/entities/helpers/tags';
import { nodeFactory } from 'osm/entities/node';
import { genLngLat } from 'osm/geo_utils/lng_lat';

let id = 0;

export function newPointToNode(point: Feature<Point>) {
  return nodeFactory({
    id: `n-${++id}`,
    tags: tagsFactory(),
    loc: genLngLat([
      point.geometry.coordinates[0],
      point.geometry.coordinates[1]
    ]),
    properties: propertiesGen({ geometry: Geometries.POINT })
  });
}

export function pointToNode(point: Feature<Point>) {
  return nodeFactory({
    id: point.properties.id,
    tags: tagsFactory(JSON.parse(point.properties.tags)),
    loc: genLngLat([
      point.geometry.coordinates[0],
      point.geometry.coordinates[1]
    ]),
    properties: propertiesGen(JSON.parse(point.properties.node_properties))
  });
}
