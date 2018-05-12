import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import {
  Entity,
  EntityType,
  Node,
  Relation,
  Way,
} from 'idly-common/lib/osm/structures';
import { nodeFeatures } from './nodeFeatures';
import { relationFeatures } from './relationFeatures/index';
import { Derived, DerivedTable } from './types';
import { wayFeatures } from './wayFeatures';

// tslint:disable-next-line:variable-name
export const _internalCache = new WeakMap<
  Derived<Entity>,
  Feature<Point | Polygon | LineString>
>();

export const entityToGeoJson = (
  table: DerivedTable
): Array<Feature<Point | Polygon | LineString>> => {
  const result: Array<Feature<Point | Polygon | LineString>> = [];
  const relationGeometries: Derived[] = [];
  for (const [, element] of table) {
    let r = _internalCache.get(element);
    if (r) {
      result.push(r);
      continue;
    }
    if (element.entity.type === EntityType.NODE) {
      r = nodeFeatures(element as Derived<Node>);
    } else if (element.entity.type === EntityType.WAY) {
      r = wayFeatures(element as Derived<Way>, table);
    } else {
      relationGeometries.push(element);
      continue;
    }
    result.push(r);
    _internalCache.set(element, r);
  }

  for (const rD of relationGeometries) {
    const r = relationFeatures(rD as Derived<Relation>, table, _internalCache);
    if (r) {
      result.push(...r);
    }
  }

  return result;
};
