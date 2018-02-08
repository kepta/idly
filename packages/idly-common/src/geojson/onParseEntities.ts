import { Set as ImSet } from 'immutable';

import { EntityTable, ParentWays } from '../osm/immutableStructures';
import { EntityType, FeaturePropsTable } from '../osm/structures';

import { ElementTable } from '../state2/osmTables/elementTable';
import { nodePropertiesGen, nodePropertiesGenNew } from './nodeProps';
import { wayPropertiesGen } from './wayProps';

export const PLUGIN_NAME = 'osm_basic';

function nameSpaceKeys(name: string, obj: { [index: string]: string }) {
  const newObj: { [index: string]: string } = {};
  Object.keys(obj).forEach(k => {
    newObj[name + '--' + k] = obj[k];
  });
  return newObj;
}
/**
 * @param entityTable
 * @param parentWays
 */
export function onParseEntities(
  entityTable: EntityTable,
  parentWays: ParentWays
): FeaturePropsTable {
  // @TOFIX cleanup, I think this function is one of the bottlenecks we have
  const fProps: FeaturePropsTable = new Map();
  const blankImSet = ImSet<string>();
  entityTable.forEach((entity, id) => {
    if (!entity || !id) {
      return;
    }

    if (entity.type === EntityType.NODE) {
      // @TOFIX why do we need to send the entire parentWays lol.
      const x = nameSpaceKeys(
        PLUGIN_NAME,
        nodePropertiesGen(entity, parentWays.get(entity.id) || blankImSet)
      );
      fProps.set(id, x);
    }

    if (entity.type === EntityType.WAY) {
      fProps.set(id, nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(entity)));
    }
  });
  return fProps;
}

export function onParseEntitiesNew(
  elementTable: ElementTable
): FeaturePropsTable {
  // @TOFIX cleanup, I think this function is one of the bottlenecks we have
  const fProps: FeaturePropsTable = new Map();
  elementTable.forEach((element, id) => {
    if (!element || !id) {
      return;
    }

    if (element.entity.type === EntityType.NODE) {
      // @TOFIX why do we need to send the entire parentWays lol.
      const x = nameSpaceKeys(
        PLUGIN_NAME,
        nodePropertiesGenNew(element.entity, element.parentWays)
      );
      fProps.set(id, x);
    }

    if (element.entity.type === EntityType.WAY) {
      fProps.set(
        id,
        nameSpaceKeys(PLUGIN_NAME, wayPropertiesGen(element.entity))
      );
    }
  });
  return fProps;
}
