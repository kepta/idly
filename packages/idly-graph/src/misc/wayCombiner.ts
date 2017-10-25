import {
  Feature,
  LineString,
  lineString,
  Polygon,
  polygon,
} from '@turf/helpers';
import {
  EntityTable,
  Node,
  OsmGeometry,
  Way,
} from 'idly-common/lib/osm/structures';

/**
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */

export function wayCombiner(
  way: Way,
  table: EntityTable,
  existingProps: {
    readonly 'osm_basic--geometry': OsmGeometry;
    readonly [key: string]: string;
  },
): Feature<Polygon | LineString> {
  // @TOFIX code duplication
  // @REVISIT this osm_basic injection, sems hacks
  const existingGeometry = existingProps['osm_basic--geometry'];
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
  table: EntityTable,
  nodes: Way['nodes'],
): number[][] {
  return nodes.map(n => {
    if (!table.has(n)) {
      throw new Error('node not found ' + n);
    }
    const node = table.get(n) as Node;
    return [node.loc.lon, node.loc.lat];
  });
}

/**
 * graphNode comes from graph.node
 *  planning to use it for memoization.
 *  every ms counts. hehehe.
 */
export function wayToLineString(
  geom: OsmGeometry,
  nodeCoords: number[][],
): Feature<Polygon | LineString> {
  if (geom === OsmGeometry.LINE) {
    return lineString(nodeCoords, {});
  } else if (geom === OsmGeometry.AREA) {
    return polygon([nodeCoords], {});
  } else {
    throw new Error('not a matching geometry provided for way');
  }
}
