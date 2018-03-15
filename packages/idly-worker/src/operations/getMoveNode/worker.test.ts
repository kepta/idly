import { stateCreate } from 'idly-state/lib';
import { workerGetMoveNode } from './worker';

test('output matches snapshot', () => {
  const state = {
    osmState: stateCreate(),
  };
  const func = workerGetMoveNode(state);
});
