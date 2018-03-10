import { Identity as I } from 'monet';
import { mapFilterValuesIntoArray, setAddIterable, setCreate } from '../set';
import {
  ReadonlyTable,
  Table,
  tableGet,
  tableRemove,
  tableUpdate,
} from '../table/regular';

export type OneToManyTable<T> = Table<Set<T>>;
export type ReadonlyOneToManyTable<T> = ReadonlyTable<ReadonlySet<T>>;

export const oneToManyTableCreate = <T>(): OneToManyTable<T> => new Map();

export const oneToManyTableRemove = <T>(
  table: OneToManyTable<T>,
  index: string
) => tableRemove(index, table);

export const oneToManyTableRemoveIndex = <T>(
  table: OneToManyTable<T>,
  index: string,
  value: T
): boolean | undefined => {
  const s = tableGet(index, table);
  if (s) {
    return s.delete(value);
  }
  return;
};

export const oneToManyTableInsert = <T>(
  table: OneToManyTable<T>,
  index: string,
  value: T
): OneToManyTable<T> =>
  tableUpdate((s = setCreate()) => s.add(value), index, table);

export const oneToManyTableUpdateIndex = <T>(
  table: OneToManyTable<T>,
  index: string,
  value: T[]
): OneToManyTable<T> =>
  tableUpdate((s = setCreate()) => setAddIterable(value, s), index, table);

export const oneToManyTableFilter = <T>(
  foo: ((v: Set<T>, k: string) => boolean),
  table: OneToManyTable<T>
) => mapFilterValuesIntoArray(foo, table);
