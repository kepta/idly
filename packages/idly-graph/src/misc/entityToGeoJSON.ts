import { Feature } from 'idly-common/lib/osm/feature';
import {
  Entity,
  EntityTable,
  EntityType,
} from 'idly-common/lib/osm/structures';

import { nodeCombiner } from './nodeCombiner';
import { wayCombiner } from './wayCombiner';

// tslint:disable:no-expression-statement object-literal-key-quotes
export function entityToGeoJson(
  entityTable: EntityTable,
  computedProps: any,
): Array<Feature<any, any>> {
  const arr: Array<Feature<any, any>> = [];
  entityTable.forEach((entity: Entity, id) => {
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
