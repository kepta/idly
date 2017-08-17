import { Entity, EntityId } from 'structs';
import { EntityType, Geometry } from 'structs/geometry';
import { genLngLat, LngLat } from 'structs/lngLat';
import { Properties, propertiesGen } from 'structs/properties';
import { Tags } from 'structs/tags';

export type Table = Map<EntityId, Entity>;

// export const table: Table = new Map();

export function addEntitiesTable(t: Table, entities: Entity[]) {
  for (const e of entities) {
    if (t.has(e.id)) continue;
    t.set(e.id, e);
  }
  return t;
}
