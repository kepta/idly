import { ImList, ImMap } from '../misc/immutable';
import { isImmutableList } from '../misc/isImmutableList';
import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
  Node,
  Relation,
  Tags,
  Way
} from '../osm/structures';

export function removeFromEntityTable(
  entityIds: ImList<EntityId> | EntityId[] = [],
  entityTable: EntityTable = ImMap()
) {
  if (isImmutableList(entityIds)) {
    return entityTable.withMutations(m => {
      entityIds.forEach((e: EntityId) => m.delete(e));
    });
  }
  return entityTable.withMutations(m => {
    entityIds.forEach(e => m.delete(e));
  });
}
