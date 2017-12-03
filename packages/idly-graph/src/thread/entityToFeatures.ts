import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import {
  EntityTable,
  FeaturePropsTable,
  ParentWays,
} from 'idly-common/lib/osm/structures';
import { onParseEntities } from 'idly-common/lib/geojson/onParseEntities';
import { calculateParentWays } from '../misc/calculateParentWays';
import { entityToGeoJson } from 'idly-common/lib/geojson/entityToGeojson';

export type PluginComputeProps = (
  entityTable: EntityTable,
  parentWays: ParentWays,
) => FeaturePropsTable;

export type EntityToFeatureType = (
  entityTable: EntityTable,
  parentWays?: ParentWays,
) => Array<Feature<Point | Polygon | LineString>>;

export function entityToFeature(
  computer: PluginComputeProps[],
): EntityToFeatureType {
  return (entityTable, parentWays = calculateParentWays(entityTable)) => {
    const props = new Map();
    computer.push(onParseEntities);
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
