// import { LineString, Polygon } from 'geojson';
// import * as turf from 'turf';

// import { List, Map } from 'immutable';
// import { Feature } from 'typings/geojson';

// import { isArea } from 'osm/entities/helpers/misc';
// import { Node } from 'osm/entities/node';
// import { presetsMatcherCached } from 'osm/presets/presets';

// import { Geometry } from 'osm/entities/constants';
// import { Way } from 'osm/entities/way';
// import { Graph } from 'osm/history/graph';
// import { tagClassesPrimary } from 'osm/styling/tagClasses';
// import { weakCache } from 'utils/weakCache';
import * as turfLineString from 'turf-linestring';
import * as turfPolygon from 'turf-polygon';

import { LineString, Polygon } from 'geojson';
import { isArea } from 'helpers/isArea';
import { weakCache } from 'helpers/weakCache';
import { Geometry } from 'structs/geometry';
import { Node } from 'structs/node';
import { Way } from 'structs/way';

import { tagClassesPrimary } from 'osm/tagsStyling';
import { presetsMatcherCached } from 'presets/presets';
import { Table } from 'structs/table';
import { Feature } from 'types/geojson';

interface IWayProperties {
  id: string;
  icon: string | undefined;
  name?: string;
  geometry: Geometry.LINE | Geometry.AREA;
  tagsClass: string;
  tagsClassType: string;
}
/**
 * @TOFIX use areaKeys from the core.
 */
export type WayFeature = Feature<LineString | Polygon, IWayProperties>;

const tagClassesPrimaryCache = weakCache(tagClassesPrimary);

/**
 *
 * @REVISIT this func also needs to handle modifiedGraph
 *  for now i removed it so i can test caching and anyway
 *  not yet implemented modified ways
 */

export function wayCombiner(way: Way, table: Table) {
  const geometry = isArea(way) ? Geometry.AREA : Geometry.LINE;
  const [tagsClass, tagsClassType] = tagClassesPrimaryCache(way.tags);
  const match = presetsMatcherCached(geometry)(way.tags);
  // const nodes = getCoordsFromGraph(graph.node, way.nodes);

  const nodes = getCoordsFromTable(table, way.nodes);

  const properties: IWayProperties = {
    id: way.id,
    name: way.tags.get('name') || way.tags.get('ref'),
    icon: match && match.icon,
    geometry,
    tagsClass,
    tagsClassType
  };
  return {
    id: way.id,
    ...wayToLineString(geometry, nodes),
    properties
  };
}
export function getCoordsFromTable(table: Table, nodes: string[]): number[][] {
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
export function wayToLineString(geometry: Geometry, nodeCoords: number[][]) {
  let feat;
  if (geometry === Geometry.LINE) {
    feat = turfLineString(nodeCoords, {}) as Feature<
      LineString,
      IWayProperties
    >;
  } else if (geometry === Geometry.AREA) {
    feat = turfPolygon([nodeCoords], {}) as Feature<Polygon, IWayProperties>;
  } else {
    throw new Error('not a matching geometry provided for way');
  }
  return feat;
}
