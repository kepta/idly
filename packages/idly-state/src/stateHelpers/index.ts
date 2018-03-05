import { Entity, EntityType } from 'idly-common/lib/osm/structures';

import { iterableFlattenToArray } from '../helper';
import { baseId } from '../log';
import { ReadonlyTable, Table } from '../table';

/**
 * special purpose function
 * makes changedTable take precedence in getting an entity
 * this is done so we can maintain our baseIds without
 * relying on virgin table which is a black box and should
 * not be relied on
 */
export function getEntitiesAndRelated(
  ids: Set<string>,
  changedTable: ReadonlyTable<Entity>,
  virginTable: ReadonlyTable<Entity>
): Table<Entity> {
  const result: Map<string, Entity> = new Map();
  for (const id of ids) {
    const e = (changedTable.get(id) || virginTable.get(id)) as Entity;
    result.set(id, e);

    entityGetRelatedEntities(e, virginTable).forEach(entity =>
      result.set(entity.id, entity)
    );
    // this overwrites any same virginTable entity
    entityGetRelatedEntities(e, changedTable).forEach(entity =>
      result.set(entity.id, entity)
    );
  }
  return result;
}

export function entityGetRelatedEntities(
  entity: Entity,
  table: ReadonlyTable<Entity>
): Entity[] {
  return idsGetEntities(entityGetRelatedIds(entity), table);
}

export function entitiesGetRelatedEntities(
  entities: Entity[],
  table: ReadonlyTable<Entity>
): Entity[] {
  return iterableFlattenToArray(
    entities.map(r => {
      return entityGetRelatedEntities(r, table);
    })
  );
}

/**
 * Related entities are
 * added so that we can render ways/relation
 * without relation on virgin dataset.
 * base entities are added so that
 * if we get merge conflict with osm data
 * we can first check if our base version is in align
 */
export function entitiesExpandToBaseAndRelated(
  entities: Entity[],
  table: ReadonlyTable<Entity>
): Entity[] {
  const baseEntities = entitiesGetBaseEntities(entities, table);
  const relatedEntities = entitiesGetRelatedEntities(
    entities.concat(baseEntities),
    table
  );
  return [...entities, ...baseEntities, ...relatedEntities];
}

const idsGetEntities = (
  ids: Iterable<string> | IterableIterator<string>,
  table: ReadonlyTable<Entity>
): Entity[] => {
  const result = [];
  for (const id of ids) {
    const e = table.get(id);
    if (e) {
      result.push(e);
    }
  }
  return result;
};

const entityGetRelatedIds = (e: Entity): ReadonlyArray<string> => {
  if (e.type === EntityType.WAY) {
    return e.nodes;
  } else if (e.type === EntityType.RELATION) {
    return e.members.map(r => r.id);
  }
  return [];
};

const entitiesGetBaseEntities = (
  entities: Entity[],
  table: ReadonlyTable<Entity>
): Entity[] =>
  entities
    .map(r => baseId(r.id))
    .map(bId => table.get(bId))
    .filter((r): r is Entity => !!r);
