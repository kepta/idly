import { entityFactory } from 'idly-common/lib/osm/entityFactory';
import {
  Entity,
  EntityTable,
  EntityType,
} from 'idly-common/lib/osm/structures';

import { Feature, LineString, Point, Polygon } from '@turf/helpers';
import { nodeCombiner } from './nodeCombiner';
import { wayCombiner } from './wayCombiner';

// tslint:disable:no-expression-statement object-literal-key-quotes
export function entityToGeoJson(
  entityTable: EntityTable,
  computedProps: any,
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
