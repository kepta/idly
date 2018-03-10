import { Entity, EntityType } from 'idly-common/lib/osm/structures';
import { baseId, isModifiedId, isVirginId } from '../dataStructures/log';
import { OsmState } from '../type';

export function consistencyChecker(state: OsmState) {
  // return;
  self.consistencyState = state;
  for (const e of state.modified) {
    recursiveCheck('modified ', state.modified, e[1]);
  }

  // for (const e of state.virgin.elements) {
  //   recursiveCheck('virgin ', state.virgin.elements, e[1]);
  // }
}

function recursiveCheck(
  label: string,
  table: ReadonlyMap<string, Entity>,
  entity?: Entity
): boolean {
  if (!entity) {
    return false;
  }
  if (entity.type === EntityType.NODE) {
    return true;
  }

  if (entity.type === EntityType.WAY) {
    for (const id of entity.nodes) {
      if (!recursiveCheck(label, table, table.get(id))) {
        self.consistencyLast = table;
        console.log(table);
        throw new Error(
          label + 'couldnt find id' + id + ' in way ' + entity.id
        );
      }

      // checks if a modifiedId has its baseId saved in table
      if (
        isModifiedId(id) &&
        !recursiveCheck(label, table, table.get(baseId(id)))
      ) {
        throw new Error(
          label +
            'couldnt find the baseId of modified ID' +
            id +
            ' in way ' +
            entity.id
        );
      }
    }
    return true;
  }
  if (entity.type === EntityType.RELATION && isModifiedId(entity.id)) {
    // we dont check for every (virgin) member of relation because of rule#2
    // for (const member of entity.members) {
    //   if (isVirginId(member.id)) {
    //     continue;
    //   }
    //   if (!recursiveCheck(label, table, table.get(member.id))) {
    //     throw new Error(
    //       `relation ${entity.id} 's modified member ${
    //         member.id
    //       } doesnt exist in table`
    //     );
    //   }
    // }
  }
  return true;
}
