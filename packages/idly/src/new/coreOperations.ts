import { Map, Set } from 'immutable';

import { Node } from 'osm/entities/node';

export type Entities = Set<Node>;
export type EntitiesId = Set<string>;

function getIdIntersection(en1: Entities, en2: Entities) {
  return toIdSet(en2).intersect(toIdSet(en1));
}

/**
 * Virgin Entities V<O> operations
 *
 * @DESC: new data (X<O>)
 *  where O is the data type (eg. Node)
 *  where I is the dataId (eg.string)
 *  where V is the Virgin Entities
 *  where M is the modified Entities
 *  if V<I> Intersects X<I> = phi
 *  and M<I> Intersects X<I> = phi
 *  then V'<O> = X<O> U V<O>.
 *  In short for this function to work
 *  newEntities should not have ids which
 *  are already in virginEntities or modifiedEntities.
 *  Provides a computationally expensive check param
 *  to check if this condition
 *  is violated.
 */

export function addToVirginEntities(
  virginEntities: Entities,
  newEntities: Entities,
  modifiedEntities?: Entities,
  check?: boolean
) {
  if (check) {
    const diff1 = getIdIntersection(virginEntities, newEntities);
    const diff2 = getIdIntersection(modifiedEntities, newEntities);
    if (diff1.size !== 0 || diff2.size !== 0) {
      throw new Error('intersection is not zero');
    }
  }
  return virginEntities.union(newEntities);
}

function toIdSet(entities: Entities) {
  return entities.map(e => e.id).toSet();
}

/**
 * @DESC: to be used when a entitiy is modified
 *  and needs to be moved to modified entities.
 *
 * @NOTE: removing wont be heaving so wont worry
 *  about scaling issues right not and just use
 *  some heavy operations to remove correctly.
 *
 * @REVISIT: filter always creates new instance of the set
 *  might want to fix it.
 *
 * @REVISIT: Can revist in for future perf optimizations.
 */
export function removeEntities(
  virginEntities: Entities,
  entitiesIdToRemove: EntitiesId
) {
  if (entitiesIdToRemove.size === 0) return virginEntities;
  return virginEntities.filter(en => !entitiesIdToRemove.has(en.id)).toSet();
}

export function addToModifiedEntities(
  modifiedEntities: Entities,
  entitiestoAdd: Entities
) {
  const entitiesIdtoAdd = toIdSet(entitiestoAdd);
  // remove any id which might already exist in
  // modifiedEntities, so that union overwrites.
  const withoutStaleEntities = removeEntities(
    modifiedEntities,
    entitiesIdtoAdd
  );
  return withoutStaleEntities.union(entitiestoAdd);
}
