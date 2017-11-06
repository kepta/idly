import { List as ImList, Map as ImMap } from 'immutable';
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

export function entityTableGen(
  entities: ImList<Entity> | Entity[] = [],
  entityTable: EntityTable = ImMap()
) {
  if (isImmutableList(entities)) {
    return entityTable.withMutations(m => {
      entities.forEach((e: Entity) => m.set(e.id, e));
    });
  }
  return entityTable.withMutations(m => {
    entities.forEach(e => m.set(e.id, e));
  });
}
