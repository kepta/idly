import {
  EntityTable,
  EntityType,
  FeatureProps,
  ParentWays,
  FeaturePropsTable
} from 'idly-common/lib';

import { wayPropertiesGen } from './parsers/way';
import { nodePropertiesGen } from './parsers/node';

export class IdlyOSM {
  onParseEntities(
    entities: EntityTable,
    parentWays: ParentWays
  ): FeaturePropsTable {
    const fProps: FeaturePropsTable = new Map();
    for (const [id, entity] of entities) {
      if (entity.type === EntityType.NODE) {
        var x = nodePropertiesGen(entity, parentWays);
        fProps.set(id, x);
      }
      if (entity.type === EntityType.WAY) {
        fProps.set(id, wayPropertiesGen(entity, entities));
      }
    }
    return fProps;
  }
}
