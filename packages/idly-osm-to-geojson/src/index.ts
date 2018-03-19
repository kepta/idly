import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { Entity, EntityType } from 'idly-common/lib/osm/structures';
import {
  entityFeatureProperties,
  nodeCombiner,
  wayCombiner,
} from './entityToGeojson';

export interface Derived {
  readonly entity: Entity;
  readonly parentWays: Set<string>;
  readonly parentRelations: Set<string>;
}

export type DerivedTable = Map<string, Derived>;

// tslint:disable-next-line:variable-name
export const _internalCache = new WeakMap<any, any>();

export const entityToGeoJson = (
  table: DerivedTable
): Array<Feature<Point | Polygon | LineString>> => {
  let count = 0;
  const result: Array<Feature<Point | Polygon | LineString>> = [];
  for (const [, element] of table) {
    let r = _internalCache.get(element);
    if (r) {
      count++;
      result.push(r);
      continue;
    }
    if (element.entity.type === EntityType.NODE) {
      r = nodeCombiner(element.entity, entityFeatureProperties(element));
    } else if (element.entity.type === EntityType.WAY) {
      r = wayCombiner(element.entity, table, entityFeatureProperties(element));
    } else {
      // console.log(element.entity.tags.type, element);
      continue;
    }
    result.push(r);
    _internalCache.set(element, r);
  }
  console.log('cache', count, 'size', table.size);
  return result;
};
