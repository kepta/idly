import { Entity, EntityTable, EntityType } from '../osm/structures';

export function entityTableGen(t: EntityTable, entities: Entity[]) {
  for (const e of entities) {
    if (t.has(e.id)) continue;
    t.set(e.id, e);
  }
  return t;
}
