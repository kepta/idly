import { Identity as I } from 'monet';
import { mapFilterValuesIntoArray, setAddIterable, setCreate } from '../helper';
import { Table, tableGet, tableRemove, tableUpdate } from '../table';

export type OneToManyTable<T> = Table<Set<T>>;
export const oneToManyTableCreate = <T>(): OneToManyTable<T> => new Map();

export const oneToManyTableRemove = <T>(
  table: OneToManyTable<T>,
  index: string
) => tableRemove(table, index);

export const oneToManyTableRemoveIndex = <T>(
  table: OneToManyTable<T>,
  index: string,
  val: T
) =>
  I(tableGet(table, index))
    .map(s => s && s.delete(val))
    .get();

export const oneToManyTableAddIndex = <T>(
  table: OneToManyTable<T>,
  index: string,
  val: T
) =>
  I((s = setCreate()) => s.add(val))
    .map(f => tableUpdate(f, table, index))
    .get();

export const oneToManyTableUpdateIndex = <T>(
  table: OneToManyTable<T>,
  index: string,
  val: T[]
) =>
  I((s = setCreate()) => setAddIterable(s, val))
    .map(f => tableUpdate(f, table, index))
    .get();

export const oneToManyTableFilter = <T>(
  foo: ((v: Set<T>, k: string) => boolean),
  table: OneToManyTable<T>
) => mapFilterValuesIntoArray(foo, table);
