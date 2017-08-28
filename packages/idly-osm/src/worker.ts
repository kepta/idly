import { PLUGIN_NAME } from './';
import {
  EntityTable,
  EntityType,
  FeatureProps,
  FeaturePropsTable,
  ParentWays
} from 'idly-common/lib/osm/structures';
import { nodePropertiesGen } from './parsers/node';
import { wayPropertiesGen } from './parsers/way';

function nameSpaceKeys(name, obj: { [index: string]: string }) {
  var newObj = {};
  Object.keys(obj).forEach(k => {
    newObj[name + '.' + k] = obj[k];
  });
  return newObj;
}
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
      var x = nameSpaceKeys(PLUGIN_NAME, nodePropertiesGen(entity, parentWays));
      fProps.set(id, x);
    }
    if (entity.type === EntityType.WAY) {
      fProps.set(
        id,
        nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(entity, entities))
      );
    }
  }
  return fProps;
}
