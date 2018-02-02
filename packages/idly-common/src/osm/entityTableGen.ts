import { List as ImList, Map as ImMap } from 'immutable';
import { isImmutableList } from '../misc/isImmutableList';
import { EntityTable } from '../osm/immutableStructures';
import { Entity } from '../osm/structures';

// @TOFIX this could be written with better performance
export function entityTableGen(
  entities: ImList<Entity> | Entity[] | Set<Entity> = [],
  entityTable: EntityTable = ImMap()
): EntityTable {
  if (isImmutableList(entities)) {
    return entityTable.withMutations(m => {
      entities.forEach((e: any) => m.set(e.id, e));
    });
  }
  if (Array.isArray(entities)) {
    return entityTable.withMutations(m => {
      entities.forEach(e => m.set(e.id, e));
    });
  }
  return entityTable.withMutations(m => {
    for (const e of entities) {
      m.set(e.id, e);
    }
  });
}
