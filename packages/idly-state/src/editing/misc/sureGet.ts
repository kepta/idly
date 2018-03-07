import { Table } from '../../dataStructures/table';

export function sureGet<T>(id: string, t: Table<T>): T {
  const val = t.get(id);
  if (!val) {
    throw new Error(`${id} not found in table: ${t}`);
  }
  return val;
}
