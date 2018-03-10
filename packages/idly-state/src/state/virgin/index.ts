import { Table, tableBulkAdd } from '../../dataStructures/table';

import { iterableFlattenToSet } from '../../dataStructures/set';
import {
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableCreate,
  quadkeysTableGet,
} from './quadkeysTable';

export interface VirginState<T extends { id: string }> {
  readonly quadkeysTable: QuadkeysTable;
  readonly elements: Table<T>;
}

export function virginStateCreate<T extends { id: string }>(
  elements: Table<T> = new Map(),
  quadkeysTable = quadkeysTableCreate()
): VirginState<T> {
  return {
    elements,
    quadkeysTable,
  };
}

export function quadkeyGet(quadkeysTable: QuadkeysTable, quadkey: string) {
  return quadkeysTable.get(quadkey);
}

export function virginAddElements<T extends { id: string }>(
  elements: T[],
  quadkey: string,
  state: VirginState<T>
) {
  if (state.quadkeysTable.has(quadkey)) {
    return;
  }
  tableBulkAdd(elements.map((r: T): [string, T] => [r.id, r]), state.elements);
  quadkeysTableAdd(state.quadkeysTable, elements.map(r => r.id), quadkey);
}

export function virginGetInQuadkeys(
  quadkeysTable: QuadkeysTable,
  quadkeys: string[]
): ReadonlySet<string> {
  return iterableFlattenToSet(
    quadkeys
      .map(q => quadkeysTableGet(quadkeysTable, q))
      .filter((r): r is ReadonlySet<string> => !!r)
  );
}
