import { Table } from '../table';
import { tableAdd, tableHas } from '../table/regular';

import {
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableCreate,
  quadkeysTableFindRelated,
} from './quadkeysTable';

export class State<T, M = any> {
  public static create<T, M = T>(
    elementTable: Table<T> = new Map(),
    quadkeysTable = quadkeysTableCreate(),
    metaTable: Table<M> = new Map()
  ) {
    return new State<T, M>(elementTable, quadkeysTable, metaTable);
  }

  // tslint:disable-next-line:variable-name
  private _elementTable: Table<T>;
  // tslint:disable-next-line:variable-name
  private _quadkeysTable: QuadkeysTable;
  // tslint:disable-next-line:variable-name
  private _metaTable = new Map<string, M>();

  private constructor(
    elementTable: Table<T>,
    quadkeysTable: QuadkeysTable,
    metaTable: Table<M>
  ) {
    this._elementTable = elementTable;
    this._quadkeysTable = quadkeysTable;
    this._metaTable = metaTable;
  }
  public getElementTable() {
    return this._elementTable;
  }
  public getMetaTable() {
    return this._metaTable;
  }
  public getQuadkeysTable() {
    return this._quadkeysTable;
  }

  public getElement(id: string) {
    return this._elementTable.get(id);
  }

  public getIdsByQuadkey(quadkey: string) {
    return this._quadkeysTable.get(quadkey);
  }

  public has(quadkey: string) {
    return this._quadkeysTable.has(quadkey);
  }

  // a single element can be on multiple quadkeys, but
  // changing an existing element is disallowed
  public add(getId: (t: T) => string, elements: T[], quadkey: string) {
    elements.forEach(
      e =>
        tableHas(getId(e), this._elementTable) ||
        tableAdd(e, getId(e), this._elementTable)
    );
    quadkeysTableAdd(this._quadkeysTable, elements.map(getId), quadkey);
  }

  public getQuadkey(quadkey: string) {
    return this._quadkeysTable.get(quadkey);
  }

  public getVisible(quadkeys: string[]) {
    return quadkeysTableFindRelated(this._quadkeysTable, quadkeys);
  }
}
