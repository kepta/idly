import { ImList, ImMap } from '../misc/immutable';
import {
  Entity,
  EntityId,
  EntityTable,
  EntityType,
  Tags
} from '../osm/structures';
// export function entityTableGen(t: EntityTable, entities: Entity[]) {
//   for (const e of entities) {
//     if (t.has(e.id)) continue;
//     t.set(e.id, e);
//   }
//   return t;
// }

// export const entityTableGen: (
//   entityTable: EntityTable,
//   entities: ImList<Entity>
// ) => EntityTable = (
//   entityTable: EntityTable,
//   entities: ImList<Entity>
// ): EntityTable => {
//   return entityTable.withMutations(m => {
//     entities.forEach(e => m.set(e.id, e));
//   });
// };
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
