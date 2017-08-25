import {
  EntityTable,
  EntityType,
  FeaturePropsTable,
  ParentWays
} from 'idly-common/lib';
import { nodePropertiesGen } from './parsers/node';
import { wayPropertiesGen } from './parsers/way';

/**
 * meant to run purely on a separate thread.
 * @param entities 
 * @param parentWays 
 */
export function onParseEntities(
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
