import {
  Feature,
  LineString,
  lineString,
  Point,
  Polygon,
  polygon,
} from '@turf/helpers';
import {
  Node,
  Way,
  EntityType,
  OsmGeometry,
} from 'idly-common/lib/osm/structures';
import { nodePropertiesGenNew } from './nodeProps';
import { wayPropertiesGen } from './wayProps';
const cache = new WeakMap<any, any>();
export const PLUGIN_NAME = 'osm_basic';

export function nameSpaceKeys(name: string, obj: { [index: string]: string }) {
  const newObj: { [index: string]: string } = {};
  Object.keys(obj).forEach(k => {
    newObj[name + '--' + k] = obj[k];
  });
  return newObj;
}

export const entityToGeoJsonNew = (
  elementTable: Map<string, any>
): Array<Feature<Point | Polygon | LineString>> => {
  let count = 0;
  const result: Array<Feature<Point | Polygon | LineString>> = [];
  for (const [, element] of elementTable) {
    let r = cache.get(element);
    if (r) {
      result.push(r);
      count++;
      continue;
    }
    if (element.entity.type === EntityType.NODE) {
      r = nodeCombiner(element.entity, entityFeatureProperties(element));
    } else if (element.entity.type === EntityType.WAY) {
      r = wayCombinerNew(
        element.entity,
        elementTable,
        entityFeatureProperties(element)
      );
    } else {
      continue;
    }
    result.push(r);
    cache.set(element, r);
  }
  console.log('Size ', elementTable.size, ' cached ', count);
  return result;
};

export const entityFeatureProperties = (element: any): any => {
  if (!element) {
    throw new Error('No element supplied !');
  }

  if (element.entity.type === EntityType.NODE) {
    return nameSpaceKeys(
      PLUGIN_NAME,
      nodePropertiesGenNew(element.entity, element.parentWays)
    );
  } else if (element.entity.type === EntityType.WAY) {
    return nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(element.entity));
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

export function wayCombinerNew(
  way: Way,
  table: Map<string, any>,
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
  table: Map<string, any>,
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
