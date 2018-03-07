import { nodeFactory, wayFactory } from 'idly-common/lib/osm/entityFactory';
import { nodeUpdateParentWays } from '../nodeUpdateParentWays';
import { simpleIdIncr } from './util';

const n1 = nodeFactory({
  id: 'n1',
});

const w1 = wayFactory({
  id: 'w1',
  nodes: ['n1', 'n2'],
});

const w2 = wayFactory({
  id: 'w2',
  nodes: ['n1', 'n3'],
});

test('updates parent ways', () => {
  const parentWays = [w2, w1];
  const n1Hash0 = nodeFactory({
    id: 'n1#0',
  });
  const updated = nodeUpdateParentWays(n1, n1Hash0, parentWays, simpleIdIncr);
  expect(updated[0].nodes).toEqual(['n1#0', 'n3']);
  expect(updated[1].nodes).toEqual(['n1#0', 'n2']);
});
