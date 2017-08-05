import { Set } from 'immutable';

import { EntitiesId } from 'osm/entities/entities';
import { Node } from 'osm/entities/node';
import { Relation } from 'osm/entities/relation';
import { Way } from 'osm/entities/way';

export function removeExisting(
  existingIds: EntitiesId,
  newData: Array<Node | Way | Relation>
) {
  return newData.filter(n => !existingIds.has(n.id));
}

export function mergeIds(
  existingIds: EntitiesId,
  newData: Array<Node | Way | Relation>
) {
  const newIds = newData.map(n => n.id);
  return existingIds.union(newIds);
}
