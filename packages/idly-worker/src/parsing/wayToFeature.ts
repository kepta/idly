import * as turfLineString from 'turf-linestring';
import * as turfPolygon from 'turf-polygon';

import { EntityTable, Node, OsmGeometry, Way } from 'idly-common/lib';

import { LineString, Polygon } from 'geojson';

/**
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */

export function wayCombiner(
  way: Way,
  table: EntityTable,
  existingProps: { geometry: OsmGeometry; [key: string]: string } = {
    geometry: OsmGeometry.LINE
  }
) {
  // @TOFIX code duplication
  const geometry = existingProps.geometry;
  if (!geometry) {
    throw new Error('geometry not found in existing props');
  }
  const nodes = getCoordsFromTable(table, way.nodes);
  return {
    id: way.id,
    ...wayToLineString(geometry, nodes),
    properties: {
      ...existingProps,
      id: way.id
    }
  };
}

export function getCoordsFromTable(
  table: EntityTable,
  nodes: string[]
): number[][] {
  return nodes.map(n => {
    if (!table.has(n)) throw new Error('node not found ' + n);
    const node = table.get(n) as Node;
    return [node.loc.lon, node.loc.lat];
  });
}

/**
 * graphNode comes from graph.node
 *  planning to use it for memoization.
 *  every ms counts. hehehe.
 */
export function wayToLineString(geometry: OsmGeometry, nodeCoords: number[][]) {
  if (geometry === OsmGeometry.LINE) {
    return turfLineString(nodeCoords, {});
  } else if (geometry === OsmGeometry.AREA) {
    return turfPolygon([nodeCoords], {});
  } else {
    throw new Error('not a matching geometry provided for way');
  }
}
