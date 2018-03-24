import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { EntityType, Relation } from 'idly-common/lib/osm/structures';
import {
  entityFeatureProperties,
  nodeCombiner,
  wayCombiner,
} from './entityToGeojson';
import { relationCombiner } from './relationCombiner';
import { Derived } from './types';

export type DerivedTable = Map<string, Derived>;

// tslint:disable-next-line:variable-name
export const _internalCache = new WeakMap<
  Derived,
  Feature<Point | Polygon | LineString>
>();

export const entityToGeoJson = (
  table: DerivedTable
): Array<Feature<Point | Polygon | LineString>> => {
  let count = 0;
  const result: Array<Feature<Point | Polygon | LineString>> = [];
  const rels: Derived[] = [];
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
      rels.push(element);
      continue;
    }
    result.push(r);
    _internalCache.set(element, r);
  }

  for (const rD of rels) {
    const r = relationCombiner(rD.entity as Relation, table, _internalCache);
    if (r) {
      result.push(...r);
    }
  }

  console.log('cache', count, 'size', table.size);
  return result;
};
