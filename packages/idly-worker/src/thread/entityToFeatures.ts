import { Feature, LineString, Point, Polygon } from '@turf/helpers';

import { entityToGeoJson } from 'idly-common/lib/geojson/entityToGeojson';
import { onParseEntities } from 'idly-common/lib/geojson/onParseEntities';
import {
  EntityTable,
  FeaturePropsTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';

export type PluginComputeProps = (
  entityTable: EntityTable,
  parentWays: ParentWays
) => FeaturePropsTable;

export type EntityToFeatureType = (
  entityTable: EntityTable,
  parentWays?: ParentWays
) => Array<Feature<Point | Polygon | LineString>>;

export function entityToFeature(
  computer: PluginComputeProps[]
): EntityToFeatureType {
  return (entityTable, parentWays = calculateParentWays(entityTable)) => {
    const props = new Map();
    computer.push(onParseEntities);
    for (const comp of computer) {
      const computedProps = comp(entityTable, parentWays);
      for (const [entityId, val] of computedProps) {
        if (props.has(entityId)) {
          props.get(entityId).push(val);
        } else {
          props.set(entityId, [val]);
        }
      }
    }
    for (const [key, val] of props) {
      props.set(key, Object.assign({}, ...val));
    }
    return entityToGeoJson(entityTable, props);
  };
}
