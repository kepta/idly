import { Entity, EntityType } from 'idly-common/lib/osm/structures';
import { baseId } from '../dataStructures/log';
import { OsmState } from '../type';

export function consistencyChecker(state: OsmState) {
  // return;
  self.consistencyState = state;
  for (const e of state.modified) {
    recursiveCheck('modified ', state.modified, e[1]);
  }

  for (const e of state.virgin.elements) {
    recursiveCheck('virgin ', state.virgin.elements, e[1]);
  }
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
      if (
        baseId(id) !== id &&
        !recursiveCheck(label, table, table.get(baseId(id)))
      ) {
        throw new Error(
          label + 'couldnt find id' + baseId(id) + ' in way ' + entity.id
        );
      }
    }
    return true;
  }
  // we dont check for relation because of rule#2
  return true;
}
