import { Feature, Point } from '@turf/helpers';
import { Node } from 'idly-common/lib/osm/structures';
import { Derived } from '../types';
import { nodePresetMatch } from './nodePresetMatch';

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

export function nodePropertiesGen(element: Derived<Node>) {
  const size = element.parentWays.size;
  const { geometry, match } = nodePresetMatch(element);
  return {
    '@idly-geometry': geometry as string,
    '@idly-icon': (match && match.icon) || DEFAULT_NODE_ICON,
    '@idly-intersection': size > 2,
    '@idly-name': element.entity.tags.name,
    '@idly-preset-name': match.name({}) || 'Node',
    id: element.entity.id,
  };
}
