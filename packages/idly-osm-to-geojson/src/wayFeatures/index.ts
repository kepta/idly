import {
  Feature,
  LineString,
  lineString,
  Polygon,
  polygon,
} from '@turf/helpers';
import { presetMatch } from 'idly-common/lib/geojson/presetMatch';
import { isArea } from 'idly-common/lib/osm/isArea';
import { Node, OsmGeometry, Way } from 'idly-common/lib/osm/structures';
import { tagClasses } from 'idly-common/lib/tagClasses/tagClasses';
import { isOneway } from '../isOneway';
import { Derived, DerivedTable } from '../types';

export function wayFeatures(
  derived: Derived<Way>,
  table: Map<string, Derived>
): Feature<Polygon | LineString> {
  const way = derived.entity;

  const geometry = isArea(way) ? OsmGeometry.AREA : OsmGeometry.LINE;

  const feat = wayToLineString(
    geometry,
    getCoordsFromTable(table, way.nodes),
    wayPropertiesGen(derived.entity, geometry)
  );

  feat.id = way.id;

  return feat;
}

export function getCoordsFromTable(
  table: DerivedTable,
  nodes: Way['nodes']
): number[][] {
  return nodes.map(n => {
    const node = table.get(n);
    if (!node) {
      throw new Error('node not found ' + n);
    }
    return [(node.entity as Node).loc.lon, (node.entity as Node).loc.lat];
  });
}

export function wayToLineString(
  geom: OsmGeometry,
  nodeCoords: number[][],
  properties: object
): Feature<Polygon | LineString> {
  if (geom === OsmGeometry.LINE) {
    return lineString(nodeCoords, properties);
  } else if (geom === OsmGeometry.AREA) {
    return polygon([nodeCoords], properties);
  } else {
    throw new Error('not a matching geometry provided for way');
  }
}

const wayPropertiesGen = ({ tags, id }: Way, geometry: OsmGeometry) => {
  const allTagClasses = tagClasses(tags);

  const trimmed = Object.keys(allTagClasses).reduce(
    (prev, cur) => {
      prev['@idly-' + cur] = allTagClasses[cur];
      return prev;
    },
    {} as Record<string, string>
  );

  const match = presetMatch(tags, geometry);
  const result: Record<string, boolean | string | number> = {
    '@idly-geometry': geometry,
    '@idly-icon': match && match.icon,
    '@idly-isOneway': isOneway(tags),
    '@idly-name': tags.name || tags.ref,
    '@idly-preset-name': match.name({}) || 'Way',
    ...trimmed,
    id,
  };

  if (tags.height) {
    result['@idly-height'] = parseInt(tags.height, 10);
    result['@idly-min_height'] = parseInt(tags.min_height, 10) || 0;
    if (tags['building:colour'] || tags['building:color']) {
      result['@idly-building-colour'] =
        tags['building:colour'] || tags['building:color'];
    }
  }
  return result;
};
