import { nodeFactory } from 'idly-common/lib/osm/nodeFactory';
import { PLUGIN_NAME } from './config/config';
import {
  Entity,
  EntityTable,
  EntityType,
  FeatureProps,
  FeaturePropsTable,
  ParentWays,
  Relation,
  Way
} from 'idly-common/lib/osm/structures';
import { nodePropertiesGen } from './parsers/node';
import { wayPropertiesGen } from './parsers/way';

import { ImSet } from 'idly-common/lib/misc/immutable';

function nameSpaceKeys(name, obj: { [index: string]: string }) {
  var newObj = {};
  Object.keys(obj).forEach(k => {
    newObj[name + '.' + k] = obj[k];
  });
  return newObj;
}
/**
 * meant to run purely on a separate thread.
 * @param entityTable 
 * @param parentWays 
 */
export function onParseEntities(
  entityTable: EntityTable,
  parentWays: ParentWays
): FeaturePropsTable {
  console.log('onParseEntities called worker !!!');
  const fProps: FeaturePropsTable = new Map();

  entityTable.forEach((entity, id) => {
    if (entity.type === EntityType.NODE) {
      // @TOFIX why do we need to send the entire parentWays lol.
      var x = nameSpaceKeys(
        PLUGIN_NAME,
        nodePropertiesGen(entity, parentWays.get(entity.id) || ImSet())
      );
      fProps.set(id, x);
    }
    if (entity.type === EntityType.WAY) {
      fProps.set(id, nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(entity)));
    }
  });
  return fProps;
}
