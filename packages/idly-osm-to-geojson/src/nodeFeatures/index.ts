import {
  Feature,
  Point,
} from '@turf/helpers';
import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { Node, OsmGeometry } from 'idly-common/lib/osm/structures';
import { Derived } from '../types';

export const DEFAULT_NODE_ICON = 'circle';

export function nodeFeatures(derived: Derived<Node>): Feature<Point> {
  const node = derived.entity;
  return {
    geometry: {
      coordinates: [node.loc.lon, node.loc.lat],
      type: 'Point',
    },
    id: node.id,
    properties: nodePropertiesGen(derived),
    type: 'Feature',
  };
}

export const nodePropertiesGen = (element: Derived<Node>) => {
  const size = element.parentWays.size;
  const geometry = size === 0 ? OsmGeometry.POINT : OsmGeometry.VERTEX;
  const match = presetMatch(element.entity.tags, geometry);
  return {
    '@idly-geometry': geometry,
    '@idly-icon': (match && match.icon) || DEFAULT_NODE_ICON,
    '@idly-intersection': size > 2,
    '@idly-name': element.entity.tags.name,
    id: element.entity.id,
  };
};
