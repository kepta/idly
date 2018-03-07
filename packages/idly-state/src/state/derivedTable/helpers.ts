import { Entity, Relation, Way } from 'idly-common/lib/osm/structures';
import { Derived, DerivedTable } from './index';

export function expandIds(
  ids: IterableIterator<string> | Iterable<string>,
  derivedTable: DerivedTable
): Entity[] {
  const res = [];
  for (const id of ids) {
    const e = derivedTable.get(id) as Derived;
    res.push(e.entity);
  }
  return res;
}

export function entityIdParentWays(
  id: string,
  derivedTable: DerivedTable
): Way[] {
  const d = derivedTable.get(id);

  if (!d) {
    throw new Error('Entity Id' + id + ' not found in derived table');
  }

  return expandIds(d.parentWays, derivedTable) as Way[];
}

export function entityIdParentRelations(
  id: string,
  derivedTable: DerivedTable
): Relation[] {
  const d = derivedTable.get(id);

  if (!d) {
    throw new Error('Entity Id' + id + ' not found in derived table');
  }

  return expandIds(d.parentRelations, derivedTable) as Relation[];
}

export function entitiesMakeParentRelationsLookup(
  ids: Iterable<string> | IterableIterator<string>,
  derivedTable: DerivedTable
): Map<string, Relation[]> {
  const result: Array<[string, Relation[]]> = [];

  for (const id of ids) {
    result.push([id, entityIdParentRelations(id, derivedTable)]);
  }
  return new Map(result);
}
