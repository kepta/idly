import { Feature, LineString, Point, Polygon } from '@turf/helpers';

import {
  entityToGeoJson,
  entityToGeoJsonNew,
  onParseEntities,
} from 'idly-common/lib/geojson';
import {
  EntityTable,
  ParentWays,
} from 'idly-common/lib/osm/immutableStructures';
import { FeaturePropsTable } from 'idly-common/lib/osm/structures';

import { OsmTable } from 'idly-common/lib/state2/osmTable/osmTable';
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

export function entityToFeatureNew(
  osmTable: OsmTable
): Array<Feature<Point | Polygon | LineString>> {
  return entityToGeoJsonNew(osmTable);
}
