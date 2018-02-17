import {
  Feature,
  LineString,
  lineString,
  Point,
  Polygon,
  polygon,
} from '@turf/helpers';
import {
  Entity,
  EntityType,
  Node,
  OsmGeometry,
  Way,
} from 'idly-common/lib/osm/structures';
import { nodePropertiesGen } from './nodeProps';
import { wayPropertiesGen } from './wayProps';

export interface Derived {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type DerivedTable = Map<string, Derived>;

export const entityFeatureProperties = (element: Derived): any => {
  if (!element) {
    throw new Error('No element supplied !');
  }

  if (element.entity.type === EntityType.NODE) {
    return nodePropertiesGen(
      element.entity,
      element.parentWays.size === 0 ? OsmGeometry.POINT : OsmGeometry.VERTEX
    );
  } else if (element.entity.type === EntityType.WAY) {
    return wayPropertiesGen(element.entity);
  }
};

export function nodeCombiner(node: Node, existingProps: {}): Feature<Point> {
  return {
    geometry: {
      coordinates: [node.loc.lon, node.loc.lat],
      type: 'Point',
    },
    id: node.id,
    properties: {
      ...existingProps,
      id: node.id,
    },
    type: 'Feature',
  };
}

export function wayCombiner(
  way: Way,
  table: DerivedTable,
  existingProps: {
    readonly '@idly-geometry': OsmGeometry;
    readonly [key: string]: string;
  }
): Feature<Polygon | LineString> {
  // @REVISIT this osm_basic injection, sems hacks
  const existingGeometry = existingProps['@idly-geometry'];
  if (!existingGeometry) {
    throw new Error('geometry not found in existing props');
  }
  const nodes = getCoordsFromTable(table, way.nodes);
  return {
    id: way.id,
    ...wayToLineString(existingGeometry, nodes),
    properties: {
      ...existingProps,
      id: way.id,
    },
  };
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

/**
 *  every ms counts. hehehe.
 */
export function wayToLineString(
  geom: OsmGeometry,
  nodeCoords: number[][]
): Feature<Polygon | LineString> {
  if (geom === OsmGeometry.LINE) {
    return lineString(nodeCoords, {});
  } else if (geom === OsmGeometry.AREA) {
    return polygon([nodeCoords], {});
  } else {
    throw new Error('not a matching geometry provided for way');
  }
}
