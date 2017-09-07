import { ImList, ImMap } from '../misc/immutable';
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

function isImmutableList(
  item: ImList<Entity> | Entity[]
): item is ImList<Entity> {
  return ImList.isList(item);
}

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
