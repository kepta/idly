import { stateCreate } from 'idly-state/lib';
import { workerGetMoveNode } from '../getMoveNode/worker';
import { workerGetQuadkey } from '../getQuadkeys/worker';
import { expectStableMap, readJSON } from './utils';

test('output matches snapshot', async () => {
  const state = {
    osmState: stateCreate(),
  };
  const getQuadkey = workerGetQuadkey(state);
  const func = workerGetMoveNode(
    (await readJSON('./fixture.json').then(getQuadkey)).state
  );

  const resp = await func({
    id: 'n42424641',
    loc: {
      lat: 40.7146116,
      lng: -71.9768601,
    },
    quadkeys: ['0320101101322322313'],
  });

  const features = resp.response.features.sort((a: any, b: any) =>
    a.properties.id.localeCompare(b.properties.id)
  );

  expect(features).toHaveLength(184);
  expect(features.map(r => r.id)).toMatchSnapshot();
  expect(
    features.map(r => [r.id, JSON.stringify(r.properties)])
  ).toMatchSnapshot();
  expect(resp.state.osmState.modified.size).toBe(19);
  expect(resp.state.osmState.log.length).toBe(1);
  expectStableMap(resp.state.osmState.virgin.elements).toMatchSnapshot();
  expectStableMap(resp.state.osmState.derivedTable).toMatchSnapshot();
});
