import {
  nodeFactory,
  relationFactory,
  wayFactory,
} from 'idly-common/lib/osm/entityFactory';
import { Relation } from 'idly-common/lib/osm/structures';

import { simpleIdIncr } from '../../pure/tests/util';
import { nodeMoveOp } from '../nodeMove';

const mapFromObj = (o: any): Map<string, any> =>
  Object.keys(o).reduce((prev, k) => {
    prev.set(k + '', o[k]);
    return prev;
  }, new Map());

const n1 = nodeFactory({
  id: 'n1',
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

const w3 = wayFactory({
  id: 'w3',
  nodes: ['n3', 'n4', 'n5'],
});

const r1 = relationFactory({
  id: 'r1',
  members: [{ id: 'n4', ref: 'n4' }, { id: 'w2', ref: 'w2' }],
});

const r2 = relationFactory({
  id: 'r2',
  members: [
    { id: 'w1', ref: 'w1' },
    { id: 'w3', ref: 'w3' },
    { id: 'n4', ref: 'n4' },
    { id: 'n6', ref: 'n6' },
  ],
});

test('move a node with less dependencies', () => {
  const prevNode = n1;
  const newEntities = nodeMoveOp({
    idGen: simpleIdIncr,
    newLoc: { lat: 5, lon: 10 },
    parentRelationsLookup: mapFromObj({
      n1: [],
      w1: [r2],
      w2: [r1],
    }),
    parentWays: [w1, w2],
    prevNode,
  });

  expect(newEntities.map(r => r.id)).toEqual([
    'n1#0',
    'w1#0',
    'w2#0',
    'r2#0',
    'r1#0',
  ]);

  expect(newEntities.find(r => r.id === 'w1#0')).toMatchSnapshot();
  expect(newEntities.find(r => r.id === 'w2#0')).toMatchSnapshot();
  expect(newEntities.find(r => r.id === 'r2#0')).toMatchSnapshot();
});

test('move a node where the node and parentWay share a common relation', () => {
  const prevNode = n4;
  const newEntities = nodeMoveOp({
    idGen: simpleIdIncr,
    newLoc: { lat: 5, lon: 10 },
    parentRelationsLookup: mapFromObj({
      garbage: [],
      n4: [r1, r2],
      w3: [r2],
    }),
    parentWays: [w3],
    prevNode,
  });

  expect(newEntities.map(r => r.id)).toEqual(['n4#0', 'w3#0', 'r1#0', 'r2#0']);
  expect(
    (newEntities.find(r => r.id === 'r2#0') as Relation).members.map(r => r.id)
  ).toEqual(['w1', 'w3#0', 'n4#0', 'n6']);
  expect(
    (newEntities.find(r => r.id === 'r1#0') as Relation).members.map(r => r.id)
  ).toEqual(['n4#0', 'w2']);
});
