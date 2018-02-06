import { nodeFactory } from '../../osm/entityFactory/nodeFactory';
import { relationFactory } from '../../osm/entityFactory/relationFactory';
import { wayFactory } from '../../osm/entityFactory/wayFactory';
import { Entity } from '../../osm/structures';
import { setCreate } from '../helper';
import {
  Element,
  elementTableBulkAdd,
  elementTableCreate,
} from './elementTable';

const n1 = nodeFactory({
  id: 'n1',
});
const n2 = nodeFactory({
  id: 'n2',
});
const n3 = nodeFactory({
  id: 'n3',
});
const n4 = nodeFactory({
  id: 'n4',
});
const w1 = wayFactory({
  id: 'w1',
  nodes: ['n1', 'n2'],
});

const w2 = wayFactory({
  id: 'w2',
  nodes: ['n1', 'n3'],
});

const r1 = relationFactory({
  id: 'r1',
  members: [{ id: 'n4', ref: 'n4' }, { id: 'w2', ref: 'w2' }],
});

const dummyElement = (
  entity: Entity,
  parentWays = setCreate<string>(),
  parentRelations = setCreate<string>()
): Element => ({
  entity,
  parentRelations,
  parentWays,
});

it('adds entities', () => {
  const table = elementTableCreate();
  elementTableBulkAdd(table, [n1, n2]);
  expect(table).toEqual(
    new Map([['n1', dummyElement(n1)], ['n2', dummyElement(n2)]])
  );
});
it('adds parentways', () => {
  const table = elementTableCreate();
  elementTableBulkAdd(table, [n1, n2]);
  elementTableBulkAdd(table, [w1]);
  expect(table).toEqual(
    new Map([
      ['n1', dummyElement(n1, setCreate(['w1']))],
      ['n2', dummyElement(n2, setCreate(['w1']))],
      ['w1', dummyElement(w1)],
    ])
  );
});

it('adds everything correctly', () => {
  const t1 = elementTableCreate();
  elementTableBulkAdd(t1, [n1, n2, w2, w1, n3, r1, n4]);

  expect(t1).toMatchSnapshot();
});

it('adds everything correctly', () => {
  const t1 = elementTableCreate();
  elementTableBulkAdd(t1, [n1, n2, w2, w1, n3, r1, n4]);

  expect(t1.get('n1')).toMatchSnapshot();
});

it('throw error when entity node found in table', () => {
  const t1 = elementTableCreate();
  expect(() => elementTableBulkAdd(t1, [n1, w2])).toThrowError();
});
