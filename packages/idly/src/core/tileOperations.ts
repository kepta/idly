
import { EntitiesId, Entity } from 'osm/entities/entities';

export function removeExisting(existingIds: EntitiesId, newData: Entity[]) {
  return newData.filter(n => !existingIds.has(n.id));
}

export function mergeIds(existingIds: EntitiesId, newData: Entity[]) {
  const newIds = newData.map(n => n.id);
  return existingIds.union(newIds);
}
