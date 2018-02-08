import {
  Feature,
  LineString,
  lineString,
  Point,
  Polygon,
  polygon,
} from '@turf/helpers';
import { EntityTable } from '../osm/immutableStructures';
import { Entity, EntityType, Node, OsmGeometry, Way } from '../osm/structures';
import { Element, ElementTable } from '../state2/osmTables/elementTable';

// tslint:disable:no-expression-statement object-literal-key-quotes
export function entityToGeoJson(
  entityTable: EntityTable,
  computedProps: any
): Array<Feature<Point | Polygon | LineString>> {
  const arr: Array<Feature<Point | Polygon | LineString>> = [];
  entityTable.forEach((entity: Entity | undefined, id) => {
    if (!entity) {
      return;
    }
    if (entity.type === EntityType.NODE) {
      arr.push(nodeCombiner(entity, computedProps.get(id)));
    } else if (entity.type === EntityType.WAY) {
      arr.push(wayCombiner(entity, entityTable, computedProps.get(id)));
    } else if (entity.type === EntityType.RELATION) {
      // @TOFIX
    }
  });

  return arr;
}

export function entityToGeoJsonNew(
  elementTable: ElementTable,
  computedProps: any
): Array<Feature<Point | Polygon | LineString>> {
  const arr: Array<Feature<Point | Polygon | LineString>> = [];
  elementTable.forEach(({ entity }, id) => {
    if (!entity) {
      return;
    }
    if (entity.type === EntityType.NODE) {
      arr.push(nodeCombiner(entity, computedProps.get(id)));
    } else if (entity.type === EntityType.WAY) {
      arr.push(wayCombinerNew(entity, elementTable, computedProps.get(id)));
    } else if (entity.type === EntityType.RELATION) {
      // @TOFIX
    }
  });

  return arr;
}

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
  table: EntityTable,
  existingProps: {
    readonly 'osm_basic--geometry': OsmGeometry;
    readonly [key: string]: string;
  }
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

export function wayCombinerNew(
  way: Way,
  table: ElementTable,
  existingProps: {
    readonly 'osm_basic--geometry': OsmGeometry;
    readonly [key: string]: string;
  }
): Feature<Polygon | LineString> {
  // @TOFIX code duplication
  // @REVISIT this osm_basic injection, sems hacks
  const existingGeometry = existingProps['osm_basic--geometry'];
  if (!existingGeometry) {
    throw new Error('geometry not found in existing props');
  }
  const nodes = getCoordsFromTableNew(table, way.nodes);
  return {
    id: way.id,
    ...wayToLineString(existingGeometry, nodes),
    properties: {
      ...existingProps,
      id: way.id,
    },
  };
}
export function getCoordsFromTableNew(
  table: ElementTable,
  nodes: Way['nodes']
): number[][] {
  return nodes.map(n => {
    if (!table.has(n)) {
      throw new Error('node not found ' + n);
    }
    const node = (table.get(n) as Element).entity as Node;
    return [node.loc.lon, node.loc.lat];
  });
}

export function getCoordsFromTable(
  table: EntityTable,
  nodes: Way['nodes']
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
