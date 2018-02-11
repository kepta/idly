import { Table } from '../table';
import { tableAdd, tableCreate, tableHas } from '../table/regular';

import {
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableCreate,
  quadkeysTableCreateFrom,
  quadkeysTableFindRelated,
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

  public has(quadkey: string) {
    return this._quadkeysTable.has(quadkey);
  }

  // a single element can be on multiple quadkeys, but
  // changing an existing element is disallowed
  public add(getId: (t: T) => string, elements: T[], quadkey: string) {
    elements.forEach(
      e =>
        tableHas(this._elementTable, getId(e)) ||
        tableAdd(this._elementTable, getId(e), e)
    );
    quadkeysTableAdd(this._quadkeysTable, elements.map(getId), quadkey);
  }

  public getQuadkey(quadkey: string) {
    return this._quadkeysTable.get(quadkey);
  }
  public getVisible(quadkeys: string[]) {
    return quadkeysTableFindRelated(this._quadkeysTable, quadkeys);
  }

  public shred(quadkey: string) {
    const newElementTable = tableCreate<T>();

    const newQuadkeysTable = quadkeysTableCreateFrom(
      this._quadkeysTable,
      quadkey
    );

    quadkeysTableFlatten(newQuadkeysTable).forEach(k =>
      newElementTable.set(k, this._elementTable.get(k) as T)
    );

    return State.create(newElementTable, newQuadkeysTable);
  }
}
