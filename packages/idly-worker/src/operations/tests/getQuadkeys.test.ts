import { stateCreate } from 'idly-state/lib';
import { workerGetQuadkey } from '../getQuadkeys/worker';
import { expectStableMap, readJSON } from './utils';

test('output matches snapshot', async () => {
  const state = {
    osmState: stateCreate(),
  };
  const getQuadkey = workerGetQuadkey(state);
  const resp = await readJSON('./fixture.json').then(getQuadkey);
  const features = resp.response.features.sort((a: any, b: any) =>
    a.properties.id.localeCompare(b.properties.id)
  );

  expect(features).toHaveLength(407);

  expect(features.map(r => r.id)).toMatchSnapshot();

  expect(
    features.map(r => [r.id, JSON.stringify(r.properties)])
  ).toMatchSnapshot();

  expect(resp.state.osmState.modified.size).toBe(0);

  expect(resp.state.osmState.log.length).toBe(0);

  expectStableMap(resp.state.osmState.virgin.elements).toMatchSnapshot();

  expectStableMap(resp.state.osmState.derivedTable).toMatchSnapshot();
});
