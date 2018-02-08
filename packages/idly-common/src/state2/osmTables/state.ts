import { Log, logGetLatestIndexes, logGetModifiedIds } from '../log';
import { Table } from '../table';
import { tableAdd, tableFilter } from '../table/regular';

import {
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableCreate,
  quadkeysTableCreateFrom,
  quadkeysTableFindVirginIds,
  quadkeysTableFlatten,
} from './quadkeysTable';

export class State<T> {
  public static create<T>(
    elementTable: Table<T> = new Map(),
    quadkeysTable = quadkeysTableCreate()
  ) {
    return new State<T>(elementTable, quadkeysTable);
  }

  // tslint:disable-next-line:variable-name
  private _elementTable: Table<T>;
  // tslint:disable-next-line:variable-name
  private _quadkeysTable: QuadkeysTable;

  private constructor(elementTable: Table<T>, quadkeysTable: QuadkeysTable) {
    this._elementTable = elementTable;
    this._quadkeysTable = quadkeysTable;
  }
  public getElementTable() {
    return this._elementTable;
  }
  public getQuadkeysTable() {
    return this._quadkeysTable;
  }

  public getElement(id: string) {
    return this._elementTable.get(id);
  }

  public getIdByQuadkey(quadkey: string) {
    return this._quadkeysTable.get(quadkey);
  }

  public add(getId: (t: T) => string, elements: T[], quadkey: string) {
    elements.forEach(e => tableAdd(this._elementTable, getId(e), e));
    quadkeysTableAdd(this._quadkeysTable, elements.map(getId), quadkey);
  }

  public getVisible(quadkeys: string[], log: Log) {
    const insideQuadkeys = quadkeysTableFindVirginIds(
      this._quadkeysTable,
      quadkeys
    );

    const toRemoveIds = logGetModifiedIds(log);

    for (const id of toRemoveIds) {
      insideQuadkeys.delete(id);
    }

    for (const id of logGetLatestIndexes(log)) {
      insideQuadkeys.add(id);
    }

    return insideQuadkeys;
  }

  public shred(quadkey: string) {
    // To test we dont remove '' key
    const shreddedQuadkeyTable = quadkeysTableCreateFrom(
      this._quadkeysTable,
      quadkey
    );

    // gets all indexes
    const shreddedIndexes = quadkeysTableFlatten(shreddedQuadkeyTable);

    const shreddedElementTable = tableFilter(
      (_, id) => shreddedIndexes.has(id),
      this._elementTable
    );

    this._elementTable = shreddedElementTable;
    this._quadkeysTable = shreddedQuadkeyTable;
  }
}
