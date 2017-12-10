import { XML3 } from '../../misc/fixtures';
import { stubWorkerLogic } from '../../mocks/PromiseWorkerStub';
import { xmlFetchMock } from '../../mocks/xmlFetchMock';
import { setOsmTiles } from '../setOsmTiles/main';

import { getFeaturesOfEntityIds } from './main';

declare var global: any;

describe('getFeaturesOfEntityIds', () => {
  global.fetch = xmlFetchMock(XML3);
  const promiseWorker = stubWorkerLogic();
  test('small xml test', async () => {
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const resp1 = getFeaturesOfEntityIds(promiseWorker)({ entityIds: ['n1'] });
    const resp2 = getFeaturesOfEntityIds(promiseWorker)({
      entityIds: ['n2', 'w1'],
    });
    expect(await resp1).toMatchSnapshot();
    expect(await resp2).toMatchSnapshot();
  });
  test.skip('non existent id should not fail', async () => {
    await setOsmTiles(promiseWorker)({
      bbox: [
        -73.98630242339283,
        40.73537277780156,
        -73.98264244865518,
        40.73941515574535,
      ],
      zoom: 17.54,
    });
    const resp1 = getFeaturesOfEntityIds(promiseWorker)({
      entityIds: ['non1'],
    });
    expect(await resp1).toMatchSnapshot();
  });
});
