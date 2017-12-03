import { Shrub } from 'idly-common/lib/state/graph/shrub';
import { XML3 } from '../../misc/fixtures';
import {
  PromiseWorkerStub,
  stubWorkerLogic,
} from '../../mocks/PromiseWorkerStub';
import { xmlFetchMock } from '../../mocks/xmlFetchMock';
import { getFeaturesOfShrub } from './main';
import { operations } from '../operations';
import { setOsmTiles } from '../setOsmTiles/main';

import { getEntities } from '../getEntities/main';
declare var global: any;
// tslint:disable no-expression-statement no-object-mutation

describe('getFeaturesOfShrub', () => {
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
    const shrub = await getEntities(promiseWorker)({ entityIds: ['n1'] });
    const { entityTable } = shrub.toObject();
    const resp1 = getFeaturesOfShrub(promiseWorker)({
      shrubString: Shrub.create([], entityTable).toString(),
    });
    expect(await resp1).toMatchSnapshot();
  });
});
