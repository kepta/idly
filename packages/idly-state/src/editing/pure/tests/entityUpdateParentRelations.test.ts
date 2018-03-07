import {
  nodeFactory,
  relationFactory,
} from 'idly-common/lib/osm/entityFactory';
import { entityUpdateParentRelations } from '../entityUpdateParentRelations';
import { simpleIdIncr } from './util';

const n4 = nodeFactory({
  id: 'n4',
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

test('it updates parentRelations', () => {
  const parentRelation = [r1, r2];
  const n4Hash0 = nodeFactory({
    id: 'n4#0',
  });
  const updated = entityUpdateParentRelations(
    n4,
    n4Hash0,
    parentRelation,
    simpleIdIncr
  );
  expect(updated[0].members.map(r => r.id)).toEqual(['n4#0', 'w2']);
  expect(updated[1].members.map(r => r.id)).toEqual(['w1', 'w3', 'n4#0', 'n6']);
});
