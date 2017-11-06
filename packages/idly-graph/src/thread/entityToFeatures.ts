import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import {
  EntityTable,
  FeaturePropsTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';

import { calculateParentWays } from '../misc/calculateParentWays';
import { entityToGeoJson } from '../misc/entityToGeoJSON';

export type PluginComputeProps = (
  entityTable: EntityTable,
  parentWays: ParentWays,
) => FeaturePropsTable;

export function entityToFeature(
  computer: PluginComputeProps[],
): (
  entityTable: EntityTable,
  parentWays?: ParentWays,
) => Array<Feature<Point | Polygon | LineString>> {
  return (entityTable, parentWays = calculateParentWays(entityTable)) => {
    const props = new Map();
    for (const comp of computer) {
      const computedProps = comp(entityTable, parentWays);
      for (const [entityId, val] of computedProps) {
        if (props.has(entityId)) {
          // tslint:disable-next-line:no-expression-statement
          props.get(entityId).push(val);
        } else {
          // tslint:disable-next-line:no-expression-statement
          props.set(entityId, [val]);
        }
      }
    }
    for (const [key, val] of props) {
      // tslint:disable-next-line:no-expression-statement
      props.set(key, Object.assign({}, ...val));
    }
    return entityToGeoJson(entityTable, props);
  };
}
