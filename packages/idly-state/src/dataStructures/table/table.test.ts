import * as fs from 'fs';
import { deepFreeze } from 'idly-common/lib/misc/deepFreeze';

import { Entity } from 'idly-common/lib/osm/structures';

import { iterableFlattenToSet } from '../set';
import { tableBulkAdd, tableBulkRemove, tableCreate, tableGet } from '../table';
import {
  OneToManyTable,
  oneToManyTableCreate,
  oneToManyTableFilter,
  oneToManyTableUpdateIndex,
} from './oneToMany';

const smallDataset = (freeze: boolean = false): Array<[string, Entity]> =>
  fs
    .readFileSync('./fixtures/mosm.jsonl', 'utf-8')
    .split('\n')
    .map(r => JSON.parse(r) as any)
    .map(r => (freeze ? deepFreeze(r) : r))
    .map(toIterable);

const toIterable: (r: Entity) => [string, Entity] = r => [r.id, r];

type QuadkeyTable = OneToManyTable<string>;

const filterByQuadkey = (table: QuadkeyTable, quadkey: string) =>
  iterableFlattenToSet(
    oneToManyTableFilter((_, k) => quadkeyFiltering(quadkey, k), table)
  );

const quadkeyFiltering = (quadkey: string, k: string) =>
  k.startsWith(quadkey) || quadkey.startsWith(k);

describe('entityTableAddBulk', () => {
  const table = tableCreate();
  it('should add', () => {
    const t = smallDataset();
    expect(tableBulkAdd(t, table)).toMatchSnapshot();
  });
});

describe('entityTableGet', () => {
  const table = tableCreate();
  tableBulkAdd(smallDataset(), table);
  let toMatch: any = smallDataset().find(([id]) => id === 'n12');
  toMatch = toMatch && toMatch[1];
  it('basic', () => {
    expect(tableGet('n12', table)).toEqual(toMatch);
  });
});

describe('entityTableRemoveBulk', () => {
  const table = tableCreate();
  tableBulkAdd(smallDataset(), table);

  const newTable = tableCreate();
  tableBulkAdd(smallDataset(), newTable);
  newTable.delete('n4133782717');
  newTable.delete('n4133782723');

  it('should remove', () => {
    expect(tableBulkRemove(['n4133782717', 'n4133782723'], table)).toEqual(
      newTable
    );
  });
  it('should not remove anything on empty array', () => {
    expect(tableBulkRemove([], table)).toEqual(newTable);
  });
  it('should remove ', () => {
    newTable.delete('w411770875');
    expect(tableBulkRemove(['w411770875'], table)).toEqual(newTable);
  });
});

describe('oneToManyTable', () => {
  it('should get correct quadkeys for empty quadkeys', () => {
    const table = oneToManyTableCreate<string>();
    const dataset = smallDataset().map(r => r[0]);
    oneToManyTableUpdateIndex(table, '', dataset);

    expect(filterByQuadkey(table, '').size).toEqual(dataset.length);
  });

  it('should add correct quadkey', () => {
    const table = oneToManyTableCreate<string>();

    const dataset = smallDataset();
    const count = 7;
    oneToManyTableUpdateIndex(
      table,
      '1',
      smallDataset()
        .map(r => r[0])
        .slice(0, count)
    );
    oneToManyTableUpdateIndex(
      table,
      '3',
      smallDataset()
        .map(r => r[0])
        .slice(count)
    );
    expect(filterByQuadkey(table, '3').size).toBe(dataset.length - count);
    expect(filterByQuadkey(table, '2').size).toBe(0);
    expect(filterByQuadkey(table, '1').size).toBe(count);
    expect(filterByQuadkey(table, '').size).toBe(dataset.length);
  });

  it('should give correct subset quadkey', () => {
    const table = oneToManyTableCreate<string>();

    const dataset = smallDataset();
    const count = 5;
    oneToManyTableUpdateIndex(
      table,
      '13',
      smallDataset()
        .map(r => r[0])
        .slice(0, count)
    );
    oneToManyTableUpdateIndex(
      table,
      '1',
      smallDataset()
        .map(r => r[0])
        .slice(count)
    );
    expect(filterByQuadkey(table, '1').size).toBe(dataset.length);
    expect(filterByQuadkey(table, '').size).toBe(dataset.length);
  });
  it('should give correct subset quadkey', () => {
    const table = oneToManyTableCreate<string>();
    const dataset = smallDataset();
    const count = 5;
    oneToManyTableUpdateIndex(
      table,
      '21',
      smallDataset()
        .map(r => r[0])
        .slice(0, count)
    );
    oneToManyTableUpdateIndex(
      table,
      '12',
      smallDataset()
        .map(r => r[0])
        .slice(count)
    );
    expect(filterByQuadkey(table, '21').size).toBe(count);
    expect(filterByQuadkey(table, '12').size).toBe(dataset.length - count);
  });
  it('should give not give  other  quadkey', () => {
    const table = oneToManyTableCreate<string>();
    const dataset = smallDataset();
    const count = 5;
    oneToManyTableUpdateIndex(
      table,
      '13',
      smallDataset()
        .map(r => r[0])
        .slice(0, count)
    );
    oneToManyTableUpdateIndex(
      table,
      '23',
      smallDataset()
        .map(r => r[0])
        .slice(count)
    );

    expect(filterByQuadkey(table, '3').size).toBe(0);
    expect(filterByQuadkey(table, '2').size).toBe(dataset.length - count);
    expect(filterByQuadkey(table, '1').size).toBe(count);
  });

  it('multiple quadkeys', () => {
    const table = oneToManyTableCreate<string>();

    oneToManyTableUpdateIndex(
      table,
      '1',
      smallDataset()
        .map(r => r[0])
        .slice(0, 4)
    );
    oneToManyTableUpdateIndex(
      table,
      '12',
      smallDataset()
        .map(r => r[0])
        .slice(4, 8)
    );
    oneToManyTableUpdateIndex(
      table,
      '123',
      smallDataset()
        .map(r => r[0])
        .slice(8, 12)
    );
    oneToManyTableUpdateIndex(
      table,
      '223',
      smallDataset()
        .map(r => r[0])
        .slice(12, 14)
    );
    oneToManyTableUpdateIndex(
      table,
      '122',
      smallDataset()
        .map(r => r[0])
        .slice(14)
    );

    expect(filterByQuadkey(table, '').size).toBe(smallDataset().length);
    expect(filterByQuadkey(table, '1').size).toBe(18);
    expect(filterByQuadkey(table, '12').size).toBe(18);
    expect(filterByQuadkey(table, '123').size).toBe(12);
    expect(filterByQuadkey(table, '122').size).toBe(14);
    expect(filterByQuadkey(table, '223').size).toBe(2);
  });
});
