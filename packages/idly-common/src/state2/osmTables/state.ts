import { Entity } from '../../osm/structures';
import {
  getAllLatestIndexes,
  Log,
  logCreate,
  logVirginIdsCurrentlyModified,
} from '../log';
import { Table } from '../table';
import { tableFilter } from '../table/regular';
import {
  Element,
  ElementTable,
  elementTableBulkAdd,
  elementTableCreate,
} from './elementTable';
import {
  QuadkeysTable,
  quadkeysTableAdd,
  quadkeysTableCreate,
  quadkeysTableCreateFrom,
  quadkeysTableFindVirginIds,
  quadkeysTableFlatten,
} from './quadkeysTable';

// TOFIX _elementTable & _quadkeysTable
// ref will change when going to a new state
// we need to put deep inside an object
// also write a test for this
export class State {
  public static create(
    { elementTable, quadkeysTable, log } = {
      elementTable: elementTableCreate(),
      log: logCreate(),
      quadkeysTable: quadkeysTableCreate(),
    }
  ) {
    return new State(elementTable, quadkeysTable, log);
  }

  private readonly log: Log;

  // tslint:disable-next-line:variable-name
  private _elementTable: Table<Element>;
  // tslint:disable-next-line:variable-name
  private _quadkeysTable: QuadkeysTable;

  private constructor(
    elementTable: ElementTable,
    quadkeysTable: QuadkeysTable,
    log: Log
  ) {
    this._elementTable = elementTable;
    this._quadkeysTable = quadkeysTable;
    this.log = log;
  }
  public getElementTable() {
    return this._elementTable;
  }
  public getQuadkeysTable() {
    return this._quadkeysTable;
  }
  public fork(newLog: Log, modifiedEntities: Entity[]) {
    if (newLog === this.log || newLog.length === 0) {
      return this;
    }
    // check if modified entities tally with latest log
    const latestEntry = newLog[0];

    if (
      latestEntry.size !== modifiedEntities.length ||
      modifiedEntities.some(r => !latestEntry.has(r.id))
    ) {
      throw new Error('log and modifiedEntities dont match');
    }

    modifiedEntities.forEach(e => {
      if (this._elementTable.has(e.id)) {
        throw new Error(`Modified entity ${e.id} already exists in table`);
      }
    });

    this.addVirgin(modifiedEntities, '');

    return new State(this._elementTable, this._quadkeysTable, newLog);
  }

  public getElement(id: string) {
    return this._elementTable.get(id);
  }

  public getIdByQuadkey(quadkey: string) {
    return this._quadkeysTable.get(quadkey);
  }

  public getLog() {
    return this.log;
  }

  public addVirgin(entities: Entity[], quadkey: string) {
    elementTableBulkAdd(this._elementTable, entities);

    quadkeysTableAdd(this._quadkeysTable, entities.map(r => r.id), quadkey);
  }

  public getVisible(quadkeys: string[]) {
    const insideQuadkeys = quadkeysTableFindVirginIds(
      this._quadkeysTable,
      quadkeys
    );

    const toRemoveIds = logVirginIdsCurrentlyModified(this.log);

    for (const id of toRemoveIds) {
      insideQuadkeys.delete(id);
    }

    const latestIndexes = getAllLatestIndexes(this.log);

    for (const id of latestIndexes) {
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
